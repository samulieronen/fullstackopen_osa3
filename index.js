/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: seronen <seronen@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/01/23 13:44:37 by seronen           #+#    #+#             */
/*   Updated: 2021/01/23 16:22:31 by seronen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456"
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523"
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345"
	},
	{
		id: 4,
		name: "Mary Poppendick",
		number: "39-23-5423122"
	}
]

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (request, response) => {
	response.send('<h1>Hello, World!</h1>')
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)
	if (person){
		console.log(person)
		response.json(person)
	}
	else {
		console.log(`No resource with id: ${id}`)
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(p => p.id !== id)
	response.status(204).end()
})

const genId = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return (Math.floor(Math.random() * (max - min) + min))
}

app.post('/api/persons', (request, response) => {
	const person = request.body
	const id = genId(10, 300)
	person.id = id
	if (!person.name) {
		return response.status(400).json({error: 'Name missing in data'})
	}
	else if (!person.number) {
		return response.status(400).json({error: 'Number missing in data'})
	}
	else if (dup = persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())) {
		return response.status(400).json({error: 'Name must be unique'})
	}
	console.log(person)
	persons = persons.concat(person)
	response.json(person)
})

app.get('/info', (request, response) => {
	response.send(`<h3>Phonebook has ${persons.length} people.</h3><h3>${new Date()}</h3>`)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
	console.log(`Server running at port ${port}`)
})

