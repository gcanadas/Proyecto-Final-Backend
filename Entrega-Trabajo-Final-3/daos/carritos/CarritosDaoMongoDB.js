import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js';
import ProductosDaoMongoDb from './../productos/ProductosDaoMongoDb.js';
import CartModel from '../../models/carritos.js';
import logger from '../../log/logger.js';

const productosRef = new ProductosDaoMongoDb();
class CarritosDaosMongoDb extends ContenedorMongoDb {
    constructor() {
        super(CartModel);
    }
    /*Metodo para crear un nuevo carrito*/
    async newCart(email) {
        try {
            let cart = {};
            cart['timestamp'] = new Date().toLocaleString();
            cart['productos'] = [];
            cart['email'] = email;
            const result = this.save(cart);
            return result['_id'];
        } catch (error) {
            logger.error('Error en el metodo newCart de CarritosDaoMongoDb', error.message);
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
            logger.error('Error en el metodo newProduct de CarritosDaoMongoDb', error.message);
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
            logger.error('Error en el metodo getProduct de CarritosDaoMongoDb', error.message);
        }
    }
    /*Metodo para eliminar los productos del carrito*/
    async delProduct(cartId, productId) {
        try {
            let cart = await this.getById(cartId);
            if(cart.productos.some((product) => product._id.toString() === productId)){
                const productFilter = cart.productos.filter((product) => product._id.toString() !== productId);
                cart = {...cart, productos: productFilter};

                await this.updateById(cartId, cart);
                return true;
            }
            logger.warn(`No se encontro ningun producto con el id:${productId}`);
            return false;
        } catch (error) {
            logger.error('Error en el metodo delProduct de CarritosDaoMongoDb', error.message);
        }
    }

    async getByUser(email) {
        try {
            const data = await this.schema.find({ email: email });
            if (data == '') {
                this.newCart(email);
            }
            return data['_id'];
        } catch (error) {
            logger.error('Error en el metodo getByUser de CarritosDaoMongoDb', error.message);
        }
    }
}
export default CarritosDaosMongoDb;