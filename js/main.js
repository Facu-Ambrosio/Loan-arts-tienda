fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/productos.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("productos", JSON.stringify(data)))
  .catch(error => console.log(error));

const alerta = (texto, color) => {
  if (color === "rojo") {
    color = "#BF0603";
  } else {
    color = "#058C42";
  }
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

const agregarAlCarrito = (e) => {
  let nombre = e.target.id;
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  let paraCarrito = productos.find((el) =>el.nombre === nombre);  // { nombre: 'nombre', precio: "", cantidad: 1 }
  
  if (!carrito){ //CASO: CARRITO VACIO
    carrito = [];
  }  
  
  let existencia = carrito.find((el) => el.nombre === nombre);
  
  if (existencia){//CASO: CARRITO CON PRODUCTO REPETIDO
    existencia.cantidad++;
  } else { //CASO: CARRITO CON PRODUCTO NUEVO
    carrito.push(paraCarrito);
  }

  alerta(`Has Agregado "${nombre}" a tu Carrito!!`, "verde")
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

const renderTotal = () => { //muestra en pantalla todos los productos y les agrega el evento
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
  }

  let boton = document.getElementsByTagName("button");
  for (let i of boton){
    i.addEventListener("click", agregarAlCarrito);
  }
};


let productos = JSON.parse(localStorage.getItem("productos"));
renderTotal();