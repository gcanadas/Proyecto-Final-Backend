import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouters from './routers/api/index.js';

const app = express();

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'local';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouters);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Ocurrio un error!");
});

app.use((req, res) => {
    res.status(404).json({
        error: -2,
        descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`,
    });
});


  const server = app.listen(PORT, () => {
    console.log(
      `Servidor http esta escuchando en el puerto ${server.address().port}`
    );
    console.log(`http://localhost:${server.address().port}`);
    console.log(`Environment:${ENV}`);
  });
  
  server.on("error", error => console.log(`Error en servidor ${error}`));
