const keywords = ['depth','seldepth','time','nodes','pv','multipv','score','currmove','currmovenumber', 'hashfull',
                    'nps', 'tbhits', 'cpuload', 'string', 'refutation', 'currline', 'bmc'];
let nextWork = '';
let callOnInfo = () => {};
let engine = new Worker("/stockfish.js");
engine.onmessage = function (message) {
    console.log("received : ", message.data);
    handleResponse(message.data);
};
engine.postMessage('setoption name multipv value 1')

let handleResponse = (data) =>{
    if(data === 'readyok'){
        engine.postMessage('position fen ' + nextWork);
        engine.postMessage('go depth 20');
    }else if(data.startsWith('info')){
        let formatedData = formatInfo(data);
        callOnInfo(formatedData);
    }
};

let formatInfo = (data) => {
  let formatedData = {};
  let currentKeyword = '';
  let currentData = '';
  data.split(' ').forEach(d => {
      if(d === 'info') return;
      if(keywords.includes(d)){
          if(currentKeyword.length > 0){
              formatedData[currentKeyword] = currentData;
          }
          currentKeyword = d;
          currentData = "";
      }else{
        currentData += d + " ";
      }
  });
  formatedData[currentKeyword] = currentData;
  return formatedData;
};


let StockfishManager = {
    analysePosition: (fen, onInfo) => {
        nextWork = fen;
        callOnInfo = onInfo;
        engine.postMessage('stop');
        engine.postMessage('ucinewgame');
        engine.postMessage('isready');
    }
};

export default StockfishManager;