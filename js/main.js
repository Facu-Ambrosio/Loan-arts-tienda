// obtencion del array de objetos "productos" con un fetch, se guarda en localStorage
fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/productos.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("productos", JSON.stringify(data)))
  .catch(error => console.log(error));

  // funcion que crea notificaciones, donde se puede poner un texto y un color
const alertaNotificacion = (texto, color) => {
  color === "rojo" ? color = "#BF0603" : color = "#2EAC67" 
  Toastify({
    text: texto,
    className: "info",
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: `${color}`,
    }
  }).showToast();
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
    <button type="button" class="btn btn-danger" id = "${nombre}">
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
  let objeto = productos.find((el) => el.nombre === nombre);//{nombre: "dibujo", precio: "precio", cantidad: 1}

  let carrito = JSON.parse(localStorage.getItem("carrito")); 
  let objetoEnCarrito = carrito.find((el) => el.nombre === nombre); //existe en producto en carrito??

  if (!objetoEnCarrito){//no existe
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

// funcion que muestra en pantalla todos los productos del array 
const renderTotal = () => { //muestra en pantalla todos los productos y les agrega el evento
  let section = document.getElementById("sectionInicio"); //section donde van a mostrarse y ordenar todos los productos
  for (let i of productos){ //por cada obejo en el array productos
    let div = document.createElement("div");  //se crea un div en el HTML
    div.classList.add("card", "col", "cardInicio"); //se le agrega las siguientes clases
    div.innerHTML=`
    <img src="./Assets/Galeria/reescaladas/${i.nombre}.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${i.nombre}</h5>
      <p class="card-text">precio: ${i.precio}</p>
      <button type="button" class="btn btn-primary" id="${i.nombre}">Añadir al carrito </button>
    </div>
    `;// se define el interior de ese div
    section.appendChild(div); //se agrega el div en el section
  }
  let boton = document.getElementsByTagName("button"); //obtengo todos los botones de todos los div's creados antes
  for (let i of boton){//a cada boton de los div's que se generan en el section
    i.addEventListener("click", agregarAlCarritoStorage); //se le agrega un evento, agregarAlCarrito
  }
};

// inicializacion del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")); //inicializacion del carrito
carritoRenderTotal();
let productos = JSON.parse(localStorage.getItem("productos")); //array de productos
renderTotal(); //render de toda la pagina


