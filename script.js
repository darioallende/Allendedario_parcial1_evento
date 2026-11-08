// TIENDA ARGENTINA COMIC CON 2026


// CARRITO DE COMPRAS

let carrito = [];


// FORMATO DE PRECIOS

function formatoPrecio(precio) {

    return "$" + precio.toLocaleString("es-AR");

}


// AGREGAR PRODUCTOS

const botonesAgregar = document.querySelectorAll(".add-cart");

botonesAgregar.forEach(boton => {

    boton.addEventListener("click", () => {

        const id = boton.dataset.id;

        const nombre = boton.dataset.name;

        const precio = Number(boton.dataset.price);


        const productoExistente = carrito.find(producto => {

            return producto.id === id;

        });


        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({

                id: id,

                nombre: nombre,

                precio: precio,

                cantidad: 1

            });

        }


        actualizarCarrito();

    });

});


// MOSTRAR PRODUCTOS EN EL CARRITO

function actualizarCarrito() {

    const lista = document.getElementById("cart-items");

    const mensajeVacio = document.getElementById("cart-empty");

    const totalHTML = document.getElementById("cart-total");


    if (!lista || !totalHTML) return;


    lista.innerHTML = "";


    mensajeVacio.style.display = carrito.length === 0

        ? "block"

        : "none";


    carrito.forEach((producto, indice) => {

        const elemento = document.createElement("div");

        elemento.classList.add("cart-item");


        elemento.innerHTML = `

            <div>

                <strong>${producto.nombre}</strong>

                <p>
                    Cantidad: ${producto.cantidad}
                </p>

            </div>

            <strong>
                ${formatoPrecio(producto.precio * producto.cantidad)}
            </strong>

            <button
                type="button"
                class="remove-product"
                data-indice="${indice}">

                QUITAR

            </button>

        `;


        lista.appendChild(elemento);

    });


    const total = carrito.reduce((suma, producto) => {

        return suma + producto.precio * producto.cantidad;

    }, 0);


    totalHTML.textContent = formatoPrecio(total);

}


// QUITAR PRODUCTOS

const listaCarrito = document.getElementById("cart-items");

if (listaCarrito) {

    listaCarrito.addEventListener("click", evento => {

        if (evento.target.classList.contains("remove-product")) {

            const indice = Number(evento.target.dataset.indice);

            carrito.splice(indice, 1);

            actualizarCarrito();

        }

    });

}


// VACIAR CARRITO

const botonVaciar = document.getElementById("clear-cart");

if (botonVaciar) {

    botonVaciar.addEventListener("click", () => {

        carrito = [];

        actualizarCarrito();

    });

}


// IR A LA SECCIÓN DE PAGO

const botonPagar = document.getElementById("go-payment");

if (botonPagar) {

    botonPagar.addEventListener("click", () => {

        if (carrito.length === 0) {

            alert("Primero agregá un producto al carrito.");

        } else {

            document.getElementById("pagos").scrollIntoView({

                behavior: "smooth"

            });

        }

    });

}


// OPCIONES DE CUOTAS SEGÚN LA TARJETA

const tarjeta = document.getElementById("payment-method");

const cuotas = document.getElementById("installments");

const mensajeCuotas = document.getElementById("installment-message");


if (tarjeta && cuotas) {

    tarjeta.addEventListener("change", () => {

        if (tarjeta.value === "Amex") {

            cuotas.innerHTML = `

                <option value="1">
                    1 pago
                </option>

            `;

            mensajeCuotas.textContent =

                "American Express permite solamente 1 pago.";

        } else {

            cuotas.innerHTML = `

                <option value="1">
                    1 pago
                </option>

                <option value="3">
                    3 cuotas sin interés
                </option>

            `;

            mensajeCuotas.textContent =

                "Con Visa y Mastercard podés elegir 3 cuotas sin interés.";

        }

    });

}


// FORMATO DEL NÚMERO DE TARJETA DE DEMOSTRACIÓN

const numeroTarjeta = document.getElementById("card-number");

if (numeroTarjeta) {

    numeroTarjeta.addEventListener("input", () => {

        let numero = numeroTarjeta.value.replace(/\D/g, "");

        numero = numero.substring(0, 16);

        numeroTarjeta.value = numero.replace(/(.{4})/g, "$1 ").trim();

    });

}


/* =========================
   CONFIRMAR COMPRA
========================= */

