const axios = require('axios')
const { cities } = require('../test-data/cities')
const client = require('../../server/connection')
const { json } = require('express')
const db = client.db()

client.connect()
.then(() => {
    console.log('we are connected to the db');
})

async function populateToiletsInCities() {
    try {
        for (const city of cities) {
            const { name, latitude, longitude } = city
            console.log(city, '<<< each city object');
            const info = await axios.get(
                "https://www.refugerestrooms.org/api/v1/restrooms/by_location",
                {
                    params: {
                        lat: city.latitude,
                        lng: city.longitude,
                        page: 1,
                        per_page: 25,
                        offset: 0,
                    },
                }
            );
            const toiletsData = info.data;
            
            fs write file to json
            use correct schema 
            replant the dev db


            console.log(toiletsData, '<<<<< each city data in the populate func');
        }
    } catch (err) {
        console.error("Error", err);
    }


    for (const toilet of toiletsData) {
        const existingToilet = await db.collection('toilets').findOne({ id: toilet.id });
        console.log(existingToilet);
    }





//         if (existingToilet) {
//             // Update existing toilet
//             await Toilet.findByIdAndUpdate(existingToilet._id, {
//                 name: toiletData.name,
//                 street: toiletData.street,
//                 city: toiletData.city,
//                 country: toiletData.country,
//                 unisex: toiletData.unisex,
//                 changing_table: toiletData.changing_table,
//                 comment: toiletData.comment,
//                 latitude: toiletData.latitude,
//                 longitude: toiletData.longitude,
//                 distance: toiletData.distance,
//                 accessible: toiletData.accessible
//             });
//             console.log("Toilet updated:", toiletData.name);
//         } else {
//             // Create new toilet
//             await Toilet.create({
//                 refuge_id: toiletData.id,
//                 name: toiletData.name,
//                 street: toiletData.street,
//                 city: toiletData.city,
//                 country: toiletData.country,
//                 unisex: toiletData.unisex,
//                 changing_table: toiletData.changing_table,
//                 comment: toiletData.comment,
//                 latitude: toiletData.latitude,
//                 longitude: toiletData.longitude,
//                 distance: toiletData.distance,
//                 accessible: toiletData.accessible
//             });
//             console.log("New toilet created:", toiletData.name);
//         }
//     }
// }
//  catch (err) {
// console.error("Error", err);
// }

populateToiletsInCities()