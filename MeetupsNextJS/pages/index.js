import { Fragment, useEffect } from 'react'
import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb'
import Head from 'next/head'


function HomePage(props){
    return(
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='Browse a huge list of highly active React meetups'/>
            </Head>
            <h1>React Meetups</h1>
            <MeetupList meetups={props.meetups}/>
        </Fragment>
    )
}

// export async function getServerSideProps(context){
//     const req = context.req
//     const res = context.res

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export async function getStaticProps(){
    // fetch data from API
    const client = await MongoClient.connect('mongodb+srv://<username>:<password>@cluster0.cso2v.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find().toArray()
    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        }, 
        revalidate: 1
    }
}

export default HomePage