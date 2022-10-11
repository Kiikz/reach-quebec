require("dotenv").config();
const express = require('express')
const path = require('node:path')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
// const { MongoClient, ObjectID } = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const app = express()
const { ObjectId } = require('mongodb');
let posts = ''; 

// dotenv.config({path:'config.env'});

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('best-college-football-teams')
    const quotesCollection = db.collection('teams')

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
      db.collection('teams').find().toArray()
        .then(results => {
          res.render('index.ejs', { teams: results })
        })
        .catch(/* ... */)
    })

    app.post('/teams', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.post('/teams', (req,res) => {
        console.log(req.body);
    })


    app.post('/updateTeam/:id', async (req, res) => {
        let result = await quotesCollection.findOneAndUpdate(
        {
            "_id": ObjectId(req.params.id)
        },
        {
          $set: {
            team: 'Arkansas',
            quote: 'Woo Pig Sooie'
            }
        }
      )
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(error => console.error(error))
    })

    app.post('/deleteTeam/:id', async (req, res) => 
    {
        let result = await quotesCollection.findOneAndDelete( 
            {
              "_id": ObjectId(req.params.id)
            }
          )
          .then(result => {
            console.log(result); 
            res.redirect('/');
          })
          .catch(error => console.error(error))
        })
    app.listen(process.env.PORT || 3000 , 
        () => console.log("server running..."));

    })
  .catch(console.error)

