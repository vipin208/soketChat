const express=require('express');
const app=express();
const server=require('http').createServer(app);
const io = require('socket.io')(server);
const port=process.env.PORT || 3000;

io.on('connection',(socket)=>{
   console.log('socket.idbackend--->', socket.id)
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
    socket.on('message',(message)=>{
        console.log('msgbackend---->', message)
         io.emit('message',{type:'message',text:message,sender:socket.id});
    })
})
server.listen(port,()=>{
    console.log('Server running on port '+port);
})