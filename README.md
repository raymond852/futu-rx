# Futu Open API Rxjs Client
A Futu Open API client which implement the Futu Open API protocol and based on rx.js

## Protocol
https://futunnopen.github.io/futu-api-doc/protocol/intro.html

## Implemented Protocol

- [x] 1001 InitConnect
- [ ] 1002 GetGlobalState
- [ ] 1003 Nofity
- [x] 1004 KeepAlive
- [x] 2001 Trd_GetAccList
- [x] 2002 Trd_UnlockTrade
- [ ] 2008 Trd_SubAccPush
- [x] 2101 Trd_GetFunds
- [ ] 2102 Trd_GetPositionList
- [ ] 2111 Trd_GetMaxTrdQtys
- [ ] 2201 Trd_GetOrderList
- [x] 2202 Trd_PlaceOrder
- [ ] 2205 Trd_ModifyOrder
- [ ] 2208 Trd_UpdateOrder
- [x] 2221 Trd_GetHisotryOrderList
- [ ] 2222 Trd_GetHistoryOrderFillList
- [ ] 2222 Trd_GetHistoryOrderFillList
- [x] 3001 Qot_Sub
- [x] 3002 Qot_RegQotPush
- [x] 3003 QOt_GetSubInfo
- [x] 3004 Qot_GetBasicQot
- [ ] 3005 Qot_UpdateBasicQot
- [x] 3006 Qot_GetKL
- [ ] 3007 Qot_UpdateKL
- [x] 3008 Qot_GetRT
- [ ] 3009 Qot_UpdateRT
- [ ] 3010 Qot_GetTicker
- [ ] 3011 Qot_UpdateTicker
- [ ] 3012 Qot_GetOrderBook
- [ ] 3013 Qot_UpdateOrderBook
- [x] 3103 Qot_RequestHistoryKL
- [x] 3104 Qot_RequestHistoryKLQuota
- [x] 3202 Qot_GetStaticInfo
- [x] 3203 Qot_GetSecuritySnapshot

## Prerequisite 
Download and running Futu Opend
https://futunnopen.github.io/futu-api-doc/intro/FutuOpenDGuide.html

## Install
npm install futu-rx --save

## Usage 
```javascript
const Futu = require('futu-rx');
const toArray = require('rxjs/operators').toArray;
const concatAll = require('rxjs/operators').concatAll;
const rxjs = require('rxjs');

const clientConfig = {
  host: "127.0.0.1",
  port: 11111,
  accountId: 12345678,
  pwdMD5: "25d55ad283aa400af464c76d713c07ad"
}

var futu = new Futu(clientConfig);

futu.connectionStatus().subscribe((connectionStatus) => console.log(connectionStatus));

rxjs
  .from([
    futu.initConnect(),
    futu.trdGetAccList(),
    futu.trdUnlockTrade(true),
    futu.trdGetFunds(Futu.Enum.TrdEnv.Real, Futu.Enum.TrdMarket.US),
    futu.trdGetFunds(Futu.Enum.TrdEnv.Real, Futu.Enum.TrdMarket.HK),
    futu.trdGetHistoryOrderList(Futu.Enum.TrdEnv.Real, Futu.Enum.TrdMarket.HK, Date.now() - 3600000 * 24 * 365, Date.now()),
    futu.qotGetStaticInfo([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }]),
    futu.qotGetSecuritySnapshot([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }]),
    futu.qotRequestHistoryKL({
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }, Futu.Enum.QotRehabType.None, Futu.Enum.QotKLType.Day, "2020-02-29", "2020-03-10"),
    futu.qotRequestHistoryKLQuota(true),
    futu.qotGetSubInfo(),
    futu.qotGetBasicQot([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }]),
    futu.qotSub([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }], [Futu.Enum.QotSubType.SubType_Basic], [Futu.Enum.QotRehabType.None], true, true, true),
    futu.qotRegQotPush([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "00700"
    }], [Futu.Enum.QotSubType.SubType_Basic], [Futu.Enum.QotRehabType.None], true, true),
    futu.qotGetKL(Futu.Enum.QotRehabType.Backward, Futu.Enum.QotKLType.Min_1, Futu.Enum.QotTradeMarket.HK, "00700", 10),
    futu.qotGetBasicQot([{
      market: Futu.Enum.QotTradeMarket.HK,
      code: "0700"
    }])
  ])
  .pipe(
    concatAll(),
    toArray()
  )
  .subscribe(
    (res) => {
      res.forEach((res) => console.log(JSON.stringify(res.response)))
      console.log('onNext');
    },
    (err) => console.error(err),
    () => console.log('completed')
  );
```