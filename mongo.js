/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mongo.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: seronen <seronen@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/01/24 02:24:00 by seronen           #+#    #+#             */
/*   Updated: 2021/01/24 02:50:14 by seronen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('No password in args!')
	process.exit(-1)
}

const username = process.argv[2]
const passwd = process.argv[3]
const url = `mongodb+srv://${username}:${passwd}@cluster0.khn29.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length >= 6) {
	const contact = new Contact({
		name: process.argv[4],
		number: process.argv[5]
	})
	contact.save().then(response => {
		console.log(`Contact ${contact.name} saved!`)
		mongoose.connection.close()
	})
}
else {
	Contact.find({}).then(result => {
		result.forEach(elem => {
			console.log(`${elem.name} ${elem.number}`)
		})
		mongoose.connection.close()
	})
}