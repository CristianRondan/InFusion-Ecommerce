class Producto{
    constructor(id, nombre, precio, img, alt, cantidad, descripcion){
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.img = img
        this.alt = alt
        this.cantidad = cantidad
        this.descripcion = descripcion
    }
}

class ProductoController{
    constructor(){
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos");
    }

    levantarProductos(){
        this.listaProductos = [
            new Producto(1, "Termo Stanley Classic 1,4 Lts", 39100, "../images/productos/termos/termo-stanley.png", "imagen termo stanley classic 1,4 litros", 10, "Totalmente a prueba de fugas y capaz de mantener las bebidas calientes durante 40 horas, frías durante 45 horas o con hielo durante 6 días."),
            new Producto(2, "Mate Stanley 236 ml", 17800, "../images/productos/mates/mate-stanley.png", "imagen mate stanley 236 mililitros", 10, "El mate Stanley mantiene la temperatura durante toda la cebada. Es práctico e higiénico."),
            new Producto(3, "Termo Thermos 1,2 Lts", 27000, "../images/productos/termos/termo-thermos.png", "imagen termo thermos 1,2 litros", 10, "Para que no te preocupes por la temperatura del agua para el mate te presentamos este termo de acero el cual mantiene tanto el calor como el frió durante 24hs."),
            new Producto(4, "Termo Waterdog Ombú 1 Lt", 15900, "../images/productos/termos/termo-waterdog.png", "termo waterdog ombú 1 litro", 10, "Acero 100% inoxidable, doble pared de aislamiento, recubrimiento powder coated, fácil de llenar, gracias a su boca ancha."),
            new Producto(5, "Mate Waterdog Inox Zoilo 240 Cc", 7600, "../images/productos/mates/mate-waterdog.png", "imagen mate waterdog inox zoilo 240 centimetros cúbicos", 10, "100% Acero Inoxidable AISI 304 / 304, doble pared aislante con superficie antideslizante, recubrimiento Powder Coated."),
            new Producto(6, "Termo Journey 1,3 Lts", 16400, "../images/productos/termos/termo-journey.png", "imagen termo journey 1,3 litros", 10, "Realizado con doble capa de Acero Inoxidable 304, manteniendo la temperatura en el interior del termo sin trasladarla a la capa exterior. Al ser de acero su peso es muy liviano aun estando cargado al máximo."),
            new Producto(7, "Mate Journey 236 Ml", 6900, "../images/productos/mates/mate-journey.png", "imagen mate journey 236 mililitros", 10, "Es ultraliviano, aún cargado su peso es cómodo para llevarlo con una mano y no se calienta por fuera gracias a su doble capa."),
            new Producto(8, "Termo Lumilagro 1 Lt", 18200, "../images/productos/termos/termo-lumilagro.png", "imagen termo lumilagro 1 litro", 10, "Termo de acero inoxidable. Capacidad 1000cc. Su doble pared de acero inoxidable y el proceso de vacío exclusivo garantiza una alta performance del producto y asegura el mantenimiento de temperatura por muchas horas. Tapón para mate o café.")        
        ]
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
    }

    darEventoCkickAnhadir(controladorCarrito){
    //Damos eventos
    this.listaProductos.forEach(producto => {
    const btnAnhadir = document.getElementById(`producto-${producto.id}`);
    btnAnhadir.addEventListener("click", () =>{
            controladorCarrito.agregar(producto);
            controladorCarrito.guardarEnStorage();
            controladorCarrito.mostrarEnModal();
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
        this.listaCarrito.push(producto);
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
                    <span>Cantidad: 1</span>
                    <p>Precio: $ ${producto.precio}</p>
                </div>
            </div>
            `
        })
        this.calcularTotal();
    }

    calcularTotal(){
        this.modalTotal.innerHTML = this.listaCarrito.reduce((acc, producto) => acc + producto.precio, 0);

        return this.modalTotal;
    }

}

const controladorProductos = new ProductoController();
controladorProductos.levantarProductos();

const controladorCarrito = new CarritoController();

//Verificar si existen productos en el Storage
controladorCarrito.levantarDeStorageSiExiste();
//Mostrar en DOM los productos
controladorProductos.mostrarEnDOM();
//Eventos
controladorProductos.darEventoCkickAnhadir(controladorCarrito);

