const express = require('express');
const Joi = require('joi')
const app = express()
let sentences = require('./sentences.js')

app.use(express.json())

const PORT = process.env.PORT || 1000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/',(req, res) => {
    res.send(`<br><a href="https://www.postman.com/buwagear/storing-sentence-api/overview">API DOCUMENTATION</a>
	<br><a href="https://github.com/bagir-kaff/static-api-for-vercel">repo</a>`)
});

app.get('/sentences', (req, res) => {
    res.json(sentences)
});

app.post('/sentences', (req, res) => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString()
    const schema = Joi.object({
        sentence: Joi.string().min(6).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.message);
        return;
    }

    console.log("new sentence is added ")

    const sentence = {
        id: sentences.length,
        sentence: req.body.sentence,
        length: req.body.sentence.length,
        datemodified: formattedDateTime
    }
    
    sentences.push(sentence)
    res.status(201).send(sentence)
});

app.get('/sentences/:id',(req, res) => {
    const sentence = sentences.find(c => c.id === parseInt(req.params.id));
    if (!sentence) res.status(404).send('The sentence with the given id was not found')//404
    res.send(sentence)
})

app.get('/sentences/sentence/random', (req, res) => {
    const randomnum = getRandomInt(1,sentences.length-1)
    // console.log(randomnum)
    res.send(sentences[randomnum])
});

app.put('/sentences/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const olderSentence = sentences.find(c => c.id === id);
    if (!olderSentence) res.status(404).send('The sentence with the given id was not found')//404
    const now = new Date();
    const formattedDateTime = now.toLocaleString()
    const schema = Joi.object({
        sentence: Joi.string().min(6).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.message);
        return;
    }

    console.log("new sentence is added ")

    const sentence = {
        id: id,
        sentence: req.body.sentence,
        length: req.body.sentence.length,
        datemodified: formattedDateTime
    }
    
    sentences = sentences.map( s => {
        if (s.id === id) return sentence;
        return s;
    })
    res.status(201).send(sentence)
});

app.delete('/sentences/delete/all', (req,res)=>{
    sentences.splice(1,sentences.length)
    res.send('all sentences are deleted 👍')
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

module.exports = app;
