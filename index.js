/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: seronen <seronen@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/01/23 13:44:37 by seronen           #+#    #+#             */
/*   Updated: 2021/01/24 22:31:49 by seronen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')
const { request, response } = require('express')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

let amount = 0

app.get('/', (request, response) => {
	response.send('<h1>Hello, World!</h1>')
})

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(result => {
		response.json(result)
		amount = result.length
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Contact.findById(request.params.id)
		.then(contact => {
			if (contact) {
				response.json(contact)
			}
			else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
			amount -= 1
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const contact = new Contact({
		name: request.body.name,
		number: request.body.number
	})
	if (!contact.name) {
		return response.status(400).json({error: 'Name missing in data'})
	}
	else if (!contact.number) {
		return response.status(400).json({error: 'Number missing in data'})
	}
	contact.save({new: true})
		.then(newContact => {
			console.log(`Contact saved!`)
			response.json(newContact)
			amount += 1
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const contact = {
		name: request.body.name,
		number: request.body.number
	}
	Contact.findByIdAndUpdate(request.params.id, contact, {new: true})
		.then(newContact => {
			response.json(newContact)
		})
		.catch(error => next(error))
})

app.get('/info', (request, response) => {
	response.send(`<h3>Phonebook has ${amount} people.</h3><h3>${new Date()}</h3>`)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
	console.log(`Server running at port ${port}`)
})

const invalidEndpoint = (request, response) => {
	response.status(404).send({error: 'invalid api endpoint'})
}
app.use(invalidEndpoint)

const errorHandler = (error, request, response, next) => {
	console.log(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({error: 'invalid id'})
	}
	else if (error.name === 'ValidationError') {
		return response.status(400).send({error: error.message})
	}
	next(error)
}
app.use(errorHandler)


