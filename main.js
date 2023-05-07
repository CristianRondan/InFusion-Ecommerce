class Producto{
    constructor(id, nombre, precio, cantidad, img, alt, stock, descripcion){
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = cantidad
        this.img = img
        this.alt = alt
        this.stock = stock
        this.descripcion = descripcion
    }
}

class ProductoController{
    constructor(){
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos");
    }

    async levantarYMostrar(controladorCarrito){
        const respuesta =  await fetch("baseDatos/bdProductos.json")
        this.listaProductos = await respuesta.json()

        this.mostrarEnDOM();
        this.darEventoCkickAnhadir(controladorCarrito);

    }

    mostrarEnDOM(){
        //Mostramos los productos de forma dinamica en DOM
        this.listaProductos.forEach(producto => {
        this.contenedor_productos.innerHTML += 
            `
            <div class="productosCardContainer">
                <div class="divImg">
                    <img src="${producto.img}" alt="${producto.alt}">
                </div>
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span>$ ${producto.precio}</span>
                <button class="botonAnhadir" id="producto-${producto.id}"><p>Añadir al carrito</p></button>
            </div>
            `
        });

        this.darEventoCkickAnhadir();
    }

    darEventoCkickAnhadir(controladorCarrito){
        this.listaProductos.forEach(producto => {
            const btnAnhadir = document.getElementById(`producto-${producto.id}`);
            btnAnhadir.addEventListener("click", () =>{
                    controladorCarrito.agregar(producto);
                    controladorCarrito.guardarEnStorage();
                    controladorCarrito.mostrarEnModal();
            
                    Toastify({
                        text: `${producto.nombre} añadido`,
                        duration: 3000,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "#2577bd",
                        }
                }).showToast();
            })
        })
    }
}

class CarritoController{
    constructor(){
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("modal_carrito");
        this.modalTotal = document.getElementById("modalTotal");
    }

    agregar(producto){
        let flag = false;

        for (let i = 0; i < this.listaCarrito.length; i++) {
            if (this.listaCarrito[i].id == producto.id) {
                this.listaCarrito[i].cantidad += 1;
                flag = true;
            }
        }

        if (flag == false) {
            this.listaCarrito.push(producto);            
        }
    }

    limpiarCarritoEnStorage(){
        localStorage.removeItem("listaCarritoKey")
    }

    guardarEnStorage(){
        //Convertir Objeto a JSON
        let listaCarritoJSON = JSON.stringify(this.listaCarrito);
        localStorage.setItem("listaCarritoKey", listaCarritoJSON);
    }

    levantarDeStorageSiExiste(){
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarritoKey')) || [];
        if(this.listaCarrito.length > 0){
            this.mostrarEnModal();
        }
    }

    limpiarContenedor(){
        //Limpio el contenedor para recorrer todo el arreglo y no se repitan los productos
        this.contenedor_carrito.innerHTML = ""
    }

    eliminar(producto){
        let posicion = this.listaCarrito.findIndex(miProducto => producto.id == miProducto.id)

        if (!(posicion == -1)) {
            this.listaCarrito.splice(posicion,1)
        }
    }

    mostrarEnModal(){
        this.limpiarContenedor();
        this.listaCarrito.forEach(producto =>{
            this.contenedor_carrito.innerHTML +=
            `
            <div class="modalCarritoContenido">
                <div class="modalCarritoDescripcion">
                    <div>
                        <img src="${producto.img}" alt="${producto.alt}">
                    </div>
                    <h4>${producto.nombre}</h4>
                </div>
                <div class="modalCarritoDetalle">
                    <span>Cantidad: ${producto.cantidad}</span>
                    <p>Precio: $ ${producto.precio}</p>
                    <div>
                        <button id="btnEliminar-${producto.id}"><img src="images/basura.png"></button>
                    </div>
                </div>
            </div>
            `
        })

        this.listaCarrito.forEach(producto => {
            const btnEliminarProducto = document.getElementById(`btnEliminar-${producto.id}`)

            btnEliminarProducto.addEventListener("click", () => {
                this.eliminar(producto);
                this.guardarEnStorage();
                this.mostrarEnModal();
            })
        })

        this.calcularTotal();
    }

    calcularTotal(){
        this.modalTotal.innerHTML = this.listaCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

        return this.modalTotal;
    }

    darEventoFinalizarCompra(){
        const btnCompra = document.getElementById("btnCompra");
            btnCompra.addEventListener("click", () => {
                if (this.listaCarrito.length > 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Compra finalizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                        })
                    controladorCarrito.limpiarContenedor();
                    controladorCarrito.limpiarCarritoEnStorage();
                    controladorCarrito.listaCarrito = [];
                    controladorCarrito.calcularTotal();    
                } else if(this.listaCarrito.length == 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'No hay productos en el carrito',
                        showConfirmButton: false,
                        timer: 1500
                        })
                }
            })
    }

    darEventoVaciarCarrito(){
        const btnVaciar = document.getElementById("btnVaciar");
        btnVaciar.addEventListener("click", () =>{
            controladorCarrito.limpiarContenedor();
            controladorCarrito.limpiarCarritoEnStorage();
            controladorCarrito.listaCarrito = [];
            controladorCarrito.calcularTotal();   
            
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'El carrito fue vaciado',
                showConfirmButton: false,
                timer: 1500
                })
        })
    }
}

const controladorProductos = new ProductoController();
const controladorCarrito = new CarritoController();

controladorProductos.levantarYMostrar(controladorCarrito);

//Verificar si existen productos en el Storage
controladorCarrito.levantarDeStorageSiExiste();

//Eventos
controladorCarrito.darEventoFinalizarCompra();
controladorCarrito.darEventoVaciarCarrito();

