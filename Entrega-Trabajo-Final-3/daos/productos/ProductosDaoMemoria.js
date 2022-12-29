import ContenedorMemoria from '../../contenedores/contenedorMemoria.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log/logger.js';

class ProductosDaoMemoria extends ContenedorMemoria {
    constructor() {
        super();
    }
    /*Metodo para Crear un nuevo Producto */
    async newProduct(product) {
        try {
            product = {id: uuidv4(), timestamp: Date().toLocaleString(), ...product};
            await this.save(product);
        } catch (error) {
            logger.error('Error en el metodo newProduct de ProductosDaoMemoria', error.message);
        }
    }
}

export default ProductosDaoMemoria;