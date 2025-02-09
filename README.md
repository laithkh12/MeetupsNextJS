
# MeetupsNextJS

A Next.js application for displaying and managing meetups, with data fetched from a MongoDB database.

## Project Overview

This project demonstrates how to build a Next.js application that connects to a MongoDB database to fetch, add, and display meetups. The app has the following features:

- **View All Meetups**: Displays a list of meetups fetched from MongoDB.
- **View Single Meetup**: Displays detailed information for a single meetup.
- **Add a Meetup**: Allows users to add new meetups to the database.



## Features

### 1. **View All Meetups**

On the home page, users can see a list of all meetups available in the database. The data is fetched from MongoDB during the build time using Next.js' `getStaticProps`. The `MeetupList` component is responsible for rendering each meetup with its title, address, and image.

#### Code Example: `pages/index.js`
```javascript
export async function getStaticProps(){
    // Fetch data from MongoDB
    const client = await MongoClient.connect('your-mongodb-connection-string');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1 // Revalidate every 1 second
    }
}
```

This function fetches the meetups from MongoDB and passes them as props to the component.

### 2. **View a Single Meetup**

Users can click on a specific meetup to view more detailed information. This is achieved through dynamic routing in Next.js. The page `pages/[meetupId].js` is responsible for displaying the detailed meetup information.

#### Code Example: `pages/[meetupId].js`
```javascript
import { MongoClient } from 'mongodb';

function MeetupDetails(props) {
    return (
        <div>
            <h1>{props.meetup.title}</h1>
            <p>{props.meetup.address}</p>
            <img src={props.meetup.image} alt={props.meetup.title} />
        </div>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect('your-mongodb-connection-string');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();

    const paths = meetups.map(meetup => ({
        params: { meetupId: meetup._id.toString() }
    }));

    return {
        paths: paths,
        fallback: false
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;
    
    const client = await MongoClient.connect('your-mongodb-connection-string');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });
    client.close();

    return {
        props: {
            meetup: {
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image
            }
        }
    };
}

export default MeetupDetails;
```

This function fetches the individual meetup based on the `meetupId` parameter and passes the data to the component for rendering.

### 3. **Add a New Meetup**

There is functionality to add new meetups to the database. This can be done by creating a form that sends data to the backend via an API route.

#### Code Example: API Route for Adding Meetup (`pages/api/addMeetup.js`)
```javascript
import { MongoClient } from 'mongodb';

async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, address, image } = req.body;
        
        const client = await MongoClient.connect('your-mongodb-connection-string');
        const db = client.db();
        const meetupsCollection = db.collection('meetups');
        
        const result = await meetupsCollection.insertOne({
            title,
            address,
            image
        });
        
        client.close();
        res.status(201).json({ message: 'Meetup added!' });
    }
}

export default handler;
```

This API route listens for `POST` requests and adds the new meetup to the MongoDB collection.

#### Code Example: Form for Adding a Meetup (`components/AddMeetupForm.js`)
```javascript
import { useState } from 'react';

function AddMeetupForm() {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');

    async function submitHandler(event) {
        event.preventDefault();

        const meetupData = {
            title,
            address,
            image
        };

        const response = await fetch('/api/addMeetup', {
            method: 'POST',
            body: JSON.stringify(meetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle error
        }
        
        // Reset form
        setTitle('');
        setAddress('');
        setImage('');
    }

    return (
        <form onSubmit={submitHandler}>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
            <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" />
            <button type="submit">Add Meetup</button>
        </form>
    );
}

export default AddMeetupForm;
```

This form component collects the necessary information (title, address, and image) and sends it to the backend via the API route.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/MeetupsNextJS.git
   cd MeetupsNextJS
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` to view the application.

## License

This project is licensed privately for personal use only.
