import './App.css'

export const whileLoading = function(array){
    let bwidth = Math.floor((array.length / 898) * 100);
        while(bwidth < 100){
        return(
            <div>
            <h3>Loading Pokemon... ({bwidth}%)</h3>
            <div className="loadingBar" style={{ width: `${bwidth}%` }}></div>
            </div>
        );
    }
}

export const renderProgressBar = function(){
    let cdex = JSON.parse(localStorage.getItem('dexToUseConst'));
    let dex  = JSON.parse(localStorage.getItem('dexToUse'));

    if(cdex && dex){
        console.log(cdex.length, ' : ', dex.length);
        let curr    = (cdex.length - dex.length);
        let ideal   = cdex.length;
        let percent = (curr / ideal) * 100;

        return(
            <div className="progress">
            <h4>You're almost there! Progress... { Math.floor(percent) }%</h4>
            <div className="loadingBar" style={{ width: `${percent}%` }}></div>
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
    if(nationalDex){
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
                    <label className="cb-label"><input name="CB1" type="checkbox" defaultChecked={checked1} onClick={e => updateCB(checked1, 1)} />Gen 1</label>
                    <label className="cb-label"><input name="CB2" type="checkbox" defaultChecked={checked2} onClick={e => updateCB(checked2, 2)} />Gen 2</label>
                    <label className="cb-label"><input name="CB3" type="checkbox" defaultChecked={checked3} onClick={e => updateCB(checked3, 3)} />Gen 3</label>
                    <label className="cb-label"><input name="CB4" type="checkbox" defaultChecked={checked4} onClick={e => updateCB(checked4, 4)} />Gen 4</label>
                    <label className="cb-label"><input name="CB5" type="checkbox" defaultChecked={checked5} onClick={e => updateCB(checked5, 5)} />Gen 5</label>
                    <label className="cb-label"><input name="CB6" type="checkbox" defaultChecked={checked6} onClick={e => updateCB(checked6, 6)} />Gen 6</label>
                    <label className="cb-label"><input name="CB7" type="checkbox" defaultChecked={checked7} onClick={e => updateCB(checked7, 7)} />Gen 7</label>
                    <label className="cb-label"><input name="CB8" type="checkbox" defaultChecked={checked8} onClick={e => updateCB(checked8, 8)} />Gen 8</label>
                </div>
            );
        }
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
        localStorage.setItem('dexToUseConst', JSON.stringify(dex));
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
    localStorage.setItem('dexToUseConst', JSON.stringify(dex));
    return dex;
}

export const selectPokemon = function(){
    let dex = JSON.parse(localStorage.getItem('dexToUse'));

    if(dex){
        let num1 = Math.floor(Math.random() * Math.floor(dex.length));
        let num2 = Math.floor(Math.random() * Math.floor(dex.length));
        while(num1 === num2){
            num2 = Math.floor(Math.random() * Math.floor(dex.length));
        }
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
    let topTeam = JSON.parse(localStorage.getItem('topTeam'));

    if(!topTeam){
        const index = dex.findIndex(pokemon => pokemon.id === poke.id); // update dexToUse
        if (index > -1) { dex.splice(index, 1); }

        for(let i = 0; i < gensDex.length; i++){ // update gensDex
            const gensIndex = gensDex[i].findIndex(pokemon => pokemon.id === poke.id);
            if (index > -1) { gensDex[i].splice(gensIndex, 1); }
        }
    } else {
        alert('Your top team is ready! Click reset Pokedex and select a new gen to keep playing.');
    }

    localStorage.setItem('dexToUse', JSON.stringify(dex));
    localStorage.setItem('gensDex', JSON.stringify(gensDex));
    console.log(dex.length);
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

export const resetDexes = function(){
    localStorage.clear();
    renderCB();
}

export const storeCompletion = function(){
    let dex  = JSON.parse(localStorage.getItem('dexToUse'));
    let gens = JSON.parse(localStorage.getItem('gens'));

    if(dex){
        if(dex.length === 50){
            localStorage.setItem('top50', JSON.stringify(dex));
        }
        if(dex.length === 18){
            alert('Your top 18 pokemon are available below!');
            localStorage.setItem('top18', JSON.stringify(dex));
        }
        if(dex.length === 6){
            alert('Your top team is available below! Continue playing to reset your pokedex.');
            localStorage.setItem('topTeam', JSON.stringify(dex));
        }
        if(dex.length === 2){
            resetDexes();
        }
    }
}

export const renderCompletion = function(){
    let top50   = JSON.parse(localStorage.getItem('top50'));
    let top18   = JSON.parse(localStorage.getItem('top18'));
    let topTeam = JSON.parse(localStorage.getItem('topTeam'));

    let itemsf;
    let itemse;
    let itemst;

    if(top50 && !top18 && !topTeam){
        itemsf = top50.map((mon) =>
            <div className="smallMon">
                <p className="sprited">{ mon.name }</p>
                <img src={ mon.sprite } alt="small mon" />
            </div>
        );
    }
    if(top18){
        itemse = top18.map((mon) =>
            <div className="smallMon">
                <p className="sprited">{ mon.name }</p>
                <img src={ mon.sprite } alt="small mon" />
            </div>
        );
    }
    if(topTeam){
        itemst = topTeam.map((mon) =>
            <div className="smallMon">
                <p className="sprited">{ mon.name }</p>
                <img src={ mon.sprite } alt="small mon" />
            </div>
        );
    }
    const top18title   = <h3>Top 18: </h3>
    const topTeamTitle = <h3>Top Team!</h3>

    return(
        <div>
            <div className="top-50">
                { top50 ? itemsf : null }
            </div>
            <div className="top-18">
                { top18 ? top18title : null }
                { top18 ? itemse : null }
            </div>
            <div className="topTeam">
                { topTeam ? topTeamTitle : null }
                { topTeam ? itemst : null }
            </div>
        </div>
    );
}




export default { whileLoading,
organizeDexByGen, 
getGensFromStorage, 
renderCB, 
updateCB, 
aggregateDex, 
selectPokemon, 
renderPokemon,
resetDexes,
storeCompletion,
renderCompletion,
renderProgressBar };