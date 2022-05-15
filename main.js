const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
var intrinioSDK = require('intrinio-sdk');
const redis = require('redis');

intrinioSDK.ApiClient.instance.authentications['ApiKeyAuth'].apiKey = "OmRkNjFkMmJhZmMwZWFjYTc0Y2FlYWFkYjEwOTcyZWM5";
intrinioSDK.ApiClient.instance.enableRetries = true;
var options = new intrinioSDK.OptionsApi();

var opts = { 
  'source': null
};
const app = express();

const httpServer = createServer(app);
const io_admin = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ["websocket"] ,
    wsEngine: require("eiows").Server
  });
  const jwtAuth = require('socketio-jwt-auth');
  const { io } = require("socket.io-client");
const { exit } = require("process");
  const socket=io();

io_admin.on("connection", (socket) => {
  // ...
  console.log("connected");
  
});

const getData=()=>{
    options.getUnusualActivityUniversal(opts).then(function(data) {
      console.log(data.trades.length);
      data=data.trades;
      for(var i=0;i<data.length;i++){
        io_admin.sockets.emit(data[i].symbol,data[i]);
        io_admin.sockets.emit("shyam",data[i]);
      }
         
     
  
  }, function(error) {
  console.error(error);
  });
  }
  


  // setInterval(getData,1000);
// setInterval(()=>{

// },1000);



httpServer.listen(3000);



const smartFlowDataBySymbol = {};
const bidAskLastData = {};
(async () => {
  const client = redis.createClient({ url:"redis://165.227.81.96:6379" });
  client.on('error', err => {
    console.log('Error ' + err);
  });
  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('shyam', (message) => {
    const symbol = message.split("@")[0];
    const data = message.split("@")[1];
    if (bidAskLastData[symbol]) {
      bidAskLastData[symbol].push(data);
    } else {
      bidAskLastData[symbol] = [data];
      smartFlowDataBySymbol[symbol] = makeSmartFlowObject();
    }
    // io_admin.sockets.emit(symbol,data);
    const now = Date.now(); // Unix timestamp in milliseconds
// console.log( now );
  });

})();


setInterval(() => {calculateSmartFlow()}, 1000);


const calculateSmartFlow = async () => {
  console.time('-----------------SMART FLOW-------------------');
  for (let key in bidAskLastData) {
    let eqData = bidAskLastData[key];
    let smartFlowData = smartFlowDataBySymbol[key];
    let symbol = key;
    for (let i = 0; i < eqData.length; i++) {
      let data = eqData[i].split(',');
      if (['57', '58', '59'].indexOf(data.slice(-1)[0]) > -1) {
        smartFlowData.dp.push(data);
        continue;
      }
    }
    await io_admin.sockets.emit(symbol, [[1231234214, 12341234, 12342343, 12341234, 12342341243], [1234124, 12341234, 12341234, 12341234], {}, smartFlowData.dp])
  }
  console.timeEnd('-----------------SMART FLOW-------------------');
}


const makeSmartFlowObject = () => {
  return {
    dp: [],
  }
}
