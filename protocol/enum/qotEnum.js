module.exports = {
  QotRehabType: Object.freeze({
    None: 0,
    Forward: 1,
    Backward: 2
  }),

  QotTradeMarket: Object.freeze({
    HK: 1,
    US: 2,
    CN: 3
  }),

  QotKLType: Object.freeze({
    Min_1: 1,
    Min_5: 6,
    Min_15: 7,
    Min_30: 8,
    Min_60: 9,
    Min_3: 10,
    Day: 2,
    Week: 3,
    Month: 4,
    Year: 5,
    Quarter: 11
  }),

  QotSubType: Object.freeze({
    SubType_None: 0,
    SubType_Basic: 1, //基础报价
    SubType_OrderBook: 2, //摆盘
    SubType_Ticker: 4, //逐笔
    SubType_RT: 5, //分时
    SubType_KL_Day: 6, //日K
    SubType_KL_5Min: 7, //5分K
    SubType_KL_15Min: 8, //15分K
    SubType_KL_30Min: 9, //30分K
    SubType_KL_60Min: 10, //60分K
    SubType_KL_1Min: 11, //1分K
    SubType_KL_Week: 12, //周K
    SubType_KL_Month: 13, //月K
    SubType_Broker: 14, //经纪队列
    SubType_KL_Qurater: 15, //季K
    SubType_KL_Year: 16, //年K
    SubType_KL_3Min: 17, //3分K
  }),

  QotKLFields: Object.freeze({
    KLFields_High: 1, //最高价
    KLFields_Open: 2, //开盘价
    KLFields_Low: 4, //最低价
    KLFields_Close: 8, //收盘价
    KLFields_LastClose: 16, //昨收价
    KLFields_Volume: 32, //成交量
    KLFields_Turnover: 64, //成交额
    KLFields_TurnoverRate: 128, //换手率
    KLFields_PE: 256, //市盈率
    KLFields_ChangeRate: 512, //涨跌幅
  }),

  QotSecurityType: Object.freeze({
    SecurityType_Unknown: 0, //未知
    SecurityType_Bond: 1, //债券
    SecurityType_Bwrt: 2, //一揽子权证
    SecurityType_Eqty: 3, //正股
    SecurityType_Trust: 4, //信托,基金
    SecurityType_Warrant: 5, //窝轮
    SecurityType_Index: 6, //指数
    SecurityType_Plate: 7, //板块
    SecurityType_Drvt: 8, //期权
    SecurityType_PlateSet: 9 //板块集
  })
}
