module.exports = {
  TrdEnv: Object.freeze({
    Simulate: 0, //仿真环境(模拟环境)
    Real: 1 //真实环境
  }),

  TrdMarket: Object.freeze({
    HK: 1,
    US: 2,
    CN: 3,
    HKCC: 4
  }),

  TrdOrderStatus: Object.freeze({
    Unsubmitted: 0, //未提交
    Unknown: -1, //未知状态
    WaitingSubmit: 1, //等待提交
    Submitting: 2, //提交中
    SubmittingFailed: 3, //提交失败，下单失败
    TimeOut: 4, //处理超时，结果未知
    Submitted: 5, //已提交，等待成交
    Filled_Part: 10, //部分成交
    Filled_All: 11, //全部已成
    Cancelling_Part: 12, //正在撤单_部分(部分已成交，正在撤销剩余部分)
    Cancelling_All: 13, //正在撤单_全部
    Cancelled_Part: 14, //部分成交，剩余部分已撤单
    Cancelled_All: 15, //全部已撤单，无成交
    Failed: 21, //下单失败，服务拒绝
    Disabled: 22, //已失效
    Deleted: 23 //已删除，无成交的订单才能删除
  }),

  //客户端下单只传Buy或Sell即可，SellShort是美股订单时服务器返回有此方向，BuyBack目前不存在，但也不排除服务器会传
  TrdSide: Object.freeze({
    Unknown: 0, //未知方向
    Buy: 1, //买入
    Sell: 2, //卖出
    SellShort: 3, //卖空
    BuyBack: 4 //买回
  }),

  TrdOrderType: Object.freeze({
    Unknown: 0, //未知类型
    Normal: 1, //普通订单(港股的增强限价订单、A股的限价委托、美股的限价订单)
    Market: 2, //市价订单(目前仅美股)
    AbsoluteLimit: 5, //绝对限价订单(目前仅港股)，只有价格完全匹配才成交，比如你下价格为5元的买单，卖单价格必须也要是5元才能成交，低于5元也不能成交。卖出同理
    Auction: 6, //竞价订单(目前仅港股)，A股的早盘竞价订单类型不变还是OrderType_Normal
    AuctionLimit: 7, //竞价限价订单(目前仅港股)
    SpecialLimit: 8, //特别限价订单(目前仅港股)，成交规则同增强限价订单，且部分成交后，交易所自动撤销订单
    SpecialLimitAll: 9 //特别限价且要求全部成交订单(目前仅港股)，要么全部成交，要么自动撤单
  }),

  TrdSecMarket: Object.freeze({
    Unknown: 0,
    HK: 1,
    US: 2,
    CN_SH: 31,
    CN_SZ: 32
  }),

  TrdModifyOrderOp: Object.freeze({
    Unknown: 0, //未知操作
    Normal: 1, //修改订单的价格、数量等，即以前的改单
    Cancel: 2, //撤单
    Disable: 3, //失效
    Enable: 4, //生效
    Delete: 5 //删除
  })
}
