// obtencion del array de objetos "productos" con un fetch, se guarda en localStorage
fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/productos.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("productos", JSON.stringify(data)))
  .catch(error => console.log(error));

// funcion que crea notificaciones, donde se puede poner un texto y un color
const alertaNotificacion = (texto, color) => {
  color === "rojo" ? color = "#BF0603" : color = "#27C696" 
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

// funcion que inicializa el carrito como un array vacio en el caso de que el carrito este vacio
const carritoVacio = () => {
  !carrito && (carrito = []); //si no existe ningun carrito en el localStorage, lo toma como un array vacio 
  localStorage.setItem("carrito",JSON.stringify(carrito)); //lo envia al localStorage
};

// funcion que agrega los elementos del index en forma de cards al carrito, y luego el carrito al localStorage
const agregarAlCarrito = (e) => {
  let nombre = e.target.id; //nombre del producto, presente como id en el <button> 
  let paraCarrito; //objeto que se sube al carrito
  let existencia = carrito.find((el) => el.nombre === nombre); //busca el objeto en el carrito
  existencia ? (existencia.cantidad++) : (paraCarrito = productos.find((el) =>el.nombre === nombre), carrito.push(paraCarrito)) //si el objeto en el carrito existe le aumenta la cantidad, si no existe, el objeto paraCarrito se define como el objeto guardado en productos, y luego se lo sube al carrito

  alertaNotificacion(`Has Agregado "${nombre}" a tu Carrito!!`, "verde") //notificacion de que se agrego un producto al carrito
  localStorage.setItem("carrito", JSON.stringify(carrito)); //subida del carrito al localStorage
}

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
    i.addEventListener("click", agregarAlCarrito); //se le agrega un evento, agregarAlCarrito
  }
};


// inicializacion del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")); //inicializacion del carrito
carritoVacio();//si esta vacio 
let productos = JSON.parse(localStorage.getItem("productos")); //array de productos
renderTotal(); //render de toda la pagina