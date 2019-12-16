# Futu Open API Rxjs Client
A Futu Open API client which implement the Futu Open API protocol and based on rx.js

## Protocol
https://futunnopen.github.io/futu-api-doc/protocol/intro.html

## Prerequisite 
Download and running Futu Opend
https://futunnopen.github.io/futu-api-doc/intro/FutuOpenDGuide.html

## Install
npm install futu-rx

## Usage 
```javascript
const Futu = require('futu-rx');
const toArray = require('rxjs/operators').toArray;
const concatAll = require('rxjs/operators').concatAll;
const rxjs = require('rxjs');

const clientConfig = {
  host: "127.0.0.1",
  port: 11111,
  accountId: 91236577,
  pwdMD5: "passwordmd5string"
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
    futu.trdPlaceOrder(Futu.Enum.TrdEnv.Real, Futu.Enum.TrdMarket.US, Futu.Enum.TrdSide.Sell, Futu.Enum.TrdOrderType.Normal, "AMD", 100, 35)
  ])
  .pipe(
    concatAll(),
    toArray()
  )
  .subscribe(
    (res) => {
      res.forEach((res) => console.log(res.response))
      console.log('onNext');
    },
    (err) => console.error(err),
    () => console.log('completed')
  );
```