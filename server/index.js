const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const server = http.createServer();

const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: "https://video-streaming-app-sooty.vercel.app",
    methods: ["GET", "POST"],
    credentials: true, // if needed
  },
  allowEIO3: true,
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();


io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on('room:join', data => {
    const { email, room } = data
    emailToSocketIdMap.set(email, socket.id)
    socketidToEmailMap.set(socket.id, email)
    io.to(room).emit("user:joined", { email, id: socket.id })
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  })

  socket.on('user:call',({to, offer}) => {
    io.to(to).emit('incomming:call', { from: socket.id, offer })
  })

  socket.on('call:accepted',({ to, ans}) => {
    io.to(to).emit('call:accepted', { from: socket.id, ans })
  })

  socket.on('peer:nego:needed', ({to, offer}) => {
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
  })

  socket.on('peer:nego:done', ({to, ans}) => {
    io.to(to).emit('peer:nego:final', { from: socket.id, ans })
  })

  });
//   const PORT = 8000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });