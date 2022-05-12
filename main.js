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



(async () => {

  const client = redis.createClient({ url:"redis://159.223.127.139:6379" });
  client.on('error', err => {
    console.log('Error ' + err);
});
  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('shyam', (message) => {
    console.log(message); // 'message'
    io_admin.sockets.emit(message.split("?")[0],message.split("?")[1]);
    const now = Date.now(); // Unix timestamp in milliseconds
console.log( now );
  });

})();