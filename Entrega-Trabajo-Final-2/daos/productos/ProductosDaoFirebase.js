import ContenedorFirebase from '../../contenedores/contenedorFirebase.js';

class ProductosDaoFirebase extends ContenedorFirebase {
    constructor() {
        super('productos');
    }
    /*Metodo para Crear un nuevo Producto */
    async newProduct(product) {
        try {
            product['timestamp'] = new Date().toLocaleString();
            await this.save(product);
        } catch (error) {
            console.log('Error en el metodo newProduct de ProductosDaoFirebase', error.message);
        }
    }
}

export default ProductosDaoFirebase;