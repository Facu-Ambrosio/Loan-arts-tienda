
fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/productos.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("productos", JSON.stringify(data)))
  .catch(error => console.log(error));
  
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
    el carrito esta vacio
    `;
  } else {
    if(etapa === "inicio"){
      li = document.createElement("li");
      li.id = "precioTotal";
      li.classList.add("list-group-item", "precioCarrito", "align-items-center", "listItemsCarrito", "justify-content-center");  
      li.innerHTML=`
      el precio total es de $${total}
      `;
    } else {
      li = document.getElementById("precioTotal");
      li.innerHTML=`
      el precio total es de $${total}
      `;
    }
  }
  ul.append(li);
}


const sacarDelCarrito = (e) => {
  let btn = e.target;
  let id = e.target.id
  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let liABorrar = btn.parentNode.parentNode;
  let nombre = id.replace(/_/g, " ");
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
    li.id = `${nombre.replace(/ /g, "_")}_li` 
  } else if(operacion === "modificar") {
    li = document.getElementById(`${nombre.replace(/ /g, "_")}_li`);
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
    <button type="button" class="btn btn-danger" id = "${nombre.replace(/ /g, "_")}">
      Sacar del carrito
    </button>
  </div>
  `;
  ul.append(li);

  let btn = document.getElementById(`${nombre.replace(/ /g, "_")}`);
  btn.addEventListener("click", sacarDelCarrito);
};

// agarra los productos y los mete en el carrito, o les aumenta la cantidad
const agregarAlCarritoStorage = (e) => {
  let nombre = e.target.id;
  let objeto = productos.find((el) => el.nombre === nombre);

  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let objetoEnCarrito = carrito.find((el) => el.nombre === nombre); 

  if (!objetoEnCarrito){
    objetoEnCarrito = objeto;
    carrito.push(objetoEnCarrito);
    localStorage.setItem("carrito",JSON.stringify(carrito));
    renderCarrito(objetoEnCarrito, "crear");
    renderPrecio("modificacion");
    // funcion que cree el li pero con le parametro vacio
  } else {
    objetoEnCarrito.cantidad++;
    localStorage.setItem("carrito",JSON.stringify(carrito));
    renderCarrito(objetoEnCarrito, "modificar");
    renderPrecio("modificar");
    // funcion que cree el li pero con los elementos del carrito
  }
  alertaNotificacion(`Has Agregado ${objetoEnCarrito.cantidad} producto/s de "${nombre}" al Carrito!!`, "verde" )
};

// cuando se inicia la pagina y se inicializa el carrito, so se hace vacio, o se renderiza todos los elementos del carrito
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

const renderTotal = () => { 
  let section = document.getElementById("sectionInicio"); 
  for (let i of productos){ 
    let div = document.createElement("div");  
    div.classList.add("card", "col", "cardInicio"); 
    div.innerHTML=`
    <img src="./Assets/Galeria/reescaladas/${i.nombre}.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${i.nombre}</h5>
      <p class="card-text">precio: ${i.precio}</p>
      <button type="button" class="btn btn-primary" id="${i.nombre}">Añadir al carrito </button>
    </div>
    `;
    section.appendChild(div); 
    let btn = document.getElementById(`${i.nombre}`);
    btn.addEventListener("click", agregarAlCarritoStorage)
  }
};


let productos = JSON.parse(localStorage.getItem("productos")); 
renderTotal(); 
let carrito = JSON.parse(localStorage.getItem("carrito")); 
renderCarritoTotal();

