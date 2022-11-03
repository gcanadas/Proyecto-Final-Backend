# Segunda Entrega del Proyecto Final

## Instalación

Primero debemos crear un archivo en la raiz proyecto con el nombre `.env` con el siguiente contenido
```
NODE_PORT=8080
FIREBASE_CERT_PATH=Ruta con el archivo de permisos de firebase
TIPO_PERSISTENCIA= (Ac se selecciona que persistencia de datos se quiere. La misma puede ser 'archivo', 'mongodb', 'firebase' y en caso se ser otro valor se usará la memoria)
```
Acá estamos configurando una variable de entorno para nuestro proyecto, en este caso el puerto que usará el servidor.

## Testing

Para testear el funcionamiento del código importar el archivo `postman_collection.json` en [Postman](https://www.postman.com/). 

## Ejecutar en producción


```sh
npm start
```

## Ejecutar en desarrollo


```sh
npm run dev
```