#!/usr/bin/env nodes
var argv = require('yargs').argv
var agility = require('@agility/content-fetch')
var agilityMgmt = require('@agility/content-management')
require('dotenv').config();

//handy function we can use to wait...
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

//a place to put default options (if any for the cli)
var options = {}

//overwrite default options with user args
options = {...options, ...argv};


//Example: Create a new content item and then create new 'child' content items for a linked content field
(async () => {

    //initialize the API client to retrieve content
    var fetchAPI = agility.getApi({
        guid: process.env.AGILITY_GUID,
        apiKey: process.env.AGILITY_PREVIEW_API_KEY,
        isPreview: true
    })
    
    //initialize the API client to save/update content
    var managementAPI = agilityMgmt.getApi({
        location: process.env.AGILITY_LOCATION,
        websiteName: process.env.AGILITY_WEBSITE_NAME,
        securityKey: process.env.AGILITY_SECURITY_KEY
    })

    //set the fields for the new content item you want to create
    let contentID = -1
    let contentItem = {
        contentID: contentID,
        fields: {
            "ProductUPC": "TEST from Agility 2",
            "MainImage": {
                mediaID: 2037,
                label: "some label"
            },
            "ImageHash": "2749237489327849"
        }
    }

    let referenceName = "CPProductImageList";
    let languageCode = "en-us";

    //create the new content item
   contentID = await managementAPI.saveContentItem({
       contentItem,
       languageCode,
       referenceName
   });


   let contentResp = null;
   //before we can create content within a 'child' list of the parent content item, we need to wait for the API to be updated
   let waitForUpdate = async () => {
       while(!contentResp) {
            contentResp = await fetchAPI.getContentItem({
                contentID,
                languageCode
            }) 
            //wait 3 seconds... and try again
            wait(3000);
       }
   }

   await waitForUpdate();

   //now that we have a reference name for the child list, we can create content items
   const childImagesReferenceName = contentResp.fields.childImages.referencename;

   const childContentItem = {
       contentID: -1,
       fields: {
           "Title": "Some product title 2",
           "image": {
               mediaID: 2037,
                label: "some label"
           },
           "ImageHash": "33333333333"
       }
   }

   //save a child content item
   const childContentID = await managementAPI.saveContentItem({
       contentItem: childContentItem,
       languageCode,
       referenceName: childImagesReferenceName
   })

   //access the contentID of the saved child item...
   console.log(childContentID)

})();




