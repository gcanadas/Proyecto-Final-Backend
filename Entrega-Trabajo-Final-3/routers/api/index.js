import { Router } from 'express';
import carrito from './carrito.js';
import productos from './productos.js';
import confirmacion from './confirmacion.js';

const router = Router();

router.use("/carrito", carrito);
router.use("/confirmacion", confirmacion);
router.use("/productos", productos);

export default router;