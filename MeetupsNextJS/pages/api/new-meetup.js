import { MongoClient } from "mongodb"

async function handler(req, res){
    if(req.method === 'POST'){
        const data = req.body
        const client = await MongoClient.connect('mongodb+srv://<username>:<password>@cluster0.cso2v.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0')
        const db = client.db()
        const meetupsCollection = db.collection('meetups')
        const result = await meetupsCollection.insertOne(data)
        client.close()
        res.status(201).json({message: 'Meetup inserted successfully'})
    }
}

export default handler