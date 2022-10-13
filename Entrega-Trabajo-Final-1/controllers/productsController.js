const fs = require("fs");
const encoding = 'utf-8';
const { v4: uuidv4 } = require("uuid");

class productsController {
    constructor(archiveName) {
        this.archiveName = archiveName;
    }

    /*Defino metodos internos de la clase*/
    async readArchive (archiveName) {
        try {
            const data = await fs.promises.readFile(archiveName, encoding);
            return JSON.parse(data);
        } catch (err) {
            if(err.code === 'ENOENT') {
                return 'ENOENT';
            }
            console.log('Ocurrio un error durante la lectura del archivo:', err);
            throw new Error(err.message);
        }
    }

    async writeArchive (archiveName, content) {
        try {
            await fs.promises.writeFile(archiveName, JSON.stringify(content, null, 2));
        } catch (err) {
            console.log('Ocurrio un error durante la escritura del archivo:', err);
            throw new Error(err.message)
        }
    }

    async save (product) {
        try {
            const data = await this.readArchive (this.archiveName);
            if (data === 'ENOENT'){
                console.log(`No se encontro el archivo ${this.archiveName}\n se procede a crear un archivo nuevo`);
                product = {id: uuidv4(), timestamp: Date().toLocaleString(), ...product};
                let productArray = [];
                productArray.push(product);
                await this.writeArchive(this.archiveName, productArray);
                console.log(`Se agrego un nuevo elemento al archivo ${this.archiveName}`);
                return product.id;
            }
            product = {id: uuidv4(), timestamp: Date().toLocaleString(), ...product};
            data.push(product);
            await this.writeArchive(this.archiveName, data);
            console.log(`Se agrego un nuevo elemento al archivo ${this.archiveName}`);
            return product.id
        } catch (err) {
            console.log(err);
        }
    }

    async getById (id) {
        try {
            const data = await this.readArchive (this.archiveName);
            if (data === 'ENOENT'){
                console.log(`No se encontro el archivo`);
                return null;
            }
            const dataFilter = data.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                console.log(`No se encontraron productos con el id: ${id}`);
                return null;
            }
            return dataFilter[0];
        } catch(err) {
            console.log(err);
        }
    }

    async getAll () {
        try {
            const data = await this.readArchive (this.archiveName);
            if (data === 'ENOENT'){
                console.log(`No se encontro el archivo`);
                return null;
            }
            return data;
        } catch(err) {
            console.log(err);
        }
    }

    async deleteById(id) {
        try {
            const data = await this.readArchive (this.archiveName);
            if(data.some((product) => product.id === id)){
                const dataFilter = data.filter((product) => product.id !== id);
                await this.writeArchive(this.archiveName, dataFilter);
                return
            }
            console.log('No se encontro ningun producto con ese id');
        } catch(err) {
            console.log(err);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.unlink(this.archiveName);
            console.log('Se borro el archivo con los productos');
        } catch(err) {
            console.log(err);
        }
    }

    async updateById(id, product){
        try {
            const data = await this.readArchive (this.archiveName);
            if (data === 'ENOENT'){
                console.log(`No se encontro el archivo`);
                return null;
            }
            const dataFilter = data.filter((product) => product.id === id);
            if (dataFilter.length === 0) {
                console.log(`No se encontraron productos con el id: ${id}`);
                return null;
            }
            let productos = data.filter((product) => product.id !== id);
            product = {id: id, timestamp: Date().toLocaleString(), ...product};
            productos.push(product);           
            await this.writeArchive(this.archiveName, productos);
            return product
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = productsController;