import { Injectable, Logger } from '@nestjs/common';
import {
  RefundRequest,
  WeChatPayOrder,
  WeChatPayParams,
} from './pay.interface';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import rand from 'randomstring';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

@Injectable()
export class PayService {
  private axiosInstance: AxiosInstance;
  private readonly logger = new Logger();

  constructor(private configService: ConfigService) {
    this.axiosInstance = axios.create({
      timeout: 10000,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const url = config.url;
        const method = config.method?.toUpperCase() || 'GET';
        const body = config.data || '';

        const queryParams = config.params || {};
        const encodedQuery = this.encodeQueryParams(queryParams);

        const headers = this.getSignHeaders({
          url: url + (encodedQuery ? `?${encodedQuery}` : ''),
          method,
          body,
        });

        config.headers['Authorization'] = headers.Authorization;
        return config;
      },
      (error) => {
        this.logger.error('WxAxiosInstance Request error:', error);
        return Promise.reject(new Error(error));
      },
    );
  }

  encodeQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        // 对参数值进行 URL 编码
        searchParams.append(
          key,
          encodeURIComponent(JSON.stringify(params[key])),
        );
      }
    }

    return searchParams.toString();
  }

  rsaSign(message: string) {
    const keyPem = fs.readFileSync(
      path.join(__dirname, '../../assets/keys/apiclient_key.pem'),
      'utf-8',
    );
    const signature = crypto
      .createSign('RSA-SHA256')
      .update(message, 'utf-8')
      .sign(keyPem, 'base64');
    return signature;
  }

  // associate, // 加密参数 - 类型
  // nonce, // 加密参数 - 随机数
  // ciphertext, // 加密密文
  decryptByApiV3({ associated_data, nonce, ciphertext }) {
    const apiV3Key = this.configService.get<string>('WX_APIV3_KEY');
    ciphertext = decodeURIComponent(ciphertext);
    ciphertext = Buffer.from(ciphertext, 'base64');

    const authTag = ciphertext.slice(ciphertext.length - 16);
    const data = ciphertext.slice(0, ciphertext.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', apiV3Key, nonce);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associated_data));
    let decryptedText = decipher.update(data, 'binary', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
  }

  getSignHeaders({ url, method, body }) {
    // HTTP请求方法\n
    // URL\n
    const tmpUrl = new URL(url);
    const pathname = /http/.test(url) ? tmpUrl.pathname + tmpUrl.search : url;
    // 请求时间戳\n
    const timestamp = Math.floor(Date.now() / 1000);
    // 请求随机串\n
    const nonceStr = rand.generate(32).toUpperCase();
    // 请求报文主体\n
    const bodyData = body ? JSON.stringify(body) : '';
    const message = `${method.toUpperCase()}\n${pathname}\n${timestamp}\n${nonceStr}\n${bodyData}\n`;
    const signature = this.rsaSign(message);
    const wxAuthType = this.configService.get<string>(
      'WX_AUTH_TYPE',
      'WECHATPAY2-SHA256-RSA2048',
    );
    const headers = {
      Authorization: `${wxAuthType} mchid="${this.configService.get<string>('WX_MCHID')}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.configService.get<string>('WX_CERT_NO')}"`,
    };
    return headers;
  }

  getTradeNo() {
    return (
      dayjs().format('YYYYMMDDHHmmssSSS') +
      '01' +
      Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(10, '0')
    );
  }

  // Method: POST
  async getPrepayId(params: WeChatPayParams) {
    const out_trade_no = this.getTradeNo();
    console.log('🚀 ~ PayService ~ getPrepayId ~ out_trade_no:', out_trade_no);
    const wxParams: WeChatPayOrder = {
      appid: this.configService.get<string>('WX_APPID'),
      mchid: this.configService.get<string>('WX_MCHID'),
      notify_url: this.configService.get<string>('WX_NOTIFY_PAY', ''),
      out_trade_no,
      time_expire: dayjs().add(30, 'm').format(),
      ...params,
    };
    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
    try {
      const { status, data } = await this.axiosInstance.post(url, wxParams);
      if (status === 200 && data && data['prepay_id']) {
        return data['prepay_id'];
      } else {
        this.logger.error('getPrepayId error prepay_id is null');
        return '';
      }
    } catch (error) {
      this.logger.error('getPrepayId error:', error);
    }
  }

  getWxOrderInfo(prepayId: string) {
    const appId = this.configService.get<string>('WX_APPID');
    const timeStamp = Math.floor(Date.now() / 1000) + '';
    const nonceStr = rand.generate(32).toUpperCase();
    const packageValue = `prepay_id=${prepayId}`;
    const signType = 'RSA';

    const message = `${appId}\n${timeStamp}\n${nonceStr}\n${packageValue}\n`;
    const paySign = this.rsaSign(message);
    return {
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
    };
  }

  async getOrderInfoByTransactionId(transactionId: string) {
    const mchid = this.configService.get<string>('WX_MCHID');
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/id/${transactionId}?mchid=${mchid}`;
    try {
      const { status, data } = await this.axiosInstance.get(url);
      if (status === 200) {
        return data;
      }
      return {
        message: '查询失败，无数据响应',
      };
    } catch (error) {
      this.logger.error('getOrderInfoByTransactionId error:', error);
    }
  }

  // 请求URL :https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}
  async getOrlderInfoByOutTradeNo(outTradeNo: string) {
    const mchid = this.configService.get<string>('WX_MCHID');
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${outTradeNo}?mchid=${mchid}`;
    try {
      const { status, data } = await this.axiosInstance.get(url);
      if (status === 200) {
        return data;
      }
      return {
        message: '查询失败，无数据响应',
      };
    } catch (error) {
      this.logger.error('getOrlderInfoByOutTradeNo error:', error);
    }
  }

  async refund(params: RefundRequest) {
    // https://api.mch.weixin.qq.com/v3/refund/domestic/refunds
    const url = 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds';
    params.notify_url = this.configService.get<string>('WX_NOTIFY_REFUND');
    // TODO 形成随机的退款单号
    params.out_refund_no = this.getTradeNo();
    try {
      const res = await this.axiosInstance.post(url, params);
      console.log('🚀 ~ PayService ~ refund ~ res:', res);
    } catch (error) {
      this.logger.error('refund error:', error);
    }
  }

  async getRefundInfoByOutRefundNo(outRefundNo: string) {
    // https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/{out_refund_no}
    const url = `https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/${outRefundNo}`;
    try {
      const { status, data } = await this.axiosInstance.get(url);
      if (status === 200) {
        return data;
      }
      return {
        message: '查询失败，无数据响应',
      };
    } catch (error) {
      this.logger.error('getRefundInfoByOutRefundNo error:', error);
    }
  }
}
