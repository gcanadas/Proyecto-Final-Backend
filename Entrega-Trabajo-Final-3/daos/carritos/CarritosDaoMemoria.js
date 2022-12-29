import ContenedorMemoria from '../../contenedores/contenedorMemoria.js';
import ProductosDaoMemoria from '../productos/ProductosDaoMemoria.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log/logger.js';
const productosRef = new ProductosDaoMemoria();

class CarritosDaoMemoria extends ContenedorMemoria {
    constructor() {
        super();
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
            logger.error('Error en el metodo newCart de CarritosDaoMemoria', err.message);
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
            logger.error('Error en el metodo newProduct de CarritosDaoMemoria', err.message);
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
            logger.error('Error en el metodo getProduct de CarritosDaoMemoria', err.message);
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
            logger.warn(`No se encontro ningun producto con el id:${productId}`);
            return false;
        } catch (error) {
            logger.error('Error en el metodo delProduct de CarritosDaoMemoria', err.message);
        }
    }
}

export default CarritosDaoMemoria;