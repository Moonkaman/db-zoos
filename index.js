const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => res.status(200).json(zoos))
    .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the list of zoos at this time', error: err}));
})

server.get('/api/zoos/:id', (req, res) => {
  db('zoos').where({id: req.params.id}).first()
    .then(zoo => res.status(200).json(zoo))
    .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the specified zoo at this time', error: err}));
})

server.post('/api/zoos', (req, res) => {
  if(req.body.name){
    db('zoos').insert(req.body)
      .then(id => {
        db('zoos').where({id: id[0]}).first()
          .then(newZoo => res.status(201).json(newZoo))
          .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the new zoo at this time', error: err}));
      })
      .catch(err => res.status(500).json({errorMessage: 'Could not create a zoo at this time', error: err}));
  } else {
    res.status(400).json({errorMessage: 'Please provide a name'})
  }
})

server.put('/api/zoos/:id', (req, res) => {
  if(req.body.name){
    db('zoos').where({id: req.params.id}).update(req.body)
      .then(count => {
        if(count > 0) {
          db('zoos').where({id: req.params.id}).first()
            .then(updatedZoo => res.status(200).json(updatedZoo))
            .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the updated zoo at this time', error: err}));
        } else {
          res.status(404).json({errorMessage: 'The Zoo you tried to update was not found'});
        }
      })
      .catch(err => res.status(500).json({errorMessage: 'Could not update the specified zoo at this time', error: err}));
  } else {
    res.status(400).json({errorMessage: 'Please provide a name'})
  }
})

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos').where({id: req.params.id}).del()
    .then(count => {
      console.log(count);
      if(count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({errorMessage: 'The Zoo you tried to delete was not found'});
      }
    })
    .catch(err => res.status(500).json({errorMessage: 'Could not update the specified zoo at this time', error: err}));
})

//----------------------------------------- Bears Endpoints --------------------------------------------\\

server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => res.status(200).json(bears))
    .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the list of bears at this time', error: err}));
})

server.get('/api/bears/:id', (req, res) => {
  db('bears').where({id: req.params.id}).first()
    .then(bear => res.status(200).json(bear))
    .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the specified bear at this time', error: err}));
})

server.post('/api/bears', (req, res) => {
  if(req.body.name){
    db('bears').insert(req.body)
      .then(id => {
        db('bears').where({id: id[0]}).first()
          .then(newBear => res.status(201).json(newBear))
          .catch(err => res.status(500).json({errorMessage: 'Could not retrieve the new bear at this time', error: err}));
      })
      .catch(err => res.status(500).json({errorMessage: 'Could not create a bear at this time', error: err}));
  } else {
    res.status(400).json({errorMessage: 'Please provide a name'})
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
