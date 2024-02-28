const jsonData = require('../seedTestDatabase/originalDbsData/reviews_original_data.json');
const { client, connectToMongoDB, ENV } = require("../../server/connection");

async function seedDevReviewData() {
    try {
        await connectToMongoDB()
        const db = client.db("development");

        await db.collection('reviews').drop().then(() => {
            console.log('db dropped')
          })
        const formattedDataArray = jsonData.map(obj => ({
            toilet_id: obj.toilet_id,
            review: obj.review,
            created_at: new Date()
          }));
 
          const result = await db.collection('reviews').insertMany(formattedDataArray);
          console.log(`${result.insertedCount} reviews inserted successfully.`);
          
          await client.close();
        }
    
    catch(err){
        console.log(err, '<<< error message')
    }
}
seedDevReviewData()