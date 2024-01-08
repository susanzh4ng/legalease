const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const asyncHandler = require('express-async-handler')
const { errorHandler } = require('./middleware/errorMiddleware')
const router = express.Router()
const dotenv = require('dotenv').config() //loading .env's content
const port = process.env.PORT || 5000
const constUrl = 'https://www.uscourts.gov/glossary/'
let url = 'https://www.uscourts.gov/glossary/' //the website we are scraping from
const app = express() //calling and storing express
app.use(cors()) //enables CORS for routes
app.use(express.json()) //parse JSON
app.use(express.urlencoded({ extended: false }))


/*
@desc   Set definition
@route  POST /api/definition
@access Private
*/
app.post('/api/definition', asyncHandler(async (req, res, next) => {
    if(!req.body.text) {
        const error = new Error('Please add a text field!')
        res.status(400)
        next(error) //pass to errorHandler
        return;
    }
    term = req.body.text
    term = term.replace(/[ ]/g, '-').trim(); //replacing spaces with hyphens, in case the term is multiple words
    url += term //setting url with the user's specified term
    res.status(200).json({message: url})
}))

/*
@desc   Get definition
@route  GET /api/definition
@access Private
*/
app.get('/api/definition', asyncHandler(async (req, res) => {
    axios(url)
    .then(response => {
        const html = response.data //the html content from url
        const page = cheerio.load(html) //loading html into a cheerio object
        let definition = ''

        page('.taxonomy-term-description', html).each(function() { //picking out the definition text
            definition = page(this).find('p').text() //getting the text from the <p> tag of the "taxonomy-term-description" div
        })
        if (!definition) { //if the "taxonomy-term-description" class is not found, means the term is not found and definition could not be initiated
            url = constUrl
            throw new Error('Class .taxonomy-term-description was not found on the page.');
        }
        definition = definition.replace(/[\n\t"]/g, '').trim(); //removing JS special charcters
        res.json({message: definition})
        url = constUrl //setting the url back to basis url
    }).catch(function (error) {
        url = constUrl
        console.log(error)
        res.status(400).json({message: 'This term is not defined in the U.S. Courts Glossary.'}) //bad client request
    })
}))


app.use(errorHandler) //can use custom error handler
app.listen(port, () => console.log(`Server started on port ${port}`)) //listening out to port 5000 to see if any changes are made