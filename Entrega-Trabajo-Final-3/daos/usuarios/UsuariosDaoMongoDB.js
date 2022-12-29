import UserModel from '../../models/usuarios.js';
import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js';

class UsuariosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super(UserModel);
    }
    /*Metodo para obtener usuario por el email */
    async getUser(email) {
        try {
            return await this.collection.find({ email: `${email}` })
        } catch (error) {
            console.log('Error en el metodo newProduct de UsuariosDaoMongoDb', error.message);
        }
    }
}
export default UsuariosDaoMongoDb;