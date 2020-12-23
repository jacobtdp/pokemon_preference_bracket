const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});
///////////////////////////////////////////////////////////////////////////////

// var Pokedex = require('pokedex-promise-v2');
// var P = new Pokedex();

// P.getPokemonByName('eevee') // with Promise
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log('There was an ERROR: ', error);
//   });

app.get('https://pokeapi.co/api/v2/pokemon/1/', (req, res) => {
  console.log("In server");
  console.log(res.body);
  res.send( `Pokemon response: ${res.body}` );
});

///////////////////////////////////////////////////////////////////////////////


app.listen(port, () => console.log(`Listening on port ${port}`));