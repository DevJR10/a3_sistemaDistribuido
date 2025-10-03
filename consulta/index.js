const express = require("express");
const app = express();
const axios = require("axios");
const baseConsulta = {};

app.use(express.json());

const funcoes = {
    LivroCriado: (livro) => {
        baseConsulta[livro.contador] = livro;
    },
    DescricaoCriada: (descricao) => {
        const descricoes =
        baseConsulta[descricao.livroId]["descricoes"] ||
        [];
        descricoes.push(descricao);
        baseConsulta[descricao.livroId]["descricoes"] =
        descricoes;
    },
    DescricaoAtualizada: (descricao) => {
        const descricoes =
        baseConsulta[descricao.livroId]["descricoes"];
        const indice = descricoes.findIndex((o) => o.id ===
        descricao.id);
        descricoes[indice] = descricao;
    }
        
};

app.get("/livros", (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
    try{
    funcoes[req.body.tipo](req.body.dados);
    }catch(err){}
    res.status(200).send(baseConsulta);
 });
    
//app.listen(6000, () => console.log("Consultas. Porta 6000"));
app.listen(6000, async () => {
    console.log("Consultas. Porta 6000");
    const resp = await
    axios.get("http://localhost:10000/eventos");
    //axios entrega os dados na propriedade data
    resp.data.forEach((valor, indice, colecao) => {
     try {
     funcoes[valor.tipo](valor.dados);
     } catch (err) {}
    });
});
    