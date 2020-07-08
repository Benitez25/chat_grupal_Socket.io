const socket = io()

//body
var formulario = document.getElementById('formulario')
var submit = document.getElementById('formulario')
var chat = document.getElementById('chat')

//Formulario
var correo = document.getElementById('correo')
var nombre = document.getElementById('nombre')

//chat
var Areachat = document.getElementById('Chat-mensaje')
var usuario_R = document.getElementById('identificacion')
var escribiendo = document.getElementById('escribiendo')
var textA = document.getElementById('text_Area')
var cantidadU = document.getElementById('cantidadU')

/*Variable para contrar usuarios*/
var Ndatos = 0

/*Submit para registrar y emitir los datos*/
submit.addEventListener('submit', ()=>{
    formulario.style.display = 'none'
    chat.style.display = 'block'
    socket.emit('datos',({
        correo:correo.value,
        nombre:nombre.value
    }))

    /*emitir al Servidor el nombre del usuario*/
    socket.emit('usuario', nombre.value)
    
    usuario_R.innerHTML= nombre.value

    /*Recoger el nombre de la nueva persona que ingreso al chat para mostrarlo*/
    socket.on('datos', (datos)=>{
        if(datos.nombre){
            Adjuntar_I(datos.nombre, 'ingreso')
            scrollTo()
        }
    })
    
})

/*Evento para dar enter al TextArea*/
textA.addEventListener('keyup', (e)=>{
    if(e.key === 'Enter'){
        enviarMensaje(e.target.value)
    }
})

/*Evento para mostrar la persona que esta escribiendo dentro del TextArea*/
textA.addEventListener('keypress', ()=>{

    /*Emitir al servidor el nombre de la persona que esta escribiendo*/
    socket.emit('chat:escribiendo', nombre.value)
})

/*Recoger el nombre de la persona que escribio dentro del servidor y mostrarlo*/
socket.on('chat:escribiendo', (dato)=>{
    escribiendo.innerHTML = `${dato} escribiendo...`
})

/*Funcion que recoge lo escrito dentro del TextArea y el nombre de la persona*/
function enviarMensaje(msg){
    let mensaje = {
        nombre: nombre.value,
        mensaje: msg
    }
    Adjuntar(mensaje, 'mensajes_S')
    textA.value = ''
    scrollTo()

    /*Emitir el mensaje escrito del TextArea al servidor*/
    socket.emit('chat:mensaje',mensaje)
}

/*Recoger el mensaje escrito del servidor para mostrarlo en el chat*/
socket.on('chat:mensaje',(datos)=>{
    Adjuntar(datos, 'mensajes_E')
    scrollTo()
    escribiendo.innerHTML = ''
})

/*Funcion para Adjuntar mensajes Entrantes y Salientes en el chat*/
function Adjuntar(msg, type){
    //Creamos una variable que almacena un Div
    let Cdiv = document.createElement('div')
    //Creamos una variable que almacena el id que asignaremos al DIV
    let IdDiv = type
    //Le asignamos el id al DIV creado
    Cdiv.classList.add(IdDiv)
    //Creamos una variable que contenga el mensaje que va a mostrar en el chat
    let emision = `<h4>${msg.nombre}</h4><p>${msg.mensaje}</p>`
    //Almacenamos dentro de nuestro div el mensaje creado
    Cdiv.innerHTML = emision
    //Juntamos nuestro DIV formado al AREA-DEL-CHAT
    Areachat.appendChild(Cdiv)
}

/*funcion para mostrar siempre nuestros mensajes hacia abajo*/
function scrollTo(){
    Areachat.scrollTop = Areachat.scrollHeight
}


/*Recoge el dato enviado al servidor de los personas se registraron (para hacer el conteo)*/
socket.on('datos', (datos)=>{
    //Valida si el dato existe
    if(datos.nombre){
        //Asigna +1 por cada persona dentro del chat
        Ndatos = Ndatos+1
        //Para concatenar cantidad de usuarios ->  cantidadU.innerHTML = `<p>Cantidad igual ha: ${Ndatos}</p>`
    }
    //Mostrar cuantas personas estan dentro del chat -consola-
    console.log(Ndatos)
    scrollTo()
})

/*Recoge del servidor el nombre de la persona que se desconecto del chat */
socket.on('desconectar', (da)=>{
    //Valida si existe nombre
    if(da){
        Adjuntar_S(da, 'salida')
        scrollTo()
    }
})

/*Funcion para adjuntar el nombre de la persona que ingreso al chat*/
function Adjuntar_I(usuario,type){
    //Creamos una variable que almacena un Div
    let div = document.createElement('div')
    //Creamos una variable que almacena el id que asignaremos al DI
    let id = type
    //Le asignamos el id al DIV creado
    div.classList.add(id)
    //Creamos una variable que contenga el mensaje que va a mostrar en el chat
    let mensaje  = `<p> Ingreso ${usuario} al Chat </p>`
    //Almacenamos dentro de nuestro div el mensaje creado
    div.innerHTML = mensaje
    //Juntamos nuestro DIV formado al AREA-DEL-CHAT
    Areachat.appendChild(div)
}

/*Funcion para adjuntar el nombre de la persona que salio al chat*/
function Adjuntar_S(usuario,type){
    //Creamos una variable que almacena un Div
    let div = document.createElement('div')
     //Creamos una variable que almacena el id que asignaremos al DI
    let id = type
    //Le asignamos el id al DIV creado
    div.classList.add(id)
    //Creamos una variable que contenga el mensaje que va a mostrar en el chat
    let mensaje  = `<p> Salio ${usuario} del Chat </p>`
    //Almacenamos dentro de nuestro div el mensaje creado
    div.innerHTML = mensaje
    //Juntamos nuestro DIV formado al AREA-DEL-CHAT
    Areachat.appendChild(div)
}