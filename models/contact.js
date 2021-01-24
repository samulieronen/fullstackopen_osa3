/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   contact.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: seronen <seronen@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/01/24 14:20:13 by seronen           #+#    #+#             */
/*   Updated: 2021/01/24 21:46:51 by seronen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('Conneecting to database.')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then (result => {
		console.log('Connection successful.')
	})
	.catch((error) => {
		console.log('Error while connecting to database!', error.message)
	})

const contactSchema = new mongoose.Schema({
	name: {type: String, minlength: 3, required: true, unique: true},
	number: {type: String, minlength: 8, required: true}
})

contactSchema.set('toJSON', {
	transform: (document, returned) => {
		returned.id = returned._id.toString()
		delete returned._id
		delete returned.__v
	}
})
contactSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Contact', contactSchema)
