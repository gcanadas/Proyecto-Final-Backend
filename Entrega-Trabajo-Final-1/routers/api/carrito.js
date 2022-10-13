const { Router } = require('express');
const prodController = require('../../controllers/productsController');
const cartController = require('../../controllers/carritoController');

const productos = new prodController('./db/productos.json');
const carrito = new cartController('./db/carrito.json');

const router = Router();

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
  }

router.post('/', async (req, res, next) => { 
    try {
        const cartId = await carrito.newCart();
        res.status(STATUS_CODE.CREATED).json(cartId);
  } catch (err) {
        next(err)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
      const delStatus = await carrito.delCart(req.params.id);
      if(delStatus){
      res.status(STATUS_CODE.OK).json(`El carrito con el id:${req.params.id} se elimino correctamente`);
      return;
      }
      res.status(STATUS_CODE.NOT_FOUND).json(`El carrito con el id:${req.params.id} no se encontro`);
  } catch (err) {
      next(err);
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
      next(err)
}
});

router.get('/:id/productos', async (req, res, next) => { 
  try {
      const products = await carrito.getProduct(req.params.id);
      res.status(STATUS_CODE.CREATED).json(products);
} catch (err) {
      next(err)
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
      next(err)
}
});

module.exports = router;