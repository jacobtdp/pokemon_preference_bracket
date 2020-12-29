import React, { Component } from 'react';
import './App.css';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
function createPokemonObj(res){ // turn API response into usable object
  let pokemonObj = {
    name:       null,
    type1:      null,
    type2:      null,
    spriteURL:  null,
    artwork:    null,
    id:         null
  }
  pokemonObj.name      = res.name.charAt(0).toUpperCase() + res.name.slice(1);
  pokemonObj.type1     = res.types[0].type.name.charAt(0).toUpperCase() + res.types[0].type.name.slice(1);
  pokemonObj.spriteURL = res.sprites.front_default;
  pokemonObj.artwork   = res.sprites.other["official-artwork"].front_default;
  pokemonObj.id        = res.id;
  if(res.types[1]){
    pokemonObj.type2   = res.types[0].type.name.charAt(0).toUpperCase() + res.types[0].type.name.slice(1);
  }
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

  function renderType2(props){
    if(props){
      return <p className="types" id="fromFunc">{ props }</p>
    } else {
      return null;
    }
  }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ------------------------------------------------------------------------------------
class App extends Component {
  state = {
    responsesArray:    [],
    pokemonEliminated: false,
    generations:       [1, 2, 3]
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
      // sort pokemon by ID
      let pokedex = this.state.responsesArray;
      pokedex.sort((a, b) => (a.id > b.id) ? 1 : -1);
      this.setState({ responsesArray: pokedex });

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

    let gens = JSON.parse(localStorage.getItem('checkArray'));
    ////////////////////////////////////////////////////////////////////

    function prepareDex(){
      let gens    = JSON.parse(localStorage.getItem('checkArray'));
      let pokedex = JSON.parse(localStorage.getItem('Pokedex'));

      console.log(gens);

      if(!gens.find(e => e === 8)){
        pokedex.splice(809, 897)
      }
      if(!gens.find(e => e === 7)){
        pokedex.splice(721, 808)
      }
      if(!gens.find(e => e === 6)){
        pokedex.splice(649, 720)
      }
      if(!gens.find(e => e === 5)){
        pokedex.splice(493, 648)
      }
      if(!gens.find(e => e === 4)){
        pokedex.splice(386, 492)
      }
      if(!gens.find(e => e === 3)){
        pokedex.splice(251, 385)
      }
      if(!gens.find(e => e === 2)){
        pokedex.splice(151, 250)
      }
      if(!gens.find(e => e === 1)){
        pokedex.splice(0, 150)
      }

      console.log(pokedex);
    }

    prepareDex();

    //////////////////////////////////////////////////////////////////

    // update the number of pokemon from localStorage upon page refresh
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

    // find id for two random pokemon to select from responses array
    let pokemon = selectPokemonToDisplay(numPokemon);
    let pokemonArray = this.state.responsesArray;
    let pokemon1;
    let pokemon2;

    if(pokemonArray[0]){ // add selected pokemon to variables
      pokemon1 = pokemonArray[pokemon[0]];
      pokemon2 = pokemonArray[pokemon[1]];
    }

    function eliminatePokemon(pokemon){ // remove pokemon from array, reduce num pokemon by 1
      pokemonArray.splice(pokemon, 1);
      localStorage.setItem('Pokedex', JSON.stringify(pokemonArray));
      numPokemon--;

      console.log('length: ', pokemonArray.length);
      console.log('num pokemon: ', numPokemon);
    }

    function updateGens(val){
      // populate array with localStorage checkbox info upon checkbox click
      let checksArr = JSON.parse(localStorage.getItem('checkArray'));
      val = parseInt(val);

      if(!checksArr.find(e => e === val)){ // if gen not in array, add it
        checksArr.push(val);
      } else if(checksArr.find(e => e === val)) { // if gen is in array, remove it
        let index = checksArr.indexOf(val);
        let newArr = checksArr;
        newArr.splice(index, 1);
      }

      renderCheckbox(checksArr);
    }

    function renderCheckbox(updatedArray=false){
      let box1Check = true;
      let box2Check = true;
      let box3Check = true;
      let checkArray;

      // create populate checkarray from either default or localStorage
      if(localStorage.getItem('checkArray')){
        checkArray = JSON.parse(localStorage.getItem('checkArray'));
      } else {
        checkArray = [1, 2, 3];
        localStorage.setItem('checkArray', JSON.stringify(checkArray));
      }
      
      // if a checkbox is clicked, send new gens array to storage
      if(updatedArray){ 
        checkArray = updatedArray;
        localStorage.setItem('checkArray', JSON.stringify(checkArray));
      }

      // if gen is not in array, box defaults unchecked
      for(let i = 0; i < 3; i++){
        if(!checkArray.find(element => element === i + 1)){
          eval( 'box' + (i + 1) + 'Check = false;' );
        }
      }

      // render the checkboxes div
      return [<div onChange={e => updateGens(e.target.value)}>
        <input type="checkbox" value="1" name="gen" defaultChecked={box1Check} /> Gen 1
        <input type="checkbox" value="2" name="gen" defaultChecked={box2Check} /> Gen 2
        <input type="checkbox" value="3" name="gen" defaultChecked={box3Check} /> Gen 3
      </div>]
    }

    return (
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

      <div className="App">
      { renderCheckbox() }

        <p>Pokemon: </p>

        <div onClick={e => this.setState({ pokemonEliminated: true })}>
          <button className="pokemon" onClick={e => eliminatePokemon(pokemon[1])}>
            <div className="pokemon-card">
              <h3>{ pokemon1 ? pokemon1.name : 'no Pokemon encountered :(' }</h3>
              <p className="types">{ pokemon1 ? pokemon1.type1 : 'type not found' }</p>
              {/* <p className="types">{ pokemon1 ? pokemon1.type2 : null }</p> */}
              { pokemon2 ? renderType2(pokemon2.type2) : null }
              <img className="sprite" src={ pokemon1 ? pokemon1.artwork : null } alt="pokemon" />
            </div>
          </button>
          <button className="pokemon" onClick={e => eliminatePokemon(pokemon[0])}>
            <div className="pokemon-card">
              <h3>{ pokemon2 ? pokemon2.name : 'no Pokemon encountered :(' }</h3>
              <p className="types">{ pokemon2 ? pokemon2.type1 : 'type not found' }</p>
              {/* <p className="types">{ pokemon2 ? pokemon2.type2 : null }</p> */}
              { pokemon2 ? renderType2(pokemon2.type2) : null }
              <img className="sprite" src={ pokemon2 ? pokemon2.artwork : null } alt="pokemon" />           
            </div>
          </button>
        </div>

        <button onClick={e => this.setState({ pokemonEliminated: true })}>Skip Round</button>

      </div>
    );
  }
}

export default App;