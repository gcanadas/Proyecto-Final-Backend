import ContenedorFirebase from '../../contenedores/contenedorFirebase.js';
import ProductosDaoFirebase from '../productos/ProductosDaoFirebase.js';
import logger from '../../log/logger.js';
const productosRef = new ProductosDaoFirebase();

class CarritosDaosFirebase extends ContenedorFirebase {
    constructor() {
        super('carritos');
    }
    /*Metodo para crear un nuevo carrito*/
    async newCart() {
        try {
            let cart = {};
            cart['timestamp'] = new Date().toLocaleString();
            cart['productos'] = [];
            const result = this.save(cart);
            return result['_id'];
        } catch (error) {
            logger.error('Error en el metodo newCart de CarritosDaoFirebase', error.message);
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
        } catch (error) {
            logger.error('Error en el metodo newProduct de CarritosDaoFirebase', error.message);
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
        } catch (error) {
            logger.error('Error en el metodo getProduct de CarritosDaoFirebase', error.message);
        }
    }
    /*Metodo para eliminar los productos del carrito*/
    async delProduct(cartId, productId) {
        try {
            let cart = await this.getById(cartId);
            if(cart.productos.some((product) => product._id === productId)){
                const productFilter = cart.productos.filter((product) => product._id !== productId);
                cart = {...cart, productos: productFilter};

                await this.updateById(cartId, cart);
                return true;
            }
            logger.warn(`No se encontro ningun producto con el id:${productId}`);
            return false;
        } catch (error) {
            logger.error('Error en el metodo delProduct de CarritosDaoFirebase', error.message);
        }
    }
}

export default CarritosDaosFirebase;