fetch("https://raw.githubusercontent.com/Facu-Ambrosio/proyectoFinalJS/main/data/catalogo.JSON")
      .then(response => response.json())
      .then(data => localStorage.setItem("productos", JSON.stringify(data)));

const alerta = (texto, color) => {
      if (color === "rojo"){
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

//funcion que aumente la cantidad
const sumar = (nombre, storage) => {
      storage.find((el) => el.nombre === nombre).cantidad += 1;
}
// funcion que agregue los articulos al array carrito, evento
const agregar = (e) => {
      let storage = JSON.parse(localStorage.getItem("carrito"));
      let nombre = e.target.id; //nombre del articulo, =====> STR
      let productos = JSON.parse(localStorage.getItem("productos"));
      let productoNombre = productos.find((el) => el.nombre === nombre); //agarra el objeto en el array productos =====> OBJETO
      if (!storage) {
            const storageNuevo = [];
            storageNuevo.push(productoNombre); //elemento agregado al array carrito
            localStorage.setItem("carrito", JSON.stringify(storageNuevo));
      } else {
            let existencia = storage.some((el) => el.nombre === nombre);
            if (existencia) {
                  sumar(nombre, storage);
            } else {
                  storage.push(productoNombre);
            }
            localStorage.setItem("carrito", JSON.stringify(storage));
      }
      alerta(`Agregó ${nombre} al Carrito!!` )
}

const main = () => {
      let mainCatalogo = document.getElementById("mainCatalogo");
      let botones = mainCatalogo.getElementsByTagName("button");
      for (let boton of botones) {
            boton.addEventListener("click", agregar);
      }
}

main()

