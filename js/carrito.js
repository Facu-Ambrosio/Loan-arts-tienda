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
};

const alerta = (texto, tipo) => {
      Swal.fire({
            position: 'center',
            icon: `${tipo}`,
            title: `${texto}`,
            showConfirmButton: false,
            timer: 1500
      })
};


//funcion que quite elementos HTML, evento
const sacar = (e) => {
      let nombre = e.target.id;
      let carrito = JSON.parse(localStorage.getItem("carrito"));
      let carritoSinElemento = carrito.filter((el) => el.nombre !== nombre);
      if (carritoSinElemento.length === 0) {
            localStorage.removeItem("carrito");
            let precioCarrito = document.getElementById("precioCarrito");
            precioCarrito.innerHTML = "";
      } else {
            localStorage.setItem("carrito", JSON.stringify(carritoSinElemento));
            alertaNotificacion(`Eliminaste ${nombre} de tu Carrito!!`, "rojo")
      }
      let precioTotal = suma(carritoSinElemento);
      let precioCarrito = document.getElementById("precioCarrito");
      if (precioTotal === 0) {
            precioCarrito.innerHTML = '';
            alerta("Usted ha vaciado el carrito, regrese al inicio", "info");
      } else {
            precioCarrito.innerHTML = `
            <div class="alert alert-success" role="alert">
                  El precio total es de $${precioTotal}
            </div>
            `;
      }
      let liAsacar = document.getElementById(`${nombre}_Lista`);
      liAsacar.remove();
}

//funcion que calcule el precio totol
const suma = (carrito) => {
      let precios = []
      for (let i of carrito) {
            let precioIndividual = i.precio * i.cantidad;
            precios.push(precioIndividual);
      }
      let precioFinal = precios.reduce((acum, elem) => acum + elem, 0);
      return precioFinal;
}

//funcion que agregue elementos HTML de los productos
const listas = () => {
      let main = document.getElementById("mainCarrito");
      let ul = document.createElement("ul");
      ul.classList.add("list-group", "list-group-flush", "ulCarrito");
      let carrito = JSON.parse(localStorage.getItem("carrito"));
      if (carrito) {
            for (let i of carrito) {
                  let li = document.createElement("li");
                  li.id = `${i.nombre}_Lista`
                  li.classList.add("list-group-item", "listaCarrito", "align-items-center", "listItemsCarrito");
                  li.innerHTML = `
                  <div   class = "divCarritoImagen col-2">
                        <img src="../Assets/Galeria/reescaladas/${i.nombre}.jpg" class = "imagenCarrito">
                  </div>
                  <div class = "col-3">
                        ${i.nombre} x ${i.cantidad}
                  </div>
                  <div  class ="col-5  precioCarrito justify-content-end">
                       Precio: $ ${i.cantidad * i.precio}
                  </div>
                  <div   class = "col-2">
                        <button type="button" class="btn btn-danger" id = "${i.nombre}">
                              Sacar del carrito
                        </button>
                  </div>
                  `
                  ul.appendChild(li);
            }
            let precioTotal = suma(carrito);
            let precioCarrito = document.createElement("div");
            precioCarrito.id = "precioCarrito"
            precioCarrito.innerHTML = `
            <div class="alert alert-success" role="alert">
                  El precio total es de $${precioTotal}
            </div>
            `;
            main.appendChild(ul);
            main.appendChild(precioCarrito);
            let botones = main.getElementsByTagName("button");
            for (let i of botones) {
                  i.addEventListener("click", sacar);
            }
      } else {
            alerta("el carrito esta vacio", "info");
      }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


let carrito = JSON.parse(localStorage.getItem("carrito"));

listas();










