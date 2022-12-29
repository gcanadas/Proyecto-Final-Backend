import { promises as fs } from "fs";
import logger from "../log/logger";
const encoding = 'utf-8';

class ContenedorArchivo {
    constructor(archiveName) {
        this.archiveName = archiveName;
    }

    /*Metodo para obtener todos los elementos del archivo*/
    async getAll () {
        try {
            const data = await fs.readFile(this.archiveName, encoding);
            return JSON.parse(data);
        } catch(err) {
            logger.error('Error en el metodo getAll de ContenedorArchivo', err.message)
        }
    }
    /*Metodo para obtener un elemento del archivo por id*/
    async getById (id) {
        try {
            const data = await this.getAll();
            const dataFilter = data.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                logger.warn(`No se encontraron elementos con el id: ${id} en el archivo`)
                return null;
            }
            return dataFilter[0];
        } catch(err) {
            logger.error('Error en el metodo getById de ContenedorArchivo', err.message)
        }
    }

    /*Metodo para guardar un elementos en el archivo*/
    async save (element) {
        try {
            const data = await this.getAll();
            data.push(element);
            await fs.writeFile(this.archiveName, JSON.stringify(data, null, 2), encoding);
            logger.info(`Se agrego un nuevo elemento al archivo ${this.archiveName}`);
            return element.id
        } catch (err) {
            logger.error('Error en el metodo save de ContenedorArchivo', err.message)
        }
    }

    /*Metodo para eliminar un elementos en el archivo por el id*/
    async deleteById(id) {
        try {
            const data = await this.getAll();
            if(data.some((product) => product.id === id)){
                const dataFilter = data.filter((product) => product.id !== id);
                await fs.writeFile(this.archiveName, JSON.stringify(dataFilter, null, 2), encoding);  
                return true
            }
            logger.warn('No se encontro ningun elemento con ese id');
            return false
        } catch(err) {
            logger.error('Error en el metodo deleteById de ContenedorArchivo', err.message);
        }
    }

    /*Metodo para borrar todos los elementos en el archivo*/
    async deleteAll() {
        try {
            await fs.unlink(this.archiveName);
            logger.info('Se borro el archivo con los productos');
            return
        } catch(err) {
            logger.error('Error en el metodo deleteAll de ContenedorArchivo', err.message);
        }
    }

    /*Metodo para actualizar un elemento en el archivo*/
    async updateById(id, element){
        try {
            const data = await this.getAll();
            const dataFilter = data.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                logger.warn(`No se encontraron elementos con el id: ${id}`);
                return null;
            }
            let productos = data.filter((product) => product.id !== id);
            productos.push(element);
            await fs.writeFile(this.archiveName, JSON.stringify(productos, null, 2), encoding);           
            return element
        } catch(err) {
            logger.error('Error en el metodo updateByID de ContenedorArchivo', err.message);
        }
    }
}

export default ContenedorArchivo;