const express = require('express');
const parser = require('body-parser');
const server = express();
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost:27017', function(err, client){


  if (err) {
    // if can't connect to mongo then log error and exit
    console.log(err);
    return;
  }
  const db = client.db('star_wars');
  console.log("connected to database");

  // CREATE ROUTE
  server.post('/api/quotes', function(req, res){
    const quotesCollection = db.collection('quotes');
    const quoteToSave = req.body;

    quotesCollection.save(quoteToSave, function(err, result){
      if(err){
        console.log(err);
        // 500 - Internal server error
        res.status(500);
        res.send();
      }

      // 201 - Success - Created
      res.status(201);
      res.json(result.ops[0]);
      console.log('saved to database');
    });
  })

// INDEX - SHOW all quotes

  server.get('/api/quotes', function(req, res){
    const quotesCollection = db.collection('quotes');
    quotesCollection.find().toArray(function(err, allQuotes){
      if (err) {
        console.log(err);
        res.status(500);
        res.send();
      }

      res.json(allQuotes);
    });
  })

// DELETE ALL route

  server.delete('/api/quotes', function(req, res){
    const quotesCollection = db.collection('quotes');
    const filterObject = {};
    quotesCollection.deleteMany(filterObject, function(err, result){
      if (err) {
        console.log(500);
        res.send();
      }
      res.status(204);
      res.send();
    })
  })


// UPDATE ROUTE

  server.put('/api/quotes/:id', function(req, res){
    const quotesCollection = db.collection('quotes');
    // the approach using objectID can also be used for delete one or find one object
    const objectID = ObjectID(req.params.id);
    const filterObject = {_id: objectID}
    const updatedData = req.body;

    quotesCollection.update(filterObject, updatedData, function(err, result){
      if (err){
        console.log(err);
        res.status(500);
        res.send();
      }
      res.send()
    })
  })

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

})
