
let productosDao
let carritosDao

switch (process.env.TIPO_PERSISTENCIA) {
    case 'archivo':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js');
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js');

        productosDao = new ProductosDaoArchivo();
        carritosDao = new CarritosDaoArchivo();
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDB } = await import('./productos/ProductosDaoMongoDB.js');
        const { default: CarritosDaoMongoDB } = await import('./carritos/CarritosDaoMongoDB.js');

        productosDao = new ProductosDaoMongoDB();
        carritosDao = new CarritosDaoMongoDB();
        await productosDao.connect();
        await carritosDao.connect();
        break;
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js');
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js');

        productosDao = new ProductosDaoFirebase();
        carritosDao = new CarritosDaoFirebase();
        break;    
    default:
        const { default: ProductosDaoMemoria } = await import('./productos/ProductosDaoMemoria.js');
        const { default: CarritosDaoMemoria } = await import('./carritos/CarritosDaoMemoria.js');

        productosDao = new ProductosDaoMemoria();
        carritosDao = new CarritosDaoMemoria();
}

export { productosDao, carritosDao }