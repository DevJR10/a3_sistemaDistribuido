const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const axios = require("axios");
app.use(bodyParser.json());
livros = {};
contador = 0;

app.get('/livros' , (req,res) => {
    res.send(livros);
});

app.put("/livros", async (req, res) => {
    contador++;
    const { texto } = req.body;
    livros[contador] = {
        contador,
        texto,
    };
    await axios.post("http://localhost:10000/eventos", {
            tipo: "LivroCriado",
            dados: {
            contador,
            texto,
        },
    });
    res.status(201).send(livros[contador]);
});

app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
 });

app.listen(4000, () => {
    console.log('livros. Porta 4000');
});