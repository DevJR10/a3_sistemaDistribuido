const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const palavraChave = ["acao", "sci-fi" , "ciencia", "romance" , "terror"];



const funcoes = {
    DescricaoCriada: (descricao) => {

    descricao.status = "";

    palavraChave.forEach((palavra) => {
        if (descricao.texto.includes(palavra))
            {
                descricao.status = descricao.status + " " + palavra
            };  
    })

    if (descricao.status == ""){
        descricao.status = "Sem Classificacao"
    }



    axios.post("http://localhost:10000/eventos", {
        tipo: "DescricaoClassificada",
        dados: descricao,
            });
        },
    };

app.post('/eventos' , (req,res) => {
    try {
    funcoes[req.body.tipo](req.body.dados);
    res.status(200).send({ msg: "ok" });
    }catch(err){}
});

app.listen(7000 , ()  => console.log ("Classificação. Porta 7000"));





