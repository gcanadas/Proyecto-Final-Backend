import { Router } from 'express';
import { carritosDao } from '../../daos/index.js'
import logger from '../../log/logger.js';

const carrito = carritosDao;

const router = Router();

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
  }

router.get('/', async (req, res, next) => {
      try {
            const cartData = await cartController.getByUser(req.user.email);
            res.json(cartData).render('carrito', cartData);
      } catch (err) {
            logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
      }
});

router.post('/', async (req, res, next) => { 
    try {
      const cartId = await carrito.newCart();
       res.status(STATUS_CODE.CREATED).json(cartId);
  } catch (err) {
      logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
      const delStatus = await carrito.deleteById(req.params.id);
      if(delStatus){
      res.status(STATUS_CODE.OK).json(`El carrito con el id:${req.params.id} se elimino correctamente`);
      return;
      }
      res.status(STATUS_CODE.NOT_FOUND).json(`El carrito con el id:${req.params.id} no se encontro`);
  } catch (err) {
      logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

router.post('/:id/productos', async (req, res, next) => { 
  try {
      const productStatus = await carrito.newProduct(req.params.id, req.body.id);
      if(productStatus) {
            res.status(STATUS_CODE.CREATED).json(`Se agregaron productos al carrito con el id:${req.params.id}`);
            return;
      }
      res.status(STATUS_CODE.NOT_FOUND).json(`No se pudieron agregar los productos al carrito`);
} catch (err) {
      logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
}
});

router.get('/:id/productos', async (req, res, next) => { 
  try {
      const products = await carrito.getProduct(req.params.id);
      res.status(STATUS_CODE.CREATED).json(products);
} catch (err) {
      logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
}
});

router.delete('/:id/productos/:id_prod', async (req, res, next) => { 
  try {
      const delStatus = await carrito.delProduct(req.params.id, req.params.id_prod);
      if(delStatus){
            res.status(STATUS_CODE.OK).json(`Se elimino el productos con id:${req.params.id_prod} del carrito con el id:${req.params.id}`);
            return;
      }
      res.status(STATUS_CODE.NOT_FOUND).json(`El producto con id:${req.params.id_prod} no se pudo eliminar del carrito con el id:${req.params.id}`);
} catch (err) {
      logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
}
});

export default router;