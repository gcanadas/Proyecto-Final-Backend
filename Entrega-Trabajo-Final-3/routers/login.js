import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import logger from '../log/logger.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) {
            logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
            res.render('login');
        } else {
            const { user } = req;
            const { email, avatar, name, phone } = user;
            req.session.email = email;
            req.session.avatar = avatar;
            req.session.name = name;
            req.session.phone = phone;
            res.render('index', { title: 'Tercera Entrega Proyecto Final', email: email, avatar: avatar });
        }
    } catch (error){
        logger.error(`Error: ${error.message}`);
    }
});

router.post('/login', passport.authenticate('sign-in', {
        successRedirect: '/',
        failureRedirect: '/errorLogin',
    }),
    (req, res) => {
        logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
        res.redirect('/');
    }
);

router.get('/errorLogin', (req, res) => {
    logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
    res.render('errorLogin', { title: 'USER ERROR LOGIN', message: 'CREDENCIALES NO VALIDAS', href: '/'});
});

router.post('/logout', (req, res, next) => {
    const { email } = req.body;
    req.logout((error) => {
        if (!error) {
            logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
            res.render('logout', { email: email });
        } else {
            res.send('Ocurrio un  error', error.message);
            logger.error(`Error: ${error.message}`);
        }
    });
});

router.get('/register', (req, res, next) => {
    logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
    res.render('register');
});

router.post('/register', upload.single('avatar'), (req, res, next) => {
    const { file } = req;
    if (!file) {
        logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
        return next()
    }
    next();
},
    passport.authenticate('sign-up', {
        successRedirect: '/',
        failureRedirect: '/errorRegister',
    }),
    async (req, res) => {
        try {
            const { user } = req;
            logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
            res.json({ message: `User ${user.email} was registered.` });
        } catch(error) {
            logger.error(`Error: ${error.message}`);
        }
    }
);

router.get('/errorRegister', (req, res) => {
    logger.info(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
    res.render('errorLogin', { title: 'USER ERROR REGISTER', message: 'USUARIO YA REGISTRADO', href: '/register'});
});

export default router;