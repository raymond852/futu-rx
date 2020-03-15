const Futu = require('../index');
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
