require("dotenv").config();
const express = require('express')
const path = require('node:path')
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const app = express()
let posts = ''; 

// dotenv.config({path:'config.env'});

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// async function main(){
//     try {
        
//         await client.connect();
 
        
//         databasesList = await client.db().admin().listDatabases();
 
//         console.log("Databases:");
//         databasesList.databases.forEach(db => console.log(` - ${db.name}`));

//         posts = await client.db("best-college-football-teams").collection("teams").findOne();

//         console.log(posts); 
        
//         return posts; 
        


//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }




// app.get('/', async function (req, res) {


//     const result = await main().catch(console.error);

//     console.log("results: ", result.title); 

//    res.send(`results:  ${ result.title }`); 

//     });

// app.listen(PORT, console.log(`server is running on port: ${PORT}` ));

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


    app.post('updateTeam/:id', async (req, res) => {
        let result = await teamsCollection.findOneAndUpdate(
        {
            "team": String(req.params.id)
        },
        {
          $set: {
            team: 'Arkansas',
            quote: 'Woo Pig'
            }
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.post('/deleteTeam/team', async (req, res) => {
     
        let result = await quotesCollection.findOneAndDelete( 
            {
              "_id": ObjectId  (req.params.id)
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

