#!/usr/bin/env nodes
var request = require('request')
var argv = require('yargs').argv
var clc = require('cli-color')
var deepSort = require('deep-sort')
var agility = require('@agility/content-fetch')
var agilityMgmt = require('@agility/content-management')

//colors... oh ya...
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

//TODO: validate required args `argv[paramName]`

//TODO: set default options
var options = {

}

//overwrite default options with user args
options = {...options, ...argv};

var api = agilityMgmt.getApi({
    location: process.env.AGILITY_LOCATION,
    websiteName: process.env.AGILITY_WEBSITE_NAME,
    securityKey: process.env.AGILITY_SECURITY_KEY
})

//Set the contentID and language code of content you want to publish
let contentIDToWorkOn = 5 //TODO: change this to an ID in your Agility instance
let contentID = contentIDToWorkOn;
let languageCode = "en-us";

api.publishContent({
 contentID,
 languageCode
})
.then(function(contentID) {
 //check contentID is greater > 0 for success
})
.catch(function(error) {
 //handle error
});