import logger from '../../log/logger.js';
import ProductModel from '../../models/productos.js';
import ContenedorMongoDb from './../../contenedores/contenedorMongoDb.js';

class ProductosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super(ProductModel);
    }
    /*Metodo para Crear un nuevo Producto */
    async newProduct(product) {
        try {
            product['timestamp'] = new Date().toLocaleString();
            await this.save(product);
        } catch (error) {
            logger.error('Error en el metodo newProduct de ProductosDaoMongoDb', error.message);
        }
    }
}
export default ProductosDaoMongoDb;