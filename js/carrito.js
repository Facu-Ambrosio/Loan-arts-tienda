// funcion que crea notificaciones, donde se puede poner un texto y un color
const alertaNotificacion = (texto, color) => {
  color === "rojo" ? color = "#BF0603" : color = "#27C696";
  Toastify({
    text: texto,
    className: "info",
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: `${color}`,
    }
  }).showToast();
}
//funcion que muestra un alert con sweetAlert
const alerta = (texto, tipo) => {
  Swal.fire({
    position: 'center',
    icon: `${tipo}`,
    title: `${texto}`,
    showConfirmButton: false,
    timer: 2000
  })
}

// funcion que muestra el precio total de todo el carrito al final de este
const renderPrecioTotal = (accion) => { //dependiendo de la accion, si es crear el div de precio total cuando apenas se inicia la pagina, o modificar, cuando se sacan elementos del carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")); //carrito
  let total = carrito.reduce((acumulador, objeto) => acumulador + (objeto.precio * objeto.cantidad), 0); //precio total, precio * cantidad, del carrito
  let section = document.getElementById("sectionCarrito"); 
  if (accion === "crear"){ //si se crea el div de precioTotal
    let div = document.createElement("div"); //Se crea un div
    div.id = "precioTotal" //se le declara un id
    div.classList.add("alert", "alert-success", "precioTotalCarrito", "justify-content-between"); //se le añade las siguientes clases
    div.innerHTML= `
    <div>
      El precio total es de $${total}
    </div>
    <div class = "col-2">
      <button type="button" class="btn btn-success">Finalizar Compra</button>
    </div>
    `; //se crea su interior
    section.append(div); //se lo agrega al section
  } else { //si lo que se hace es modificar ese div, es decir, se van sacando elementos del carrito y se tiene que modificar el precio total 
    let div = document.getElementById("precioTotal"); //se obtiene el div previamente creado
    total === 0 ? (div.remove(), alerta("El Carrito Está Vacio, Vuelva al Inicio", "info")) : div.innerHTML = `
    <div>
      El precio total es de $${total}
    </div>
    <div class = "col-2">
      <button type="button" class="btn btn-success">Finalizar Compra</button>
    </div>
    `; //si el precio total es cero, quiere decir que se quitaron todos los elementos del carrito, por lo tanto se elimina el div, sino se va cambiando el interior de ese div
  }
}

//funcion que permite eliminar elementos del carrito 
const sacarDelCarrito = (e) => { //evento de sacar del carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")); //carrito
  let nombre = e.target.id;  //nombre del elemento
  let carritoNuevo = carrito.filter((el) => el.nombre != nombre); //se crea un array nuevo sin incluir el elemento que se quiere eliminar
  localStorage.setItem("carrito",JSON.stringify(carritoNuevo)); //se sube ese array nuevo al localStorage
  let contenedor = e.target.parentNode.parentNode; //se obtiene el contenedor del elemento en el carrito
  contenedor.remove(); //se lo remueve
  renderPrecioTotal("modificar"); //se modifica el precio total
  alertaNotificacion(`Acabas de Sacar "${nombre}" del Carrito`, "rojo") //se alerta al usuario que ha quitada tal elemento del carrito
};

// funcion que muestra en pantalla el carrito
const renderTotal = () => { //crea los elementos html del carrito y les da un evento
  if(carrito.length === 0){ //si el carrito esta vacio
    alerta("El Carrito Está Vacio, Vuelva al Inicio", "info");
  } else {
    let ul = document.getElementById("ul"); //se obtiene el ul del HTML
    for (i of carrito){ //por cada objeto en el carrito
      let li = document.createElement("li"); //se crea un li que lo contiene
      li.classList.add("list-group-item", "listaCarrito", "align-items-center", "listItemsCarrito"); //se le agrega las siguientes funciones
      li.innerHTML=`
      <div class = "divCarritoImagen col-2">
        <img src="../Assets/Galeria/reescaladas/${i.nombre}.jpg" class = "imagenCarrito">
      </div>
      <div class = "col-3">
        ${i.nombre} x ${i.cantidad}
      </div>
      <div class ="col-5  precioCarrito justify-content-end">
        Precio: $ ${i.cantidad * i.precio}
      </div>
      <div class = "col-2">
        <button type="button" class="btn btn-danger" id = "${i.nombre}">
          Sacar del carrito
        </button>
      </div>
      `; //se le añade contenido
      ul.appendChild(li); //se lo agrega al ul
    }
    renderPrecioTotal("crear"); //se crea el div de precio total y se lo muestra en pantalla
    let boton = document.getElementsByTagName("button"); //se le añade a cada boton un evento
    for (j of boton){ //por cada boton en cada li
      j.addEventListener("click", sacarDelCarrito); //se le añade el evento de sacar del carrito
    }
  }
};

// inicializacion del carrito
let carrito = JSON.parse(localStorage.getItem("carrito"));
// render de toda la pagina
renderTotal();









