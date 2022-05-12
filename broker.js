const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const io = new Server();

const pubClient = createClient({ url: "redis://159.223.127.139:6379" });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient,{key:"shyam"}));
io.listen(3000);