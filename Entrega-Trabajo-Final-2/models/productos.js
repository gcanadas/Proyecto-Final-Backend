import mongoosse, { Schema } from 'mongoose';

const producto = new Schema({
    timestamp: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    codigo: { type: Number, required: true, index: true, unique: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
});

export default mongoosse.model('Producto', producto);