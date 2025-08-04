const productos = [
    {
        code: '001',
        name: 'iPhone 12 Pro 128GB',
        description: 'Excelente estado, con caja original y accesorios. Batería al 95%.',
        price: 450000,
        image: 'assets/images/iPhone 12 Pro 128GB.webp',
    },
    {
        code: '002',
        name: 'Bicicleta de Montaña Trek',
        description: 'Bicicleta en perfecto estado, poco uso, ideal para aventuras.',
        price: 90000,
        image: 'assets/images/Bicicleta de Montaña Trek.jpg',
    },
    {
        code: '003',
        name: 'MacBook Air M1 2021',
        description: 'Como nuevo, con garantía extendida hasta 2025.',
        price: 850000,
        image: 'assets/images/MacBook Air M1 2021.jpg',
    },
    {
        code: '004',
        name: 'Sofá 3 Cuerpos',
        description: 'Sofá cómodo y en buen estado, ideal para living.',
        price: 120000,
        image: 'assets/images/Sofá 3 Cuerpos.webp',
    },
    {
        code: '005',
        name: 'Cámara Canon EOS R6',
        description: 'Cámara profesional con lente 24-105mm incluido.',
        price: 1200000,
        image: 'assets/images/Cámara Canon EOS R6.jpg',
    },
    {
        code: '006',
        name: 'Guitarra Eléctrica Fender',
        description: 'Stratocaster americana, sonido increíble.',
        price: 65000,
        image: 'assets/images/Guitarra Eléctrica Fender.webp',
    },
    {
        code: '007',
        name: 'Tablet Samsung Galaxy Tab S8',
        description: 'Tablet de alta gama con S Pen incluido, ideal para trabajo y entretenimiento.',
        price: 420000,
        image: 'assets/images/Tablet Samsung Galaxy Tab S8.webp',
    },
    {
        code: '008',
        name: 'PlayStation 5 Digital',
        description: 'Consola nueva generación, incluye 2 controles y 3 juegos.',
        price: 380000,
        image: 'assets/images/PlayStation 5 Digital.webp',
    },
    {
        code: '009',
        name: 'Monitor Gaming 27" 144Hz',
        description: 'Monitor gamer con alta frecuencia de actualización, perfecto para esports.',
        price: 280000,
        image: 'assets/images/Monitor Gaming 27 144Hz.webp',
    },
    {
        code: '010',
        name: 'Drone DJI Mini 3 Pro',
        description: 'Drone compacto con cámara 4K, ideal para fotografía aérea profesional.',
        price: 520000,
        image: 'assets/images/Drone DJI Mini 3 Pro.jpg',
    }
];

// Array para el carrito de compras
let carrito = [];

// Daatos de solo lectura para los cálculos
const TASA_IVA = 0.19;
const TASA_DESPACHO = 0.05; 
const UMBRAL_DESPACHO = 100000; 

// Función para formatear precios en formato chileno
function formatearPrecio(precio) {
    return `$${precio.toLocaleString('es-CL')}`;
}

