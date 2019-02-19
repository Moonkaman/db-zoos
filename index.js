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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
