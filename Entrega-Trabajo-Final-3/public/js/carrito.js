(function () {
    const cartProducts = document.getElementById('cartProducts');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
    const cartId = window.localStorage.getItem('cartId');
    const userName = window.localStorage.setItem('userName', userName.value);
    const userEmail = window.localStorage.setItem('userEmail', userEmail.value);
    const userPhone = window.localStorage.setItem('userPhone', userPhone.value);

    let products;

    async function delProductCart(id) {
        const options = {
            method: "DELETE"
        };
        await fetch(`./api/carrito/${cartId}/productos/${id}`, options)
            .then(() => {
                alert("Producto eliminado");
        });
        window.location.reload();
    }
    
    async function showCart() {
        await fetch(`./api/carrito/${cartId}/productos`)
            .then((res) => res.json())
            .then((res) => {
                products = res;
                products.forEach((e) => {
                    const divProduct = document.createElement("div");
                    divProduct.innerHTML = `
                                            <img src="${e.thumbnail}" alt="${e.title}" width="25px" height="25px">
                                            <h5>${e.title}</h5>
                                            <p>Precio: ${e.price}</p>
                                            <button onclick="delProductCart('${g.id || g._id}')">Eliminar</button>
                                            `
                    divProduct.id = `${e.id || e._id}`;
                    cartProducts.append(divProduct);
                });
            });
    }

    showCart();

    async function finishOrder (name, email, phone) {
        let body = {
            name,
            email,
            phone,
            message: `<h2>Detalle del pedido:</h2>\n`
        };
        productosCarrito.forEach((e) => {
            body.message += `<p>Nombre del producto: ${e.title}</p>
                            <p>Precio: ${e.price}</p>
                            <p>Stock: ${e.stock}</p>`;
        });
    
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        };
        await fetch('./confirmacion', options)
        .then(() => {
            alert("Pedido realizado");
        });
    }

    btnFinalizarCompra.addEventListener('click', (e) => {
       finishOrder (userName, userEmail, userPhone)
    })
})()