import mongoose from 'mongoose';
import config from '../config.js';

await mongoose.connect(config.mongoDB.URI);

class ContenedorMongoDb {
    constructor(schema) {
        this.schema = schema;
    }

    async connect() {
        try {
            await mongoose.connect(config.mongoDB.URI);
            console.log('Conectado correctamente a la Base de datos MongoDb');
        } catch (err) {
            console.log('Error en el metodo connect de ContenedorMongoDb', err.message);
        }
    }

    /*Metodo para obtener todos los elementos del archivo*/
    async getAll () {
        try {
            const data = [...this.archiveName];
            return data;
        } catch(err) {
            console.log('Error en el metodo getAll de ContenedorMemoria', err.message);
        }
    }
    /*Metodo para obtener un elemento del archivo por id*/
    async getById (id) {
        try {
            const data = this.archiveName.filter((element) => element.id === id);
            if (data.length === 0) {
                console.log(`No se encontraron elementos con el id: ${id}`);
                return null;
            }
            return data[0];
        } catch(err) {
            console.log('Error en el metodo getById de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para guardar un elementos en el archivo*/
    async save (element) {
        try {
            this.archiveName.push(element);
            return element.id
        } catch (err) {
            console.log('Error en el metodo save de ContenedorMemoria', err.message);
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
            console.log('No se encontro ningun elemento con ese id');
            return
        } catch(err) {
            console.log('Error en el metodo deleteById de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para borrar todos los elementos en el archivo*/
    async deleteAll() {
        try {
            this.archiveName = [];
        } catch(err) {
            console.log('Error en el metodo deleteAll de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para actualizar un elemento en el archivo*/
    async updateById(id, element){
        try {
            const dataFilter = this.archiveName.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                console.log(`No se encontraron elementos con el id: ${id}`);
                return null;
            }
            let elementos = this.archiveName.filter((product) => product.id !== id);
            elementos.push(element);
            this.archiveName = elementos;           
            return element
        } catch(err) {
            console.log('Error en el metodo updateByID de ContenedorMemoria', err.message);
        }
    }
}

export default ContenedorMongoDb;