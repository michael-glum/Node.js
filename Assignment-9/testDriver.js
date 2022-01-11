/*
 * Assignment 9 Contact App
 * cse270e
 * Copyright Michael Glum January 11, 2022
 */

const p = require("./Person");
const contacts = require("./Contacts");

var i = new p.Person();
i.name = "Michael";
i.phone = "123-123-1234";
i.email = "michael@email.com";

var storage = new contacts.Contacts();
storage.add(i);

console.log("dumping storage", storage);
