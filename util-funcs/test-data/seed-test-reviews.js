const jsonData = require('../data/test-data/reviews');
const { client, connectToMongoDB, ENV } = require("../../server/connection");

async function seedReviewTestData() {
    try {
        await connectToMongoDB()
        const db = client.db("testDatabase");

        await db.collection('reviews').drop().then(() => {
            console.log('db dropped');
          })
        const formattedDataArray = jsonData.map(obj => ({
            toilet_id: obj.toilet_id,
            review : obj.comment,
            created_at : new Date()
          }));
 
          const result = await db.collection('reviews').insertMany(formattedDataArray);
          console.log(`${result.insertedCount} reviews inserted successfully.`);
          
          await client.close();
        }
    
    catch(err){
        console.log(err, '<<< error message')
    }
}
seedReviewTestData()