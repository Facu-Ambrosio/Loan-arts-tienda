
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

const sacarCarrito = (e) => {
  let nombre = e;
  console.log(nombre);
};


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
  } else if(operacion === "sacar"){}

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
    <button type="button" class="btn btn-danger" id = "${nombre.replace(/ /g, "_")}_btn">
      Sacar del carrito
    </button>
  </div>
  `;
  ul.append(li);

  
};

const carritoRenderTotal = () => {
  if (!carrito){
    carrito = [];
    localStorage.setItem("carrito",JSON.stringify(carrito));
  } else {
    for (let i of carrito) {
      renderCarrito(i, "crear");
    }
  }
};

const agregarAlCarritoStorage = (e) => {
  let nombre = e.target.id;
  let objeto = productos.find((el) => el.nombre === nombre);

  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let objetoEnCarrito = carrito.find((el) => el.nombre === nombre); 

  if (!objetoEnCarrito){
    objetoEnCarrito = objeto;
    carrito.push(objetoEnCarrito);
    renderCarrito(objetoEnCarrito, "crear");
  } else {
    objetoEnCarrito.cantidad++;
    renderCarrito(objetoEnCarrito, "modificar");
  }
  alertaNotificacion(`Has Agregado ${objetoEnCarrito.cantidad} producto/s de "${nombre}" al Carrito!!`, "verde" )
  localStorage.setItem("carrito",JSON.stringify(carrito));
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


let carrito = JSON.parse(localStorage.getItem("carrito")); 
carritoRenderTotal();
let productos = JSON.parse(localStorage.getItem("productos")); 
renderTotal(); 


