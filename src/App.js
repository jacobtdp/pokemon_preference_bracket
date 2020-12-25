import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
function createPokemonObj(res){ // turn API response into usable object
  let pokemonObj = {
    name: '',
    type1: null,
    type2: null,
    imageURL: null
  }
  pokemonObj.name = res.name.charAt(0).toUpperCase() + res.name.slice(1);
  pokemonObj.type1 = res.types[0].type.name;
  if(res.types[1]){
    pokemonObj.type2 = res.types[1].type.name;
  }
  pokemonObj.imageURL = res.sprites.front_default;
  return pokemonObj;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
function selectPokemonToDisplay(numPokemonRemaining){
  let pokemon1 = Math.floor(Math.random() * numPokemonRemaining);
  let pokemon2 = Math.floor(Math.random() * numPokemonRemaining);
  if(pokemon2 === pokemon1){
    pokemon2 = Math.floor(Math.random() * numPokemonRemaining);
  }
  
  return [pokemon1, pokemon2];
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------

// function eliminatePokemon(pokemon){
//   console.log('pokemon to delete ID: ', pokemon);
//   // this.setState({ pokemonEliminated: true });
// }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
class App extends Component {
  state = {
    responsesArray: [],
    pokemonEliminated: false
  };
  
  componentDidMount() {
    if(localStorage.getItem('Pokedex') == null){ // if Pokemon have not been loaded locally
      this.setState({ responsesArray: [] });

      for(let i = 1; i < 899; i++){ // load Pokemon to state from API
        console.log(i);
        this.callPokemon(i)
          .then(res => this.setState({ responsesArray: [...this.state.responsesArray, createPokemonObj(res)] }))
          .catch(err => console.log(err));
      }
    } else { // load Pokemon to state from local storage
      this.setState({ responsesArray: JSON.parse(localStorage.getItem('Pokedex')) });
    }

  }

  callPokemon = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  }
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
render() {

    let numPokemon;
    if(localStorage.getItem('Pokedex')){
      numPokemon = JSON.parse(localStorage.getItem('Pokedex')).length;
    } else {
      numPokemon = 898;
    }

    // if Pokedex is not in local storage, put it there
    if(this.state.responsesArray.length === numPokemon && !localStorage.getItem('Pokedex')){
      localStorage.setItem('Pokedex', JSON.stringify(this.state.responsesArray));
    }

    let pokemon = selectPokemonToDisplay(numPokemon);
    let pokemonArray = this.state.responsesArray;
    let pokemon1;
    let pokemon2;

    if(pokemonArray[0]){
      pokemon1 = pokemonArray[pokemon[0]];
      pokemon2 = pokemonArray[pokemon[1]];
    }

    function eliminatePokemon(pokemon){
      pokemonArray.splice(pokemon, 1);
      localStorage.setItem('Pokedex', JSON.stringify(pokemonArray));
      numPokemon--;

      console.log('length: ', pokemonArray.length);
      console.log('num pokemon: ', numPokemon);
    }

    if(numPokemon === 50){
      localStorage.setItem('Top-50', JSON.stringify(pokemonArray));
    } else if(numPokemon === 25){
      localStorage.setItem('Top-25', JSON.stringify(pokemonArray));
    } else if(numPokemon === 6){
      localStorage.setItem('Your-team', JSON.stringify(pokemonArray));
    }

    return (
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/* <button></button> */}
        </header>

{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

        <p>Pokemon: </p>

        <div onClick={e => this.setState({ pokemonEliminated: true })}>
          <button onClick={e => eliminatePokemon(pokemon[1])}>
            <div className="pokemon-card">
              <h3>{ pokemon1 ? pokemon1.name : 'no Pokemon encountered :(' }</h3>
              <p>{ pokemon1 ? pokemon1.type1 : 'type not found' }</p>
              <p>{ pokemon1 ? pokemon1.type2 : null }</p>
              <img src={ pokemon1 ? pokemon1.imageURL : null } />
            </div>
          </button>
          <button onClick={e => eliminatePokemon(pokemon[0])}>
            <div className="pokemon-card">
              <h3>{ pokemon2 ? pokemon2.name : 'no Pokemon encountered :(' }</h3>
              <p>{ pokemon2 ? pokemon2.type1 : 'type not found' }</p>
              <p>{ pokemon2 ? pokemon2.type2 : null }</p>
              <img src={ pokemon2 ? pokemon2.imageURL : null } />           
            </div>
          </button>
        </div>

        <button onClick={e => this.setState({ pokemonEliminated: true })}>Skip Round</button>





      </div>
    );
  }
}

export default App;