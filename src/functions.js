import './App.css'

export const whileLoading = function(array){
    let bwidth = (array.length / 898) * 100;
        while(bwidth < 100){
        return(
            <div>
            <h3>Loading Pokemon... ({bwidth}%)</h3>
            <div className="loadingBar" style={{ width: `${bwidth}%` }}></div>
            </div>
        );
    }
}

export const organizeDexByGen = function(nationalDex){
    if( nationalDex.length === 898 && !JSON.parse(localStorage.getItem('nationalDex'))){

        nationalDex = nationalDex.sort((a, b) => (a.id > b.id) ? 1 : -1);
        let dex = nationalDex.slice();
        localStorage.setItem('nationalDex', JSON.stringify(nationalDex));

        let gen1 = dex.splice(0, 151);
        let gen2 = dex.splice(0, 100);
        let gen3 = dex.splice(0, 135);
        let gen4 = dex.splice(0, 107);
        let gen5 = dex.splice(0, 156);
        let gen6 = dex.splice(0, 72);
        let gen7 = dex.splice(0, 88);
        let gen8 = dex.splice(0, 89);
        let gensArray = [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];

        localStorage.setItem('gensDex', JSON.stringify(gensArray));
    }
}

export const getGensFromStorage = function(nationalDex){
    if(nationalDex.length === 898){
        if(!JSON.parse(localStorage.getItem('gens'))){
            let gens = [1, 2, 3, 4, 5, 6, 7, 8];
            localStorage.setItem('gens', JSON.stringify(gens));
            return gens
        } else {
            return JSON.parse(localStorage.getItem('gens'));
        }
    }
}

export const renderCB = function(nationalDex){
    if(nationalDex.length === 898){

        let gens = JSON.parse(localStorage.getItem('gens'));
        let checked1 = gens.includes(1);
        let checked2 = gens.includes(2);
        let checked3 = gens.includes(3);
        let checked4 = gens.includes(4);
        let checked5 = gens.includes(5);
        let checked6 = gens.includes(6);
        let checked7 = gens.includes(7);
        let checked8 = gens.includes(8);


        return (
            <div className="checkBoxes">
                <input name="CB1" type="checkbox" defaultChecked={checked1} onClick={e => updateCB(checked1, 1)} />
                <input name="CB2" type="checkbox" defaultChecked={checked2} onClick={e => updateCB(checked2, 2)} />
                <input name="CB3" type="checkbox" defaultChecked={checked3} onClick={e => updateCB(checked3, 3)} />
                <input name="CB4" type="checkbox" defaultChecked={checked4} onClick={e => updateCB(checked4, 4)} />
                <input name="CB5" type="checkbox" defaultChecked={checked5} onClick={e => updateCB(checked5, 5)} />
                <input name="CB6" type="checkbox" defaultChecked={checked6} onClick={e => updateCB(checked6, 6)} />
                <input name="CB7" type="checkbox" defaultChecked={checked7} onClick={e => updateCB(checked7, 7)} />
                <input name="CB8" type="checkbox" defaultChecked={checked8} onClick={e => updateCB(checked8, 8)} />
            </div>
        );
    }
}

export const updateCB = function(checked, gen){
    let gens = JSON.parse(localStorage.getItem('gens'));
    checked = gens.includes(gen);

    if(checked){
        const index = gens.indexOf(gen);
        if (index > -1) { gens.splice(index, 1); }
    } else {
        gens.push(gen);
    }

    localStorage.setItem('gens', JSON.stringify(gens));
    updateAggregateDex();
}

export const aggregateDex = function(){
    let gens    = JSON.parse(localStorage.getItem('gens'));
    let gensDex = JSON.parse(localStorage.getItem('gensDex'));
    if(!localStorage.getItem('dexToUse') && gens && gensDex){
        let dex = [];
        gens = gens.sort((a, b) => (a > b) ? 1 : -1);

        for(let i = 0; i < gens.length; i++){
            for(let j = 0; j < gensDex[gens[i] - 1].length; j++){
                dex.push(gensDex[gens[i] - 1][j]);
            }
        }

        localStorage.setItem('dexToUse', JSON.stringify(dex));
        return dex;
    }
}

export const updateAggregateDex = function(){
    let gens    = JSON.parse(localStorage.getItem('gens'));
    let gensDex = JSON.parse(localStorage.getItem('gensDex'));
    let dex = [];
    gens = gens.sort((a, b) => (a > b) ? 1 : -1);

    for(let i = 0; i < gens.length; i++){
        for(let j = 0; j < gensDex[gens[i] - 1].length; j++){
            dex.push(gensDex[gens[i] - 1][j]);
        }
    }

    localStorage.setItem('dexToUse', JSON.stringify(dex));
    return dex;
}

export const selectPokemon = function(){
    let dex = JSON.parse(localStorage.getItem('dexToUse'));

    if(dex){
        let num1 = Math.floor(Math.random() * Math.floor(dex.length));
        let num2 = Math.floor(Math.random() * Math.floor(dex.length));
        return [dex[num1], dex[num2]];
    }

    return 0;
}

export const renderType2 = function(poke){
    if(poke.type2){
        return(
            <p className="types">{ poke.type2 }</p>
        )
    }
}

export const eliminatePokemon = function(poke){
    console.log('pokemon to eliminate: ', poke.name);

    let dex     = JSON.parse(localStorage.getItem('dexToUse'));
    let gensDex = JSON.parse(localStorage.getItem('gensDex'));

    const index = dex.findIndex(pokemon => pokemon.id === poke.id); // update dexToUse
    if (index > -1) { dex.splice(index, 1); }

    for(let i = 0; i < gensDex.length; i++){ // update gensDex
        const gensIndex = gensDex[i].findIndex(pokemon => pokemon.id === poke.id);
        if (index > -1) { gensDex[i].splice(gensIndex, 1); }
    }

    localStorage.setItem('dexToUse', JSON.stringify(dex));
    localStorage.setItem('gensDex', JSON.stringify(gensDex));
}

export const renderPokemon = function(pokemonToDisplay, nationalDex){

    if(nationalDex.length === 898){
        let poke1 = pokemonToDisplay[0];
        let poke2 = pokemonToDisplay[1];
        return(

            <div>

                <div className="pokemon" onClick={ e => eliminatePokemon(poke2) }>
                    <div className="description">
                        <h3>{ poke1.name }</h3>
                        <p className="types">{ poke1.type1 }</p>
                        { renderType2(poke1) }
                    </div>
                    <img className="sprite" src={ poke1.artwork } alt="pokemon" />
                </div>

                <div className="pokemon" onClick={ e => eliminatePokemon(poke1) }>
                    <div className="description">
                        <h3>{ poke2.name }</h3>
                        <p className="types">{ poke2.type1 }</p>
                        { renderType2(poke2) }
                    </div>
                    <img className="sprite" src={ poke2.artwork } alt="pokemon" />
                </div>

            </div>

        );
    }
}




export default { whileLoading, organizeDexByGen, getGensFromStorage, renderCB, updateCB, aggregateDex, selectPokemon, renderPokemon };