// Función para renderizar productos
function renderizarProductos() {
    const contenedorProductos = document.querySelector('.products-grid');
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const tarjetaProducto = document.createElement('article');
        tarjetaProducto.className = 'product-card';
        
        tarjetaProducto.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="product-card__image">
            <h3 class="product-card__title">
                <a href="#">${producto.name}</a>
            </h3>
            <p class="product-card__description">${producto.description}</p>
            <div class="product-card__price">${formatearPrecio(producto.price)}</div>
            <div class="product-card__footer">
                <div class="input-group mb-3">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 checkbox-producto" type="checkbox" data-codigo="${producto.code}">
                    </div>
                    <input type="number" class="form-control input-cantidad" min="1" value="0" data-codigo="${producto.code}">
                </div>
                <button class="btn btn-primary btn-sm btn-agregar" data-codigo="${producto.code}">Agregar</button>
            </div>
        `;
        
        contenedorProductos.appendChild(tarjetaProducto);
    });

    agregarEventos();
}

// Función para agregar eventos
function agregarEventos() {
    // Botones agregar al carrito
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', function() {
            const codigo = this.getAttribute('data-codigo');
            const checkbox = document.querySelector(`input[data-codigo="${codigo}"]`);
            const inputCantidad = document.querySelector(`.input-cantidad[data-codigo="${codigo}"]`);
            
            if (checkbox.checked) {
                const cantidad = parseInt(inputCantidad.value);
                if (cantidad > 0) {
                    agregarAlCarrito(codigo, cantidad);
                }
            } else {
                alert('Por favor selecciona el producto marcando la casilla.');
            }
        });
    });

    // Eventos de checkbox para feedback visual
    document.querySelectorAll('.checkbox-producto').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const codigo = this.getAttribute('data-codigo');
            const inputCantidad = document.querySelector(`.input-cantidad[data-codigo="${codigo}"]`);
            
            if (this.checked) {
                inputCantidad.style.backgroundColor = '#e7f3ff';
            } else {
                inputCantidad.style.backgroundColor = '';
            }
        });
    });
};

// Función para agregar productos al carrito
function agregarAlCarrito(codigo, cantidad) {
    const producto = productos.find(p => p.code === codigo);
    if (!producto) return;

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            codigo: producto.code,
            nombre: producto.name,
            precio: producto.price,
            cantidad: cantidad
        });
    }

    actualizarMostrarCarrito();
    actualizarContadorCarrito();
    
    // Feedback visual
    alert(`${producto.name} agregado al carrito (Cantidad: ${cantidad})`);
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(codigo) {
    carrito = carrito.filter(item => item.codigo !== codigo);
    actualizarMostrarCarrito();
    actualizarContadorCarrito();
}

// Función para actualizar contador del carrito en header
function actualizarContadorCarrito() {
    const contadorCarrito = document.querySelector('.header__user span');
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    contadorCarrito.textContent = totalItems > 0 ? `Carrito (${totalItems})` : 'Carrito';
}

// Función para calcular totales
function calcularTotales() {
    const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    const iva = subtotal * TASA_IVA;
    const neto = subtotal - iva;
    
    // Calcular cargo por despacho si aplica
    let despacho = 0;
    if (subtotal < UMBRAL_DESPACHO && subtotal > 0) {
        despacho = subtotal * TASA_DESPACHO;
    }
    
    const total = subtotal + despacho;
    
    return {
        neto,
        iva,
        subtotal,
        despacho,
        total,
    };
}

// Función para actualizar display del carrito
function actualizarMostrarCarrito() {
    let contenedorCarrito = document.getElementById('contenedor-carrito');
    
    // Crear contenedor si no existe
    if (!contenedorCarrito) {
        contenedorCarrito = document.createElement('div');
        contenedorCarrito.id = 'contenedor-carrito';
        contenedorCarrito.className = 'contenedor-carrito mt-4';
        
        const container = document.querySelector('.container');
        container.appendChild(contenedorCarrito);
    }

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '';
        return;
    }

    const totales = calcularTotales();
    
    contenedorCarrito.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Resumen de Compra</h3>
            </div>
            <div class="card-body">
                <div class="items-carrito">
                    ${carrito.map(item => `
                        <div class="item-carrito d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div>
                                <strong>${item.nombre}</strong><br>
                                <small>Código: ${item.codigo} | Cantidad: ${item.cantidad}</small>
                            </div>
                            <div class="text-end">
                                <div>${formatearPrecio(item.precio * item.cantidad)}</div>
                                <button class="btn btn-danger btn-sm mt-1" onclick="eliminarDelCarrito('${item.codigo}')">
                                    <i class="fa-solid fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="totales-carrito mt-3 p-3 bg-light rounded">
                    <div class="row">
                        <div class="col-6"><strong>Valor Neto:</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.neto)}</div>
                    </div>
                    <div class="row">
                        <div class="col-6"><strong>IVA (19%):</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.iva)}</div>
                    </div>
                    <div class="row">
                        <div class="col-6"><strong>Subtotal:</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.subtotal)}</div>
                    </div>
                    ${totales.despacho > 0 ? `
                    <div class="row text-warning">
                        <div class="col-6"><strong>Despacho (5%):</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.despacho)}</div>
                    </div>
                    ` : ''}
                    <hr>
                    <div class="row">
                        <div class="col-6"><h5>Total Final:</h5></div>
                        <div class="col-6 text-end"><h5 class="text-primary">${formatearPrecio(totales.total)}</h5></div>
                    </div>
                    ${totales.despacho === 0 && totales.subtotal > 0 ? '<small class="text-success">¡Envío gratis por compra superior a $100.000!</small>' : ''}
                </div>
            </div>
        </div>
    `;
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
});