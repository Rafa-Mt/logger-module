import express from 'express';
import { LoggerServer } from './loggerstart.js';

// Instancia LoggerServer
const loggerServer = new LoggerServer();

// Crea la aplicación Express de prueba
const app = express();

// Usa el middleware de LoggerServer para registrar las rutas
app.use(express.json());
app.use(loggerServer.middleware());

// Endpoint de prueba
app.get('/RouteTest', (req, res) => {
    res.send("Hola, probando LoggerServer!");
});

app.get('/CustomTest', (req, res) => {
  loggerServer.debug({message:"Probando LoggerServer"});
  res.send("Hola, probando LoggerServer!");
});


// Inicia el servidor de prueba en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor de prueba escuchando en http://localhost:3000');
});