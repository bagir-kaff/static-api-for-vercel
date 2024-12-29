const express = require('express');
const Joi = require('joi')
const app = express()
const sentences = require('./sentences.js')

app.use(express.json())

const PORT = process.env.PORT || 1000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/',(req, res) => {
    res.send(`endpoints:, 
        <br><a href="/sentences"> /sentences</a>
        <br><a href="/sentences/1"> /sentences/:id id=1</a>
        <br><a href="/sentences/sentence/random">/sentences/sentence/random</a>
        <br><a href=""></a>
        `)
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
        dateadded: formattedDateTime
    }
    
    sentences.push(sentence)
    res.status(201).send(sentence)
});

app.get('/sentences/:id',(req, res) => {
    const sentence = sentences.find(c => c.id === parseInt(req.params.id));
    if (!sentence) res.status(404).send('The sentence with the given id was not found')//404
    res.send(sentence)
})

app.get('/sentences/sentence/random', (erq, res) => {
    const randomnum = getRandomInt(1,sentences.length-1)
    // console.log(randomnum)
    res.send(sentences[randomnum])
});

// app.listen(PORT, () => console.log(`server running on port ${PORT}`))

module.exports = app;