formularioPago.addEventListener("submit", function (evento) {

    evento.preventDefault();


    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;

    }


    const nombre = document.getElementById("nombre-pago").value;

    const medioPago = tarjeta.value;

    const cantidadCuotas = cuotas.value;


    if (!medioPago) {

        alert("Seleccioná un medio de pago.");

        return;

    }


    let nombreTarjeta = "";


    if (medioPago === "visa") {

        nombreTarjeta = "Visa";

    } else if (medioPago === "mastercard") {

        nombreTarjeta = "Mastercard";

    } else if (medioPago === "amex") {

        nombreTarjeta = "American Express";

    }


    // Crear el registro de la compra.

    const nuevaCompra = {

        codigo: "ACC-" + Date.now(),

        fecha: new Date().toLocaleString("es-AR"),

        nombre: nombre,

        tarjeta: nombreTarjeta,

        cuotas: cantidadCuotas + (
            cantidadCuotas === "1"
                ? " pago"
                : " cuotas sin interés"
        ),

        productos: carrito.map(function (producto) {

            return {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad
            };

        }),

        total: calcularTotal()

    };


    // Agregar la compra al historial.

    historialCompras.push(nuevaCompra);


    // Guardar las compras en el navegador.

    guardarHistorial();


    // Actualizar la sección Mis compras.

    mostrarCompras();


    alert(
        "¡Compra simulada realizada!\n\n" +
        "Gracias, " + nombre + ".\n" +
        "Código de compra: " + nuevaCompra.codigo + "\n" +
        "Tarjeta: " + nombreTarjeta + "\n" +
        "Total: " + formatoPrecio(nuevaCompra.total) +
        "\n\nTu compra quedó guardada en Mis compras."
    );


    // Vaciar el carrito.

    carrito = [];

    actualizarCarrito();

    formularioPago.reset();


    cuotas.innerHTML = `
        <option value="1">1 pago</option>
    `;

    mensajeCuotas.textContent =
        "Seleccioná una tarjeta para ver las opciones de pago.";

});

// INICIAR CARRITO

actualizarCarrito();
/* =========================
HISTORIAL DE COMPRAS
========================= */

// Recuperar las compras guardadas en el navegador.

let historialCompras = JSON.parse(
    localStorage.getItem("comprasComicCon")
) || [];


// ========================================
// MOSTRAR LAS COMPRAS GUARDADAS
// ========================================

function mostrarCompras() {

    const historial = document.getElementById("historial-compras");

    if (!historial) {
        return;
    }

    historial.innerHTML = "";


    if (historialCompras.length === 0) {

        historial.innerHTML = `
            <p class="compras-vacias">
                Todavía no tenés compras realizadas.
            </p>
        `;

        return;

    }


    // Mostrar primero la compra más reciente

    const comprasOrdenadas = [...historialCompras].reverse();


    comprasOrdenadas.forEach(function (compra) {

        const tarjetaCompra = document.createElement("article");

        tarjetaCompra.classList.add("compra-registrada");


        let productosHTML = "";


        compra.productos.forEach(function (producto) {

            productosHTML += `
                <div class="compra-producto">

                    <span>
                        ${producto.nombre}
                        x ${producto.cantidad}
                    </span>

                    <strong>
                        ${formatoPrecio(producto.precio * producto.cantidad)}
                    </strong>

                </div>
            `;

        });


        tarjetaCompra.innerHTML = `
            <h3>Compra ${compra.codigo}</h3>

            <div class="compra-datos">

                <span>
                    Fecha: ${compra.fecha}
                </span>

                <span>
                    Medio de pago: ${compra.tarjeta}
                </span>

                <span>
                    Cuotas: ${compra.cuotas}
                </span>

            </div>

            <div class="compra-productos">
                ${productosHTML}
            </div>

            <div class="compra-total">

                <span>Total</span>

                <strong>
                    ${formatoPrecio(compra.total)}
                </strong>

            </div>

            <span class="compra-estado">
                COMPRA SIMULADA REALIZADA
            </span>
        `;


        historial.appendChild(tarjetaCompra);

    });
}


    // Mostrar primero la compra más reciente.

    const comprasOrdenadas = [...historialCompras].reverse();


    comprasOrdenadas.forEach(function (compra) {

        const tarjetaCompra = document.createElement("article");

        tarjetaCompra.classList.add("compra-registrada");


        let productosHTML = "";


        compra.productos.forEach(function (producto) {

            productosHTML += `
                <div class="compra-producto">

                    <span>
                        ${producto.nombre}
                        x ${producto.cantidad}
                    </span>

                    <strong>
                        ${formatoPrecio(producto.precio * producto.cantidad)}
                    </strong>

                </div>
            `;

        });


        tarjetaCompra.innerHTML = `
            <h3>Compra ${compra.codigo}</h3>

            <div class="compra-datos">

                <span>
                    Fecha: ${compra.fecha}
                </span>

                <span>
                    Medio de pago: ${compra.tarjeta}
                </span>

                <span>
                    Cuotas: ${compra.cuotas}
                </span>

            </div>

            <div class="compra-productos">
                ${productosHTML}
            </div>

            <div class="compra-total">

                <span>Total</span>

                <strong>
                    ${formatoPrecio(compra.total)}
                </strong>

            </div>

            <span class="compra-estado">
                COMPRA SIMULADA REALIZADA
            </span>
        `;


        historial.appendChild(tarjetaCompra);

    });



// Guardar el historial en el navegador.

function guardarHistorial() {

    localStorage.setItem(
        "comprasComicCon",
        JSON.stringify(historialCompras)
    );

}


// Mostrar el historial cuando se abre la página.

mostrarCompras();