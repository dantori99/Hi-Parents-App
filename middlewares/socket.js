const io = require('../server')

module.exports = {
    async useSocket (req, res, next) {
      io.io.on("connection", function(socket) {
        socket.on("submitChild", (text) => {
          io.io.emit("refreshAwaitingAppointment")
          console.log("emitting to nanny")
        })
      })
      next()
    },
    emitSocket(eventName, dataToSend) {
        io.io.emit(eventName, dataToSend)
    }
}