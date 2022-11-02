import { Router } from 'express';
import carrito from "./carrito.js";
import productos from "./productos.js";

const router = Router();

router.use("/carrito", carrito);
router.use("/productos", productos);

export default router;