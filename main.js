const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
var intrinioSDK = require('intrinio-sdk');
//const redis = require('redis');
const Redis = require('ioredis');
const redis = new Redis({
    host: '161.35.135.239',
    port: 6379
});



const uWS = require('uWebSockets.js');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
intrinioSDK.ApiClient.instance.authentications['ApiKeyAuth'].apiKey = "OmRkNjFkMmJhZmMwZWFjYTc0Y2FlYWFkYjEwOTcyZWM5";
intrinioSDK.ApiClient.instance.enableRetries = true;
var options = new intrinioSDK.OptionsApi();

var opts = { 
  'source': null
};
// const app = express();
//  global.websocket=null;
// const httpServer = createServer(app);
// const io_admin = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     },
//     transports: ["websocket"] ,
//     wsEngine: require("eiows").Server
//   });
//   const jwtAuth = require('socketio-jwt-auth');
//   const { io } = require("socket.io-client");
// const { exit } = require("process");
//   const socket=io();

// io_admin.on("connection", (socket) => {
//   // ...
//   console.log("connected");
  
// });

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



// httpServer.listen(3000);

let wapp=uWS.App().ws('/*', {
	message: (ws, message, isBinary) => {
    
		/* Parse JSON and perform the action */
    let msg=decoder.write(Buffer.from(message));
    console.log(msg);
    ws.subscribe(msg);
	//	let json = JSON.parse(decoder.write(Buffer.from(message)));
		// switch (json.action) {
		// 	case 'sub': {
		// 		/* Subscribe to the share's value stream */
		// 		ws.subscribe(json.symbol);
    //     console.log(json.symbol);
		// 		break;
		// 	}
		// }
	}
}).listen(3000, (listenSocket) => {
	if (listenSocket) {
		console.log('Listening to port 9001');
	}
});



const main=()=>{
  redis.subscribe("shyam",(err,count)=>{
    console.log("subscribed to channel");
  });

redis.on("message",(channel,message)=>{
  console.log(message);
  wapp.publish(message.split("@")[0],message.split ("@")[1]);
});

}
main();




