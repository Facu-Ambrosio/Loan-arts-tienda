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
  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let total = carrito.reduce((acumulador, objeto) => acumulador + (objeto.precio * objeto.cantidad), 0); 
  let ul = document.getElementById("canvasCarrito");
  let li;
  if (carrito.length === 0){
    let liPrevio = document.getElementById("precioTotal");
    if(liPrevio){
      liPrevio.remove();
    }
    li = document.createElement("li")
    li.id = "precioTotal";
    li.classList.add("list-group-item", "precioCarrito", "align-items-center", "listItemsCarrito", "justify-content-center");  
    li.innerHTML=`
    <h5>El Carrito está Vacío</h5>
    `;
  } else {
    if(etapa === "inicio"){
      li = document.createElement("li");
      li.id = "precioTotal";
      li.classList.add("list-group-item", "precioCarrito", "align-items-center", "listItemsCarrito", "justify-content-center");  
    } else {
      li = document.getElementById("precioTotal");
    }
    li.innerHTML=`
    <h5>El Precio Total es de $${total}</h5>
    <button type="button" class="btn btn-success">Finalizar Compra</button>
    `;
  }
  ul.append(li);
}
// funcion que permite sacar elementos del carrito
const sacarDelCarrito = (e) => {
  // let btn = e.target;
  // let liABorrar = btn.parentNode.parentNode;
  // let id = liABorrar.id;
  // let nombre = id.replace(/_/g, " ");
  let liABorrar = (e.target).parentNode.parentNode;
  let nombre = (liABorrar.id).replace(/_/g, " ");
  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let carritoSinProducto = carrito.filter((el) => el.nombre != nombre);
  localStorage.setItem("carrito",JSON.stringify(carritoSinProducto));
  liABorrar.remove();
  renderPrecio("modificacion");
};

// hacer aparecer los elementos en el carrito
const renderCarrito = (objeto, operacion) => {
  let ul = document.getElementById("canvasCarrito");
  let nombre = objeto.nombre;
  let precio = objeto.precio;
  let cantidad = objeto.cantidad;
  let li;
  if (operacion === "crear"){
    li = document.createElement("li");
    li.classList.add("list-group-item", "listaCarrito", "align-items-center", "listItemsCarrito"); 
    li.id = `${nombre.replace(/ /g, "_")}` 
  } else if(operacion === "modificar") {
    li = document.getElementById(`${nombre.replace(/ /g, "_")}`);
  } 
  li.innerHTML=`
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
  ul.append(li);
  let btn = ul.querySelectorAll("button");
  for (let i of btn){
    i.addEventListener("click", sacarDelCarrito);
  }
};

// funcion mete los elementos en el carrito o les aumenta la cantidad
const agregarAlCarritoStorage = (e) => {
  let nombre = ((e.target.parentNode.parentNode).id).replace(/\./g, " ");

  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let objeto = productos.find((el) => el.nombre === nombre);
  let objetoEnCarrito = carrito.find((el) => el.nombre === nombre); 

  if (!objetoEnCarrito){
    objetoEnCarrito = objeto;
    carrito.push(objetoEnCarrito);
    localStorage.setItem("carrito",JSON.stringify(carrito));
    renderCarrito(objetoEnCarrito, "crear");
  } else {
    objetoEnCarrito.cantidad++;
    localStorage.setItem("carrito",JSON.stringify(carrito));
    renderCarrito(objetoEnCarrito, "modificar");
  }
  renderPrecio("modificacion");
  alertaNotificacion(`Has Agregado ${objetoEnCarrito.cantidad} producto/s de "${nombre}" al Carrito!!`, "verde" )
};

// funcion que cuando se inicia la pagina y se inicializa el carrito, se hace vacio, o se renderiza todos los elementos del carrito
const renderCarritoTotal = () => {
  if (!carrito){
    carrito = [];
    localStorage.setItem("carrito",JSON.stringify(carrito));
  } else {
    for (let i of carrito) {
      renderCarrito(i, "crear");
    }
  }
  renderPrecio("inicio");
};
// funcion que renderiza todo el main, todo el catalogo 
const renderTotal = () => { 
  let section = document.getElementById("sectionInicio"); 
  for (let i of productos){ 
    let div = document.createElement("div");  
    div.classList.add("card", "col", "cardInicio");
    div.id = `${i.nombre.replace(/ /g, ".")}`
    div.innerHTML=`
    <img src="./Assets/Galeria/reescaladas/${i.nombre}.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${i.nombre}</h5>
      <p class="card-text">precio: ${i.precio}</p>
      <button type="button" class="btn btn-primary">Añadir al carrito </button>
    </div>
    `;
    section.appendChild(div); 
    let btn = section.querySelectorAll(`button`);
    for (let i of btn){
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

