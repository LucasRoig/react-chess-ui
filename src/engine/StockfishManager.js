import  Chess  from "chess.js";

const keywords = ['depth','seldepth','time','nodes','pv','multipv','score','currmove','currmovenumber', 'hashfull',
                    'nps', 'tbhits', 'cpuload', 'string', 'refutation', 'currline', 'bmc'];
let nextWork = '';
let currentWork = '';
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
        currentWork = nextWork;
        engine.postMessage('go depth 20');
    }else if(data.startsWith('info')){
        let formatedData = formatInfo(data);
        let moveList = extractMovesFromLine(formatedData['pv'],currentWork);
        callOnInfo(moveList);
    }
};

let extractMovesFromLine = (line, fen) => {
    let movesUci = line.trim().split(' ');
    console.log(movesUci);
    let chess = new Chess(fen);
    let moveList = movesUci.map(uci => {
        let from = uci.substring(0,2);
        let to = uci.substring(2,4);
        let promotion = 'q';
        if(uci.length === 5){
            promotion = uci.substring(4)
        }
        let move = chess.move({
            from,
            to,
            promotion
        })
        if(move === null){
            console.error("Unable to calculate move for uci", uci);
            return []
        }
        return move;
    })
    return moveList;
} 

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