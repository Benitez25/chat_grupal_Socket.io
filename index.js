const express = require('express')
const app = express()
const path = require('path')

//Configurar el puerto definido en el sistema o en caso contrario el 3000
app.set('port', process.env.port || 3000)

//Asignamos una ruta estatica al archivo client
app.use(express.static(path.join(__dirname,'client')))
//Creamos el servidor y lo almacenamos en una variable para enviarlo al socket.io
const server = app.listen(app.get('port'), ()=>{console.log("Servidor habilitado")})


//SOCKET.IO
const socket = require('socket.io')
//Creamos connection al socket.io con el server previamente creado
const io = socket(server) 
//Conectar
io.on('connection', (socket)=>{
    //Enviamos a la consola que usuario ingreso (solo su id asignado por socket.io)
    console.log('Nuevo usuario ingresado con el ID: '+socket.id)
    //Recogemos el nombre de usuario enviado por el Cliente
    socket.on('usuario',(nombre)=>{
        //Le asignamos a socket.nombre el valos de nombre recogido del Cliente
        socket.nombre = nombre
    })
    
    //Recogemos el nombre del Cliente
    socket.on('datos', (datos)=>{
        //Emitir el nombre del Cliente a todos menos al usuario emitente
        socket.broadcast.emit('datos',datos)
         /*   {
         nombre: socket.nombre,
            mensaje: datos
        
        })*/
        //Emitimos por consola el nombre 
        console.log("Se registro: " + datos.nombre)
    })
    //Recogemos el mensaje del Cliente
    socket.on('chat:mensaje', (datos)=>{
        //Emitimos el mensaje al Cliente
        socket.broadcast.emit('chat:mensaje',datos)
    })
    //Recogemos el evento "escribiendo" emitido por el Cliente
    socket.on('chat:escribiendo', (dato)=>{
        //Emitimos el nombre de la persona que escribio
        socket.broadcast.emit('chat:escribiendo', dato)
    })
    //Saber quien Salio del chat
    socket.on('disconnect', ()=>{
        //Emitimos al cliente la persona que se desconecto
        socket.broadcast.emit('desconectar', socket.nombre)
        //Validamos si esa persona existe
        if(socket.nombre){
            //emitimos por consola el nombre de la persona
            console.log(socket.nombre + " desconectado con el ID: " + socket.id)
        }else{
            //Emitimos por consola un mensaje si esa persona no existe
            console.log("Usuario no regitrado desconectado con el ID: " + socket.id)                
        }
        
    })
})
