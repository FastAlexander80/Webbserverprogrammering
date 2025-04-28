const socket = io("http://localhost:3000")

socket.on("chat-massage", data=>{
    console.log(data)
})