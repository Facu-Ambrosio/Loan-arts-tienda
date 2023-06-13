const alertaNotificacion = (texto, color) => {
  if (color === "rojo") {
    color = "#BF0603";
  } else {
    color = "#27C696";
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
}

const alerta = (texto, tipo) => {
  Swal.fire({
    position: 'center',
    icon: `${tipo}`,
    title: `${texto}`,
    showConfirmButton: false,
    timer: 2000
  })
}

const renderPrecioTotal = (accion) => {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  let total = carrito.reduce((acumulador, objeto) => acumulador + (objeto.precio * objeto.cantidad), 0);
  let section = document.getElementById("sectionCarrito");
  if (accion === "crear"){
    let div = document.createElement("div");
    div.id = "precioTotal"
    div.classList.add("alert", "alert-success");
    div.innerHTML= `
    El precio total es de $${total}
    `;
    section.append(div);
  } else{
    let div = document.getElementById("precioTotal");
    if(total === 0){
      div.remove();
      alerta("El Carrito Está Vacio, Vuelva al Inicio", "info");
    } else {
      div.innerHTML= `
      El precio total es de $${total}      
      `;
    }
  }
}

const sacarDelCarrito = (e) => { //evento de sacar del carrito
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  let nombre = e.target.id;
  let carritoNuevo = carrito.filter((el) => el.nombre != nombre);
  localStorage.setItem("carrito",JSON.stringify(carritoNuevo));
  let contenedor = e.target.parentNode.parentNode;
  contenedor.remove();
  renderPrecioTotal("modificar");
  alertaNotificacion(`Acabas de Sacar "${nombre}" del Carrito`, "rojo")
};

const renderTotal = () => { //crea los elementos html del carrito y les da un evento
  if(carrito.length === 0){
    alerta("El Carrito Está Vacio, Vuelva al Inicio", "info");
  } else {
    let ul = document.getElementById("ul");
    for (i of carrito){
      let li = document.createElement("li");
      li.classList.add("list-group-item", "listaCarrito", "align-items-center", "listItemsCarrito");
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
      `;
      ul.appendChild(li);
    }
    let boton = document.getElementsByTagName("button");
    renderPrecioTotal("crear");
    for (j of boton){
      j.addEventListener("click", sacarDelCarrito);
    }
  }
};

let carrito = JSON.parse(localStorage.getItem("carrito"));

renderTotal();









