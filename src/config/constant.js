export const CDN_HOST = 'http://test.9yiwu.com'

export const PLATFORMS = [
  { id: '1', name: 'YIWU', label: '易物研选' },
  { id: '2', name: 'JD', label: '京东自营' },
  { id: '4', name: 'WY', label: '网易严选' }
]

export const ORDER_STATUS = {
  '10': '待支付',
  '20': '待配货',
  '30': '待发货',
  '40': '待收货',
  '60': '交易完成',
  '90': '交易关闭'
}

export const PAY_WAY = {
  'ALIPAY': '支付宝钱包',
  'WEIXIN': '微信支付',
  'FEIMA': '飞马钱包',
  'YIWUCOIN': '易点支付'
}

export const REFUND_TYPE = {
  'REFUND_ONLY': '仅退款',
  'RETURN_AND_REFUND': '退货退款'
}

export const RECEIVE_FLAG = {
  'PENDING_RECEIVE': '未收到货物',
  'RECEIVED': '已收到货物'
}

export const REFUND_STATUS = {
  'REJECT': '退款失败',
  'IN_PROGRESSING': '审核中',
  'JUSTIFIED': '已修改',
  'PENDING_RETURN': '请退货',
  'USER_RETURNED': '已退货',
  'RECEIEVE_RETURN': '已收货',
  'NO_RECEIEVE_RETURN': '退货失败',
  'PENDING_REFUND': '退款中',
  'REFUNDED': '退款成功'
}

export const EXPRESS_TYPE = {
  'SF': { name: '顺丰快递', searchCode: 'shunfeng' },
  'JD': { name: '京东快递', searchCode: 'JD' },
  'YTO': { name: '圆通速递', searchCode: 'yuantong' },
  'STO': { name: '申通快递', searchCode: 'shentong' },
  'YUNDAEX': { name: '韵达快递', searchCode: 'yunda' },
  'BESTEX': { name: '百世汇通', searchCode: 'huitongkuaidi' },
  'ZTO': { name: '中通快递', searchCode: 'zhongtong' },
  'QFKD': { name: '全峰快递', searchCode: 'quanfengkuaidi' },
  'TTKDEX': { name: '天天快递', searchCode: 'tiantian' },
  'UCE': { name: '优速快递', searchCode: 'youshuwuliu' },
  'DEPPON': { name: '德邦物流', searchCode: 'debangwuliu' },
  'HOAU': { name: '天地华宇', searchCode: 'tiandihuayu' },
  'LBEX': { name: '龙邦物流', searchCode: 'longbanwuliu' },
  'YCG': { name: '远成物流', searchCode: 'yuanchengwuliu'},
  'ZENY': { name: '增益速递', searchCode: 'zengyisudi' },
  'SURE': { name: '速尔快递', searchCode: 'sue' },
  'EMS': { name: 'EMS', searchCode: 'ems' },
  'ZJS': { name: '宅急送', searchCode: 'zhaijisong' },
  'GTO': { name: '国通快递', searchCode: 'guotongkuaidi' },
  'ND': { name: '港中能达', searchCode: 'ganzhongnengda' },
  'KJSD': { name: '快捷速递', searchCode: 'kuaijiesudi' },
  'ANE': { name: '安能物流', searchCode: 'annengwuliu' }
}

export const getPlatform = (id) => {
  const index = _.findIndex(PLATFORMS, (platform) => {
    return platform.id == id
  })
  return index < 0 ? null : PLATFORMS[index]
}
