/* =========================
   CARRITO DE COMPRAS
========================= */

const botonesAgregar = document.querySelectorAll(".btn-agregar");

const carritoItems = document.getElementById("carrito-items");

const totalCarrito = document.getElementById("total-carrito");

const totalPago = document.getElementById("total-pago");

const botonPagar = document.getElementById("btn-pagar");

const tarjeta = document.getElementById("tarjeta");

const cuotas = document.getElementById("cuotas");

const mensajeCuotas = document.getElementById("mensaje-cuotas");

const formularioPago = document.getElementById("form-pago");


let carrito = [];


/* =========================
   FORMATO DE PRECIOS
========================= */

function formatoPrecio(precio) {

    return precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

}


/* =========================
   AGREGAR PRODUCTOS
========================= */

botonesAgregar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const id = boton.dataset.id;

        const nombre = boton.dataset.nombre;

        const precio = Number(boton.dataset.precio);


        const productoExistente = carrito.find(function (producto) {

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


/* =========================
   ACTUALIZAR CARRITO
========================= */

function actualizarCarrito() {

    carritoItems.innerHTML = "";


    if (carrito.length === 0) {

        carritoItems.innerHTML = `
            <p class="carrito-vacio">
                Todavía no agregaste productos.
            </p>
        `;

    }


    carrito.forEach(function (producto) {

        const item = document.createElement("div");

        item.classList.add("item-carrito");


        item.innerHTML = `
            <div>
                <h3>${producto.nombre}</h3>

                <p>
                    ${formatoPrecio(producto.precio)}
                    por unidad
                </p>
            </div>

            <div class="item-controles">

                <button
                    class="btn-restar"
                    data-id="${producto.id}">
                    -
                </button>

                <span>${producto.cantidad}</span>

                <button
                    class="btn-sumar"
                    data-id="${producto.id}">
                    +
                </button>

            </div>
        `;


        carritoItems.appendChild(item);

    });


    actualizarTotal();

    activarControlesCarrito();

}


/* =========================
   CONTROLES DEL CARRITO
========================= */

function activarControlesCarrito() {

    const botonesSumar = document.querySelectorAll(".btn-sumar");

    const botonesRestar = document.querySelectorAll(".btn-restar");


    botonesSumar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const id = boton.dataset.id;

            const producto = carrito.find(function (item) {

                return item.id === id;

            });


            if (producto) {

                producto.cantidad++;

                actualizarCarrito();

            }

        });

    });


    botonesRestar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const id = boton.dataset.id;

            const producto = carrito.find(function (item) {

                return item.id === id;

            });


            if (producto) {

                producto.cantidad--;

                if (producto.cantidad <= 0) {

                    carrito = carrito.filter(function (item) {

                        return item.id !== id;

                    });

                }

                actualizarCarrito();

            }

        });

    });

}


/* =========================
   CALCULAR TOTAL
========================= */

function calcularTotal() {

    return carrito.reduce(function (total, producto) {

        return total + producto.precio * producto.cantidad;

    }, 0);

}


function actualizarTotal() {

    const total = calcularTotal();

    totalCarrito.textContent = formatoPrecio(total);

    totalPago.textContent = formatoPrecio(total);


    botonPagar.disabled = carrito.length === 0;

}


/* =========================
   IR A PAGAR
========================= */

botonPagar.addEventListener("click", function () {

    if (carrito.length > 0) {

        document.getElementById("pagos").scrollIntoView({
            behavior: "smooth"
        });

    }

});


/* =========================
   OPCIONES DE CUOTAS
========================= */

tarjeta.addEventListener("change", function () {

    cuotas.innerHTML = "";


    if (tarjeta.value === "visa" || tarjeta.value === "mastercard") {

        cuotas.innerHTML = `
            <option value="1">1 pago</option>
            <option value="2">2 cuotas sin interés</option>
            <option value="3">3 cuotas sin interés</option>
        `;

        mensajeCuotas.textContent =
            "Visa y Mastercard: hasta 3 cuotas sin interés.";

    } else if (tarjeta.value === "amex") {

        cuotas.innerHTML = `
            <option value="1">1 pago</option>
        `;

        mensajeCuotas.textContent =
            "American Express: disponible únicamente en 1 pago.";

    } else {

        cuotas.innerHTML = `
            <option value="1">1 pago</option>
        `;

        mensajeCuotas.textContent =
            "Seleccioná una tarjeta para ver las opciones de pago.";

    }

});


/* =========================
   FORMATO DEL NUMERO
   DE TARJETA
========================= */

const numeroTarjeta = document.getElementById("numero-tarjeta");


numeroTarjeta.addEventListener("input", function () {

    let numero = numeroTarjeta.value.replace(/\D/g, "");

    numero = numero.substring(0, 16);

    numeroTarjeta.value = numero.replace(/(\d{4})(?=\d)/g, "$1 ");

});


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


    alert(
        "¡Compra simulada realizada!\n\n" +
        "Gracias, " + nombre + ".\n" +
        "Tarjeta: " + nombreTarjeta + "\n" +
        "Cuotas: " + cantidadCuotas + "\n" +
        "Total: " + formatoPrecio(calcularTotal()) +
        "\n\nEsta demostración no realiza pagos reales."
    );


    carrito = [];

    actualizarCarrito();

    formularioPago.reset();


    cuotas.innerHTML = `
        <option value="1">1 pago</option>
    `;

    mensajeCuotas.textContent =
        "Seleccioná una tarjeta para ver las opciones de pago.";

});
let historialCompras = JSON.parse(
    localStorage.getItem("comprasComicCon")
) || [];


// Mostrar las compras guardadas.

function mostrarCompras() {

    const historial = document.getElementById("historial-compras");

    historial.innerHTML = "";


    if (historialCompras.length === 0) {

        historial.innerHTML = `
            <p class="compras-vacias">
                Todavía no tenés compras realizadas.
            </p>
        `;

        return;

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

}


// Guardar el historial en el navegador.

function guardarHistorial() {

    localStorage.setItem(
        "comprasComicCon",
        JSON.stringify(historialCompras)
    );

}


// Mostrar el historial cuando se abre la página.

mostrarCompras();