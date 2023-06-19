// funcion asincronica que trae los datos de un JSON
const fetchData = async () => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/productos.json");
    const data = await response.json();
    localStorage.setItem("productos", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
// funcion de notificiaciones 
const alertaNotificacion = (texto, color) => {
  color === "rojo" ? color = "#BF0603" : color = "#2EAC67" 
  Toastify({
    text: texto,
    duration: 1500,
    stopOnFocus: false,
    className: "info",
    gravity: "bottom", 
    position: "right", 
    style: {
      background: `${color}`,
    }
  }).showToast();
};

// funcion que realiza el render del precio total
const renderPrecio = (etapa) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")); //se obtiene el carrito del storage
  let total = carrito.reduce((acumulador, objeto) => acumulador + (objeto.precio * objeto.cantidad), 0); //se calcula el precio total de los elementos dentro del carrito
  let listaCarrito = document.getElementById("canvasCarrito"); //ul del carrito
  let precioTotal; //declaracion de item de la lista que va a contener el precio total
  if (carrito.length === 0){ //si no hay elementos en el carrito
    let precioPrevio = document.getElementById("precioTotal"); //li del precio total existente (en caso de que se eliminen elementos del carrito hasta vaciarlo, se declara esta variable que obtiene dicho li)
    if(precioPrevio){ //si es el caso en que se eliminaron elementos hasta vaciarlo
      precioPrevio.remove(); //se remueve el li
    }
    precioTotal = document.createElement("li") //se crea otro li
    precioTotal.id = "precioTotal";
    precioTotal.classList.add("list-group-item", "precioCarrito", "align-items-center", "listItemsCarrito", "justify-content-center");  
    precioTotal.innerHTML=`
    <h5>El Carrito está Vacío</h5>
    `;
  } else { //si el carrito no esta vacio
    if(etapa === "inicio"){ //si se inicia la pagina
      precioTotal = document.createElement("li");
      precioTotal.id = "precioTotal";
      precioTotal.classList.add("list-group-item", "precioCarrito", "align-items-center", "listItemsCarrito", "justify-content-center");  
    } else { //si no se inicia la pagina
      precioTotal = document.getElementById("precioTotal");
    }
    precioTotal.innerHTML=`
    <h5>El Precio Total es de $${total}</h5>
    <button type="button" class="btn btn-success">Finalizar Compra</button>
    `;
  }
  listaCarrito.append(precioTotal);
}
// funcion que permite sacar elementos del carrito
const sacarDelCarrito = (e) => {
  let item = (e.target).parentNode.parentNode; //li del elemento del carrito
  let nombre = (item.id).replace(/_/g, " "); //nombre del producto
  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let carritoSinProducto = carrito.filter((el) => el.nombre != nombre); //carrito nuevo sin el producto que se quiere sacar
  localStorage.setItem("carrito",JSON.stringify(carritoSinProducto)); //se reemplaza el carrito viejo, con el que no tiene el elemntos que se saco
  item.remove(); //se remueve ese item del producto que estaba en el carrito
  renderPrecio("modificacion");
};

// hacer aparecer los elementos en el carrito
const renderCarrito = (objeto, operacion) => {
  let listaCarrito = document.getElementById("canvasCarrito"); //creacion de la lista que contiene los elementos del carrito
  let nombre = objeto.nombre;
  let precio = objeto.precio;
  let cantidad = objeto.cantidad;
  let productosCarrito; //li de los productos
  if (operacion === "crear"){ //si se agrega un elemento al carrito
    productosCarrito = document.createElement("li");
    productosCarrito.classList.add("list-group-item", "listaCarrito", "align-items-center", "listItemsCarrito"); 
    productosCarrito.id = `${nombre.replace(/ /g, "_")}` 
  } else if(operacion === "modificar") { //si se modifica la cantidad del producto en el carrito
    productosCarrito = document.getElementById(`${nombre.replace(/ /g, "_")}`);
  } 
  productosCarrito.innerHTML=`
  <div class = "divCarritoImagen col-2">
    <img src="../Assets/Galeria/reescaladas/${nombre}.jpg" class = "imagenCarrito">
  </div>
  <div class = "col-4">
    ${nombre} x ${cantidad}
  </div>
  <div class ="col-3  precioCarrito justify-content-end">
    Precio: $ ${cantidad * precio}
  </div>
  <div class = "col-2">
    <button type="button" class="btn btn-danger">
      Sacar del carrito
    </button>
  </div>
  `;
  listaCarrito.append(productosCarrito);
  let botonSacarDelCarrito = listaCarrito.querySelectorAll("button");
  for (let i of botonSacarDelCarrito){
    i.addEventListener("click", sacarDelCarrito);
  }
};

// funcion mete los elementos en el carrito o les aumenta la cantidad
const agregarAlCarritoStorage = (e) => {
  let nombre = ((e.target.parentNode.parentNode).id).replace(/\./g, " "); //nombre del producto que se quiere agregar al carrito

  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let objeto = productos.find((el) => el.nombre === nombre); //objeto que se quiere agregar
  let objetoEnCarrito = carrito.find((el) => el.nombre === nombre);  //verificacion si el objeto ya estaba en el carrito
  // si el producto no estaba en el carrito : si ya estaba el producto en el carrito
  !objetoEnCarrito ? (objetoEnCarrito = objeto, carrito.push(objetoEnCarrito),localStorage.setItem("carrito",JSON.stringify(carrito)),renderCarrito(objetoEnCarrito, "crear")) : (objetoEnCarrito.cantidad++,localStorage.setItem("carrito",JSON.stringify(carrito)),renderCarrito(objetoEnCarrito, "modificar"))
  renderPrecio("modificacion");
  alertaNotificacion(`Has Agregado ${objetoEnCarrito.cantidad} producto/s de "${nombre}" al Carrito!!`, "verde" )
};

// funcion que cuando se inicia la pagina y se inicializa el carrito, se hace vacio, o se renderiza todos los elementos del carrito
const renderCarritoTotal = () => {
  if (!carrito){ //si el carrito no existe al inicio de la pagina, se inicializa como un array vacio en el storage
    carrito = [];
    localStorage.setItem("carrito",JSON.stringify(carrito));
  } else {
    for (let i of carrito) { //se renderizan todos los elementos del carrito
      renderCarrito(i, "crear");
    }
  }
  renderPrecio("inicio");
};
// funcion que renderiza todo el catalogo 
const renderTotal = () => { 
  let catalogo = document.getElementById("sectionInicio"); 
  for (let i of productos){ 
    let card = document.createElement("div");  
    card.classList.add("card", "col", "cardInicio");
    card.id = `${i.nombre.replace(/ /g, ".")}`
    card.innerHTML=`
    <img src="./Assets/Galeria/reescaladas/${i.nombre}.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${i.nombre}</h5>
      <p class="card-text">precio: ${i.precio}</p>
      <button type="button" class="btn btn-primary">Añadir al carrito </button>
    </div>
    `;
    catalogo.appendChild(card); 
    let botonAñadirAlCarrito = catalogo.querySelectorAll(`button`);
    for (let i of botonAñadirAlCarrito){
      i.addEventListener("click", agregarAlCarritoStorage);
    }
  }
};

// main
let productos = JSON.parse(localStorage.getItem("productos")); 
let carrito = JSON.parse(localStorage.getItem("carrito")); 
fetchData();
renderTotal(); 
renderCarritoTotal();

