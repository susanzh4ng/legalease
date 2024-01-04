const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const asyncHandler = require('express-async-handler')
const { errorHandler } = require('./middleware/errorMiddleware')
const router = express.Router()
const dotenv = require('dotenv').config() //loading .env's content
const port = process.env.PORT || 5000
const url = 'https://www.uscourts.gov/glossary/sentence' //the website we are scraping from
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
    res.status(200).json({message: 'set yassss'})
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
        definition = definition.replace(/[\n\t"]/g, '').trim(); //removing JS special charcters
        res.json({message: definition})
    }).catch(err => console.log(err))
}))


app.use(errorHandler) //can use custom error handler
app.listen(port, () => console.log(`Server started on port ${port}`)) //listening out to port 5000 to see if any changes are made