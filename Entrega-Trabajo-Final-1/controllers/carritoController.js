const fs = require("fs");
const encoding = 'utf-8';
const { v4: uuidv4 } = require("uuid");
const prodController = require("./productsController");


const productos = new prodController("./db/productos.json");


class carritoController {
    constructor(archiveName) {
        this.archiveName = archiveName;
    }

    /*Defino metodos internos de la clase*/
    async readArchive (archiveName) {
        try {
            const data = await fs.promises.readFile(archiveName, encoding);
            return JSON.parse(data);
        } catch (err) {
            if(err.code === 'ENOENT') {
                return 'ENOENT';
            }
            console.log('Ocurrio un error durante la lectura del archivo:', err);
            throw new Error(err.message);
        }
    }

    async writeArchive (archiveName, content) {
        try {
            await fs.promises.writeFile(archiveName, JSON.stringify(content, null, 2));
        } catch (err) {
            console.log('Ocurrio un error durante la escritura del archivo:', err);
            throw new Error(err.message)
        }
    }

    async newCart() {
        try {
              const carts = await this.readArchive(this.archiveName);
              let cart = {};
              cart["id"] = uuidv4();
              cart["timestamp"] = new Date().toLocaleString();
              cart["productos"] = [];
              console.log(cart);
              carts.push(cart);
              await this.writeArchive(this.archiveName, carts);
              return cart["id"];
        } catch (err) {
              console.log(err);
        }
    }

    async delCart(id) {
        try {
            const carts = await this.readArchive (this.archiveName);
            if(carts.some((cart) => cart.id === id)){
                const cartFilter = carts.filter((cart) => cart.id !== id);
                await this.writeArchive(this.archiveName, cartFilter);
                return true
            }
            console.log(`No se encontro ningun producto con el id:${id}`);
            return false
        } catch (err) {
                console.log(err);
        }
    }

    async newProduct(cartId, productId) {
        try {
                const producto = await productos.getById(productId);
                let cart = await this.getById(cartId);
                let carts = await this.getAll();

                let cartProductos = [];
                cartProductos = [...cart.productos];
                cartProductos.push(producto);

                cart = {...cart, productos: cartProductos};
                carts = carts.filter((cart) => cart.id !== cartId);
                carts.push(cart);

                await this.writeArchive(this.archiveName, carts);
                console.log(`Productos agregado al carrito ${cartId} correctamente`)

                return true
            } catch (error) {
                    console.log(error.message);
            }
        }

        async getProduct(cartId) {
            try {
                let productos = [];
                let cart = await this.getById(cartId);
                cart.productos.map((producto) => {
                    productos.push(producto)
                });
                return productos;
            } catch(err) {
                console.log(err);
            }
        }

        async delProduct(cartId, productId) {
            try {
                let cart = await this.getById(cartId);
                let carts = await this.getAll();

                if(cart.productos.some((product) => product.id === productId)){
                    const productFilter = cart.productos.filter((product) => product.id !== productId);
                    const cartFilter = carts.filter((cart) => cart.id !== cartId);
                    cart = {...cart, productos: productFilter};
                    cartFilter.push(cart);

                    await this.writeArchive(this.archiveName, cartFilter);
                    return true;
                }
                console.log(`No se encontro ningun producto con el id:${productId}`);
                return false;
            } catch(err) {
                console.log(err);
            }
        }

        async getById (id) {
            try {
                const data = await this.readArchive (this.archiveName);
                if (data === 'ENOENT'){
                    console.log(`No se encontro el archivo`);
                    return null;
                }
                const dataFilter = data.filter((product) => product.id === id);
                if (dataFilter.length === 0) {
                    console.log(`No se encontró ningun carrito con el id: ${id}`);
                    return null;
                }
                return dataFilter[0];
            } catch(err) {
                console.log(err);
            }
        }

        async getAll () {
            try {
                const data = await this.readArchive (this.archiveName);
                if (data === 'ENOENT'){
                    console.log(`No se encontro el archivo`);
                    return null;
                }
                return data;
            } catch(err) {
                console.log(err);
            }
        }

}
module.exports = carritoController;