/*
 * Assignment 9 Contact App
 * cse270e
 * Copyright Michael Glum January 11, 2022
 */

class Contacts{
    constructor() {
        this.contacts = {};
    }

    add(person) {
        let id = person.name;
	this.contacts[id] = person;
    }

    get(id) {
        return this.contacts[id];
    }

    keys() {
        return Object.keys(this.contacts);
    }

    clear() {
	this.contacts = {};
    }

    del(id) {
        delete this.contacts[id];
    }

    toString() {
        var r = "";
	for (var i in this.contacts) {
	    let q = i.toString();
	    console.log(q);
	    r += i.toString() + "\n";
        }
	return r;
    }
}
    
module.exports.Contacts = Contacts;
