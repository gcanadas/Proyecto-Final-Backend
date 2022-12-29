import { Router } from 'express';
import { productosDao } from '../../daos/index.js'
import logger from '../../log/logger.js';

const productos = productosDao

const router = Router();

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
  }

  const administrador = true; //Permite establecer permiso de administrador

router.get('/:id?', async(req, res, next) => { 
  try {
    if(req.params.id){
      let data = await productos.getById(req.params.id);
      res.status(STATUS_CODE.CREATED).json(data);
      return
    }
    let data = await productos.getAll();
    res.status(STATUS_CODE.CREATED).json(data)

  } catch (error) {
    logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

router.post('/', async(req, res, next) => {
  try{
    if(administrador){
      let data = await productos.newProduct(req.body);
      res.status(STATUS_CODE.CREATED).json(data);
      return
    }
    res.status(STATUS_CODE.UNAUTHORIZED).json({
      error: -1,
      descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
    })
  } catch (error) {
    logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

router.put('/:id', async(req, res, next) => {
  try{
    if(administrador){
      let data = await productos.updateById(req.params.id, req.body);
      res.status(STATUS_CODE.OK).json(data);
      return
    }
    res.status(STATUS_CODE.UNAUTHORIZED).json({
      error: -1,
      descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
    })
  } catch (error) {
    logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

router.delete('/:id', async(req, res, next) => {
  try{
    if(administrador){
      const result = await productos.deleteById(req.params.id);
      if(result) {
        res.status(STATUS_CODE.OK).json(`Producto con id:${req.params.id} eliminado correctamente`);
        return;
      }
      res.status(STATUS_CODE.NOT_FOUND).json(`Producto con id:${req.params.id} no encontrado`);
    }
    res.status(STATUS_CODE.UNAUTHORIZED).json({
      error: -1,
      descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
    })
  } catch (error) {
    logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
  }
});

export default router;