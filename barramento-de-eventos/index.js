const express = require('express');
const bodyParser = require('body-parser');
//para enviar eventos para os demais microsserviços
const axios = require('axios');

const app = express();
eventos = [];
app.use(bodyParser.json());

app.post('/eventos',  (req, res) => {
    
 const evento = req.body;

 eventos.push(evento)

 //envia o evento para o microsserviço de livro
  axios.post('http://localhost:4000/eventos', evento);
 //envia o evento para o microsserviço de descricao
  axios.post('http://localhost:5000/eventos', evento);
 //envia o evento para o microsserviço de eventos
 postEventoConsulta(evento);

 //envia o evento para o microsserviço de classificacao
  axios.post("http://localhost:7000/eventos", evento);
 res.status(200).send({ msg: "ok" });
 });



 async function postEventoConsulta(evento) {
    const url = "http://localhost:6000/eventos"; // Update to your endpoint
    const timeout = 5000; // Timeout in milliseconds

    try {
        await axios.post(url, evento, { timeout });
    } catch (error) {
        // Ignoring all errors
        // You can optionally log if you want to keep track of failures, but it won't crash
    }
}








 app.listen(10000, () => {
 console.log('Barramento de eventos. Porta 10000.')
 });

 app.get('/eventos', (req, res) => {
 res.send(eventos)
 });
    