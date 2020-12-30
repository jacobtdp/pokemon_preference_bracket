import './App.css'

const whileLoading = function(array){
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





export default whileLoading;