const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Not enough parameters to launch")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = "mongodb+srv://juurivuohi:" + password + "@cluster0-pgv40.mongodb.net/phonebook?retryWrites=true&w=majority"
mongoose.connect(url, { useNewUrlParser: true })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const person = mongoose.model("Person", personSchema)

const newPerson = new person({
    name: name,
    number: number
})

if (process.argv.length === 3) {

    person.find({}).then(result => {
        console.log("Phonebook")
        result.forEach(index => {
            console.log(index.name + " " + index.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    newPerson.save().then(result => {
        console.log("added " + name + " number " + number)
        mongoose.connection.close()
    })
}else{
    console.log("Invalid amount of parameters.")
}

