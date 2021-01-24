/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   contact.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: seronen <seronen@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/01/24 14:20:13 by seronen           #+#    #+#             */
/*   Updated: 2021/01/24 14:25:32 by seronen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const mongoose = require('mongoose')

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
	name: String,
	number: String
})

contactSchema.set('toJSON', {
	transform: (document, returned) => {
		returned.id = returned._id.toString()
		delete returned._id
		delete returned.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)
