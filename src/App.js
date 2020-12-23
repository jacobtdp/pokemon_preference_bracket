import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function createPokemonObj(res){
  let pokemonObj = {
    name: '',
    type1: null,
    type2: null
  }
  pokemonObj.name = res.name;
  pokemonObj.type1 = res.types[0].type.name;
  if(res.types[1]){
    pokemonObj.type2 = res.types[1].type.name;
  }

  return pokemonObj;
}

class App extends Component {
  state = {
    responsesArray: [],
  };
  
  componentDidMount() {

    if(localStorage.getItem('Pokedex') == null){
      this.setState({ responsesArray: [] });

      for(let i = 1; i < 899; i++){
        console.log(i);
        this.callPokemon(i)
          .then(res => this.setState({ responsesArray: [...this.state.responsesArray, createPokemonObj(res)] }))
          .catch(err => console.log(err));
      }
    } else {
      this.setState({ responsesArray: JSON.parse(localStorage.getItem('Pokedex')) });
    }

  }

  callPokemon = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  }
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
render() {

    if(this.state.responsesArray.length === 898 && !localStorage.getItem('Pokedex')){
      localStorage.setItem('Pokedex', JSON.stringify(this.state.responsesArray));
    }


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>client/src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>Pokemon 1: </p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;