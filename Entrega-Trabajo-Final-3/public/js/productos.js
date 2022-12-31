(function () {
    const productsCard = document.getElementById('productsCard');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const cartId = document.getElementById('cartId');

    window.localStorage.setItem('userName', userName.value);
    window.localStorage.setItem('userEmail', userEmail.value);
    window.localStorage.setItem('userPhone', userPhone.value);
    window.localStorage.setItem('cartId', cartId.value);

    async function addToCart(id) {
        let productInfo;
        await fetch(`./api/productos/${id}`)
            .then((res) => res.json())
            .then((res) => {
                productInfo = res;
            });
    
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productInfo)
        };
    
        await fetch(`/api/carrito/${cartId.value}/productos`, options)
            .then(() => {
                alert("Producto agregado");
            });
    
        window.location.reload();
    }

    async function showProducts() {
        let data;
        await fetch("/api/productos/")
            .then((res) => res.json())
            .then((res) => {
                data = res;
            });
        data.forEach((e) => {
            const article = document.createElement("article");
            article.innerHTML = `
                                <div>
                                    <img src="${e.thumbnail}" alt="${e.title}" width="100px" height="100px">
                                    <h5>${e.title}</h5>
                                </div>
                                <p>${e.description}</p>
                                <div>
                                    <p>Precio: ${e.price}</p>
                                    <p>Stock: ${e.stock}</p>
                                </div>
                                <button onclick="addToCart('${e.id || e._id}')">Agregar a Carrito</button>
                                `;
            article.classList.add("product");
            article.id = `${e.id || e._id}`;
            productsCard.append(article);
        });
    }

    showProducts();

})()