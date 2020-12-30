import React, { Component } from 'react';
import { whileLoading, 
organizeDexByGen, 
getGensFromStorage, 
renderCB, updateCB, 
aggregateDex, 
selectPokemon, 
renderPokemon,
resetDexes,
renderCompletion,
storeCompletion } from './functions' ;
import './App.css';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
function createPokemonObj(res){ // turn API response into usable object
  let pokemonObj = {
    name:       null,
    type1:      null,
    type2:      null,
    artwork:    null,
    id:         null,
    sprite:     null
  }
  pokemonObj.name      = res.name.charAt(0).toUpperCase() + res.name.slice(1);
  pokemonObj.type1     = res.types[0].type.name.charAt(0).toUpperCase() + res.types[0].type.name.slice(1);
  pokemonObj.artwork   = res.sprites.other["official-artwork"].front_default;
  pokemonObj.id        = res.id;
  pokemonObj.sprite    = res.sprites.front_default;
  if(res.types[1]){
    pokemonObj.type2   = res.types[1].type.name.charAt(0).toUpperCase() + res.types[1].type.name.slice(1);
  }
  return pokemonObj;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
class App extends Component {
  state = {
    responsesArray:    [],
    pokemonEliminated: false,
  };
  
  componentDidMount() { // gets pokemon and adds them to state
    if(localStorage.getItem('nationalDex') == null){ // if Pokemon have not been loaded locally
      this.setState({ responsesArray: [] });
      for(let i = 1; i < 899; i++){ // load Pokemon to state from API
        this.callPokemon(i)
          .then(res => this.setState({ responsesArray: [...this.state.responsesArray, createPokemonObj(res)] }))
          .catch(err => console.log(err));
      }
    } else { // load Pokemon to state from local storage
      this.setState({ responsesArray: JSON.parse(localStorage.getItem('nationalDex')) });
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

  render(){
    organizeDexByGen(this.state.responsesArray);
    getGensFromStorage(this.state.responsesArray);
    aggregateDex();
    let pokemonToDisplay = selectPokemon();

    storeCompletion();

    return (

      <div className="App">
        <p>Pokemon: </p>
        <div>{ whileLoading(this.state.responsesArray) }</div>
        <div>{ renderCB(this.state.responsesArray) }</div>
        <div onClick={e => this.setState({ pokemonEliminated: true })}>
          { renderPokemon(pokemonToDisplay, this.state.responsesArray) }
        </div>


        {/*  div onClick={ e => eliminatePokemon(e) }  */}
        <button onClick={e => this.setState({ pokemonEliminated: true })}>Skip Round</button>
        <div onClick={e => this.setState({ pokemonEliminated: true })}><button onClick={e => resetDexes()}>Reset Pokedex</button></div>

        { renderCompletion() }
      </div>
    );
    
  }
}

export default App;