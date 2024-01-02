const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const router = express.Router()
const dotenv = require('dotenv').config() //loading .env's content
const port = process.env.PORT || 5000
const url = 'https://www.uscourts.gov/glossary/plea' //the website we are scraping from

const app = express() //calling and storing express
app.use(cors()) //enables CORS for routes
app.use(express.json()) //parse JSON




/*
@desc   Get definition
@route  GET /api/definition
@access Private
*/
app.get('/api/definition', (req, res) => {
    axios(url)
    .then(response => {
        const html = response.data //the html content from url
        const page = cheerio.load(html) //loading html into a cheerio object
        let definition = ''

        page('.taxonomy-term-description', html).each(function() { //picking out the definition text
            definition = page(this).find('p').text() //getting the text from the <p> tag of the "taxonomy-term-description" div
        })
        definition = definition.replace(/[\n\t"]/g, '').trim(); //removing JS special charcters
        res.json({message: definition})
    }).catch(err => console.log(err))
})

/*
@desc   Set definition
@route  POST /api/definition
@access Private
*/
app.post('/api/definition', (req, res) => {
    res.status(200).json({message: 'set definition'})
})

//module.exports = router
app.listen(port, () => console.log(`Server started on port ${port}`)) //listening out to port 5000 to see if any changes are made