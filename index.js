const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())  
morgan.token('body', function(req,res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-45-234345",
        id: 3
    },
    {
        name: "Mary Poppandieck",
        number: "39-23-5423122",
        id: 4
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const test = "Phonebook has info for " + persons.length + "<br/>" + new Date()
    console.log(test)
    response.send(test)
})

/* HUOM !!
Käytin filtteriä, jotta voin palauttaa useamman samalla ID:llä varustetun käyttäjän.
En tiedä, tulisiko samalla ID:llä olla useampi tulos? Sinun esimerkki JSON:issa kuitenkin oli kaksi nelos ID:llä varustettua 
henkilö, joten menen sen mukaan, että datassa voi olla useampi samalla ID:llä & tällöin on voitava palauttaa tietenkin kaikki 
kyseisellä ID:llä löytyvät. :)
*/
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id === id)
    console.log(person.length)
    if (person.length !== 0) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(id)
    response.status(204).end()
})

app.post("/api/persons/", (request, response) => {
    const personObject = request.body
    if (personObject.name === undefined || personObject.number === undefined) {
        response.json({ error: 'name or number is missing' })
    } else if (persons.find(person => person.name.toLowerCase() === personObject.name.toLowerCase())) {
        response.json({error: 'name must be unique'})
    } else {
        personObject.id = Math.floor(Math.random() * Math.floor(1000))
        persons = persons.concat(personObject)
        response.json(personObject)
    }
})



const port = process.env.PORT || 3001
app.listen(port, () =>{
    console.log("Server is running on port " + port)
})