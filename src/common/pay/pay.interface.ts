export interface WeChatPayOrder {
  appid: string; // 由微信生成的应用ID，全局唯一
  mchid: string; // 直连商户的商户号
  description: string; // 商品描述
  out_trade_no: string; // 商户订单号 时间 + 分类id + 随机数
  time_expire?: string; // 交易结束时间（可选）
  attach?: string; // 附加数据（可选）
  notify_url: string; // 通知地址
  goods_tag?: string; // 订单优惠标记（可选）
  support_fapiao?: boolean; // 电子发票入口开放标识（可选）

  amount: {
    total: number; // 订单总金额，单位为分
    currency?: string; // 货币类型（可选，默认CNY）
  };

  payer: {
    openid: string; // 用户标识
  };

  detail?: {
    cost_price?: number; // 订单原价（可选）
    invoice_id?: string; // 商品小票ID（可选）
    goods_detail?: GoodsDetail[]; // 单品列表
  };

  scene_info?: {
    payer_client_ip: string; // 用户终端IP
    device_id?: string; // 商户端设备号（可选）
    store_info?: StoreInfo; // 商户门店信息（可选）
  };

  settle_info?: {
    profit_sharing?: boolean; // 是否指定分账（可选）
  };
}

export interface GoodsDetail {
  merchant_goods_id: string; // 商户侧商品编码
  wechatpay_goods_id?: string; // 微信支付商品编码（可选）
  goods_name?: string; // 商品名称（可选）
  quantity: number; // 商品数量
  unit_price: number; // 商品单价
}

export interface StoreInfo {
  store_id: string; // 门店ID
  store_name?: string; // 门店名称（可选）
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WeChatPayParams
  extends Omit<
    WeChatPayOrder,
    'appid' | 'mchid' | 'notify_url' | 'out_trade_no'
  > {}

// 支付通知
export interface WechatPayNotification {
  id: string; // 通知的唯一ID
  create_time: string; // 通知创建时间，遵循rfc3339标准格式
  event_type: string; // 通知的类型，支付成功通知类型为TRANSACTION.SUCCESS
  resource_type: string; // 通知的资源数据类型
  resource: ResourceData; // 通知资源数据
}

export interface ResourceData {
  algorithm: string; // 加密算法类型，当前只支持AEAD_AES_256_GCM
  ciphertext: string; // Base64编码后的加密数据密文
  associated_data?: string; // 附加数据，非必填
  original_type: string; // 原始回调类型，为transaction
  nonce: string; // 加密使用的随机串
  summary: string; // 回调摘要
}

// 退款相关
export interface RefundBase {
  out_refund_no: string; // 商户退款单号，必填
  reason?: string; // 退款原因，非必填
  notify_url?: string; // 退款结果回调url，非必填
  funds_account?: string; // 退款资金来源，非必填，枚举值：AVAILABLE、UNAVAILABLE
  amount: RefundAmount; // 订单金额信息，必填
  from?: RefundSource[]; // 退款出资账户及金额，非必填
  goods_detail?: RefundGoodsDetail[]; // 退款商品详情，非必填
}

export interface RefundAmount {
  refund: number; // 退款金额，必填，单位为分
  total: number; // 原订单金额，必填，单位为分
  currency: string; // 退款币种，必填，目前只支持CNY
}

export interface RefundSource {
  account: string; // 出资账户类型，必填，枚举值：AVAILABLE、UNAVAILABLE
  amount: number; // 出资金额，必填，单位为分
}

export interface RefundGoodsDetail {
  merchant_goods_id: string; // 商户侧商品编码，必填
  wechatpay_goods_id?: string; // 微信支付商品编码，非必填
  goods_name?: string; // 商品名称，非必填
  unit_price: number; // 商品单价，必填，单位为分
  refund_amount: number; // 商品退款金额，必填，单位为分
  refund_quantity: number; // 商品退货数量，必填
}

interface RefundWithTransactionId extends RefundBase {
  transaction_id: string; // 微信支付订单号，二选一
  out_trade_no?: string; // 商户订单号，二选一
}

interface RefundWithOutTradeNo extends RefundBase {
  transaction_id?: string; // 微信支付订单号，二选一
  out_trade_no: string; // 商户订单号，二选一
}

export type RefundRequest = RefundWithOutTradeNo | RefundWithTransactionId;
