import mongoose from "mongoose";
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(_ => {
        console.log('\x1b[42m%s' , "MongoDB Conectado!\x1b[0m")
    })
    .catch(e => {
        const msg = "ERRO! Não foi possivel se conectar ao MongoDB!"
        console.log('\x1b[41m%s', msg, '\x1b[0m')
    })