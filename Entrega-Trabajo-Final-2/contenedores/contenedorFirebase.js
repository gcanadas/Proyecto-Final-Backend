import FirebaseAdmin from 'firebase-admin';
import { readFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

const cert = JSON.parse(
    await readFile(
      new URL(process.env.FIREBASE_CERT_PATH, import.meta.url)
    )
)

const connect = async () => {
    try {
        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert(cert),
        });
        console.log('Conectados a Firebase');
    } catch (error) {
        console.log('Error en el metodo connect de contenedorFirebase', error.message);
    }
};
await connect();
class ContenedorFirebase {
    constructor(collection) {
        this.collection = collection;
        this.db = FirebaseAdmin.firestore();
        this.query = this.db.collection(this.collection);
    }

     /*Metodo para obtener todos los elementos de la base de datos*/

    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
            return response;
        } catch (error) {
            console.log('Error en el metodo getAll de contenedorFirebase', error.message);
        }
    }
    /*Metodo para obtener un elemento de la base de datos por id*/
    async getById(id) {
        try {
            const doc = this.query.doc(id);
            const item = await doc.get();
            const response = item.data();
            if (response) {
                response['_id'] = id;
                return response;
            } else {
                console.log('No se encontro el ID');
                return
            }
        } catch (error) {
            console.log('Error en el metodo getById de contenedorFirebase', error.message);
        }
    }
    /*Metodo para guardar un elementos en Firebase*/
    async save(element) {
        try {
            let id = uuidv4();
            let doc = this.query.doc(id);
            await doc.create(element);
            return element.id;
        } catch (error) {
            console.log('Error en el metodo save de contenedorFirebase', error.message);
        }
    }
  
    /*Metodo para eliminar un elementos en Firebase por el id*/
    async deleteById(id) {
        try {
            const doc = this.query.doc(id);
            await doc.delete();
        } catch (error) {
            console.log('Error en el metodo deleteById de contenedorFirebase', error.message);
        }
    }
    /*Metodo para actualizar un elemento en firebase*/
    async updateById(id, element) {
        try {
            const doc = this.query.doc(id);
            await doc.update(element);
            return element._id;
        } catch (error) {
            console.log('Error en el metodo updateById de contenedorFirebase', error.message);
        }
    }
}
export default ContenedorFirebase;