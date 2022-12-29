import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouters from './routers/api/index.js';
import config from './config.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import minimist from 'minimist';
import cluster from 'cluster';
import os from 'os';
import logger from './log/logger.js';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import UserModel from './models/usuarios.js'
import sendMail from './controllers/mail.js'
import { carritosDao } from './daos/index.js';

const MODE_OPERATION = process.env.MODE_OPERATION || 'fork';

if (MODE_OPERATION === 'cluster' && cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`worker ${worker.process.pid} | code ${code} | signal ${signal}`);
    logger.info('Starting a new worker...');
    cluster.fork();
  });
} else {

  const app = express();

  const PORT = process.env.PORT || 8080;
  const ENV = process.env.NODE_ENV || 'local';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.engine('.hbs', engine({extname: '.hbs'}))
  app.set('view engine', '.hbs')
  app.set('views', path.join(__dirname, 'views'))

  passport.use('sign-in', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    UserModel.findOne({ email })
      .then((user) => {
        if (!user) {
          logger.warn(`User with ${email} not found.`);
          return done(null, false, { message: `El usuario ${email} no fue encontrado` });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          logger.warn('Invalid Password');
          return done(null, false, { message: 'Contraseña invalida' });
        }
        done(null, user);
      })
      .catch((error) => {
        logger.warn(`Error de login: ${error.message}`);
        done(error);
      });
  }));

  passport.use('sign-up', new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      UserModel.findOne({ email })
      .then((user) => {
        if (user) {
          logger.warn(`User ${email} already exists.`);
          return done(null, false);
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.password, salt);
          req.body.password = hash;
          req.body.avatar = `../avatars/${req.file.filename}`;
          sendMail('Nuevo Registro',
            `<div>
              <h3>Información de nuevo registro</h3>
              <ul>
                <li>Email:${req.body.email}</li>
                <li>Nombre:${req.body.name}</li>
                <li>Direccion:${req.body.address}</li>
                <li>Avatar:${req.body.avatar}</li>
                <li>Edad:${req.body.age}</li>
                <li>Telefono:${req.body.phone}</li>
              </ul> 
            </div>`
          );
          carritosDao.newCart(req.body.email);
          return UserModel.create(req.body);
        }
      })
      .then((newUser) => {
        if (newUser) {
          logger.info(`User ${newUser.email} registration succesful.`);
          done(null, newUser);
        } else {
          logger.warm(newUser);
        }
      })
      .catch((error) => {
        logger.error(`Error de Registro: ${error.message}`);
        return done(error);
      });
    }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    UserModel.findOne({ _id })
      .then(user => done(null, user))
      .catch(done)
  })

  app.use(session({
      secret: '3WxCgjK#96L',
      cookie: { httpOnly: false, secure: false, maxAge: 600000 },
      rolling: true,
      resave: false,
      saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

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

  app.get('*', function (req, res) { 
    logger.warn(`Solicitud de Ruta inexistente - Ruta: ${req.originalUrl} - Metodo: ${req.method}`)
    res.status(404).send(`${req.originalUrl} not found`);
  })

  const server = app.listen(PORT, () => {
    logger.info(
      `Servidor http esta escuchando en el puerto ${server.address().port}`
    );
    logger.info(`http://localhost:${server.address().port}`);
    logger.info(`Environment:${ENV}`);
  });
  
  server.on("error", error => logger.error(`Error en servidor ${error}`));

}