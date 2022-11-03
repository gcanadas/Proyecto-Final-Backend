import mongoose from 'mongoose';
import config from '../config.js';

await mongoose.connect(config.mongoDB.URI);

class ContenedorMongoDb {
    constructor(model) {
        this.collection = model;
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
            const data = await this.collection.find({});
            return data;
        } catch(err) {
            console.log('Error en el metodo getAll de ContenedorMongoDb', err.message);
        }
    }
    /*Metodo para obtener un elemento del archivo por id*/
    async getById (id) {
        try {
            const data = await this.collection.find({ _id: id });
            if (data.length === 0) {
                console.log(`No se encontraron elementos con el id: ${id}`);
                return null;
            }
            return data[0];
        } catch(err) {
            console.log('Error en el metodo getById de ContenedorMongoDb', err.message);
        }
    }

    /*Metodo para guardar un elementos en el archivo*/
    async save (element) {
        try {
            const user = this.collection(element);
            const result = await user.save()
            return result
        } catch (err) {
            console.log('Error en el metodo save de ContenedorMongoDb', err.message);
        }
    }

    /*Metodo para eliminar un elementos en el archivo por el id*/
    async deleteById(id) {
        try {
            const data = await this.getAll();
            if(data.some((product) => product._id.toString() === id)){
                await this.collection.deleteOne({ _id: id });
                return
            }
            console.log('No se encontro ningun elemento con ese id');
            return
        } catch(err) {
            console.log('Error en el metodo deleteById de ContenedorMongoDb', err.message);
        }
    }

    /*Metodo para borrar todos los elementos en el archivo*/
    async deleteAll() {
        try {
            await this.collection.deleteMany({});
            return
        } catch(err) {
            console.log('Error en el metodo deleteAll de ContenedorMemoria', err.message);
        }
    }

    /*Metodo para actualizar un elemento en el archivo*/
    async updateById(id, element){
        try {
            const result = await this.collection.updateOne({ _id: id },{ $set: element });         
            return result
        } catch(err) {
            console.log('Error en el metodo updateByID de ContenedorMongoDB', err.message);
        }
    }
}

export default ContenedorMongoDb;