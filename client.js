const { io } = require("socket.io-client");



const socket = io("http://192.81.211.187:3000",{transports:["websocket"]});
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    console.log(socket.connected); // true
  });

  
  socket.on("disconnect", () => {
    console.log(socket.connected); // false
  });
  
  socket.on("eAMC", (data) => {
      const now=Date.now();
    console.log(data,now);
  })