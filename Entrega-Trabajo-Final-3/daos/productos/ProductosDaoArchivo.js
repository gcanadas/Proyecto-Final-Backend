import ContenedorArchivo from './../../contenedores/contenedorArchivo.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log/logger.js';

class ProductosDaoArchivo extends ContenedorArchivo {
    constructor() {
        super('./db/productos.json');
    }
    /*Metodo para Crear un nuevo Producto */
    async newProduct(product) {
        try {
            product = {id: uuidv4(), timestamp: Date().toLocaleString(), ...product};
            await this.save(product);
        } catch (error) {
            logger.error('Error en el metodo newProduct de ProductosDaoArchivo', error.message);
        }
    }
}
export default ProductosDaoArchivo;