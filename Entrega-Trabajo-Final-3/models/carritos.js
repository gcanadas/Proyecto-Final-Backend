import mongoosse, { Schema } from 'mongoose';

const cartModel = new Schema({
      timestamp: { type: String, required: true },
      productos: { type: Array, required: true },
});

export default mongoosse.model('Carrito', cartModel);