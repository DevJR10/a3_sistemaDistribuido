    
const express = require ('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require ('axios');

const app = express();
app.use(bodyParser.json());
descricoesPorLivroId = {};


//:id é um placeholder npm start
//exemplo: /livros/123456/descricoes

const funcoes = {
   DescricaoClassificada: (descricao) => {
      const descricoes =
      descricoesPorLivroId[descricao.livroId];
      const obsParaAtualizar = descricoes.find(o => o.id ===
      descricao.id)
      obsParaAtualizar.status = descricao.status;
      axios.post('http://localhost:10000/eventos', {
            tipo: "DescricaoAtualizada",
            dados: {
            id: descricao.id,
            texto: descricao.texto,
            livroId: descricao.livroId,
            status: descricao.status
         }
      });
   }
}


 app.get('/livros/:id/descricoes', (req, res) => {
    res.send(descricoesPorLivroId[req.params.id] || []);
    
 });

 app.put('/livros/:id/descricoes', async (req, res) => {
   const idObs = uuidv4();
   const { texto } = req.body;
   //req.params dá acesso à lista de parâmetros da URL
   const descricoesDoLivro = descricoesPorLivroId[req.params.id] || [];
   descricoesDoLivro.push({ id: idObs, texto, status: 'aguardando' });



   descricoesPorLivroId[req.params.id]  = descricoesDoLivro;

   await axios.post('http://localhost:10000/eventos', {
      tipo: "DescricaoCriada",
      dados: {
         id: idObs, texto, livroId: req.params.id, status: 'aguardando'
      }
   })
   res.status(201).send(descricoesDoLivro);
});

app.post("/eventos", (req, res) => {
   try{
   funcoes[req.body.tipo](req.body.dados);
   res.status(200).send({ msg: "ok" });
   } catch(err){}
});
   
app.listen(5000, (() => {
   console.log('Descricoes. Porta 5000');
}));