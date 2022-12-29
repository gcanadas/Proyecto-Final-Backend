import logger from "../log/logger";

class ContenedorMemoria {
    constructor() {
        this.archiveName = [];
    }

    /*Metodo para obtener todos los elementos del archivo*/
    async getAll () {
        try {
            const data = [...this.archiveName];
            return data;
        } catch(err) {
            logger.error('Error en el metodo getAll de ContenedorMemoria', err.message);
        }
    }
    /*Metodo para obtener un elemento del archivo por id*/
    async getById (id) {
        try {
            const data = this.archiveName.filter((element) => element.id === id);
            if (data.length === 0) {
                logger.warn(`No se encontraron elementos con el id: ${id} en la memoria`);
                return null;
            }
            return data[0];
        } catch(err) {
            logger.error('Error en el metodo getById de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para guardar un elementos en el archivo*/
    async save (element) {
        try {
            this.archiveName.push(element);
            return element.id
        } catch (err) {
            logger.error('Error en el metodo save de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para eliminar un elementos en el archivo por el id*/
    async deleteById(id) {
        try {
            if(this.archiveName.some((product) => product.id === id)){
                const dataFilter = this.archiveName.filter((product) => product.id !== id);
                this.archiveName = dataFilter;
                return
            }
            logger.warn('No se encontro ningun elemento con ese id');
            return
        } catch(err) {
            logger.error('Error en el metodo deleteById de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para borrar todos los elementos en el archivo*/
    async deleteAll() {
        try {
            this.archiveName = [];
            return
        } catch(err) {
            logger.error('Error en el metodo deleteAll de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para actualizar un elemento en la memoria*/
    async updateById(id, element){
        try {
            const dataFilter = this.archiveName.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                logger.warn(`No se encontraron elementos con el id: ${id} en la memoria`);
                return null;
            }
            let elementos = this.archiveName.filter((product) => product.id !== id);
            elementos.push(element);
            this.archiveName = elementos;           
            return element
        } catch(err) {
            logger.error('Error en el metodo updateByID de ContenedorMemoria', err.message);
        }
    }
}

export default ContenedorMemoria;