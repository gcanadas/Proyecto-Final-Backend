import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';
import ProductosDaoArchivo from '../productos/ProductosDaoArchivos.js';
import { v4 as uuidv4 } from 'uuid';
const productosRef = new ProductosDaoArchivo();

class CarritosDaoArchivo extends ContenedorArchivo {
    constructor() {
        super('./db/carrito.json');
    }
    /*Metodo para crear un nuevo carrito*/
    async newCart() {
        try {
            let cart = {};
            cart['id'] = uuidv4();
            cart['timestamp'] = new Date().toLocaleString();
            cart['productos'] = [];
            this.save(cart);
            return cart['id'];
        } catch (err) {
            console.log('Error en el metodo newCart de CarritosDaoArchivo', err.message);
        }
    }

    /*Metodo para agregar producto en el carrito*/
    async newProduct(cartId, productId) {
        try {
            const producto = await productosRef.getById(productId);
            let cart = await this.getById(cartId);
            let cartProductos = [];
            cartProductos = [...cart.productos];
            cartProductos.push(producto);
            cart = {...cart, productos: cartProductos};
            await this.updateById(cartId, cart);
            return true               
        } catch (err) {
            console.log('Error en el metodo newProduct de CarritosDaoArchivo', err.message)
        }
    }
    /*Metodo para obtener los productos del carrito*/
    async getProduct(cartId) {
        try {
            let productos = [];
            let cart = await this.getById(cartId);
            cart.productos.map((item) => {
                productos.push(item)
            });
            return productos;
        } catch (err) {  
            console.log('Error en el metodo getProduct de CarritosDaoArchivo', err.message)
        }
    }
    /*Metodo para eliminar los productos del carrito*/
    async delProduct(cartId, productId) {
        try {
            let cart = await this.getById(cartId);
            if(cart.productos.some((product) => product.id === productId)){
                const productFilter = cart.productos.filter((product) => product.id !== productId);
                cart = {...cart, productos: productFilter};

                await this.updateById(cartId, cart);
                return true;
            }
            console.log(`No se encontro ningun producto con el id:${productId}`);
            return false;
        } catch (error) {
            console.log('Error en el metodo delProduct de CarritosDaoArchivo', err.message)
        }
    }
}

export default CarritosDaoArchivo;