import UserModel from '../../models/usuarios.js';
import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js';
import logger from '../../log/logger.js';

class UsuariosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super(UserModel);
    }
    /*Metodo para obtener usuario por el email */
    async getUser(email) {
        try {
            return await this.collection.find({ email: `${email}` })
        } catch (error) {
            logger.error('Error en el metodo getUser de UsuariosDaoMongoDb', error.message);
        }
    }
}
export default UsuariosDaoMongoDb;