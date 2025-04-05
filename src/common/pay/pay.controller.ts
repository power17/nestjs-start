import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateWxOrderDto } from './dto/create-wx-order.dto';
import { PayService } from './pay.service';
import { WechatPayNotification } from './pay.interface';

@Controller('pay')
export class PayController {
  constructor(private payService: PayService) {}
  // notify
  @Post('notify')
  notify(@Body() dto: WechatPayNotification) {
    console.log('🚀 ~ PayController ~ notify ~ body:', dto);
    const { resource } = dto;
    if (resource) {
      const { ciphertext, associated_data, nonce } = resource;
      const res = this.payService.decryptByApiV3({
        associated_data,
        nonce,
        ciphertext,
      });
      console.log('🚀 ~ PayController ~ notify ~ res:', res);
    }
    return 'ok';
  }

  @Post('notify-refund')
  notifyRefund(@Body() dto: any) {
    console.log('🚀 ~ PayController ~ notify ~ body:', dto);
    return 'ok';
  }

  @Post('order')
  async order(@Body() dto: CreateWxOrderDto) {
    const prepayId = await this.payService.getPrepayId(dto);
    const res = this.payService.getWxOrderInfo(prepayId);
    return res;
  }

  @Get('orderInfo')
  async getOrderInfo(
    @Query('transactionId') transactionId?: string,
    @Query('outTradeNo') outTradeNo?: string,
  ) {
    if (transactionId) {
      return this.payService.getOrderInfoByTransactionId(transactionId);
    }
    if (outTradeNo) {
      return this.payService.getOrlderInfoByOutTradeNo(outTradeNo);
    }
  }

  @Get('refundInfo')
  async getRefundInfo(@Query('outRefundNo') outRefundNo: string) {
    return this.payService.getRefundInfoByOutRefundNo(outRefundNo);
  }

  // 测试用
  // @Post('refund-test')
  // 退款订单ID，金额，原因
  // async refundTest(@Body() dto) {
  //   const res = await this.payService.refund(dto);
  //   return res;
  // }
}
