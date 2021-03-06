import  Chess  from "chess.js";


//TODO : réécrire tout ça, on peut s'inspirer de ce qu'a fait lichess ou partir sur un gros automate.
class EngineState{
    constructor(engineName, numberOfLines){
        this.name = engineName;
        this.lines = [];
        for (let i = 0; i<numberOfLines; i++){
            this.lines.push({});
        }
        this.depth = 0;
        this.selDepth = 0;
    }

    update(data){
        let moveList = extractMovesFromLine(data['pv'],currentWork);
        this.depth = data['depth'];
        this.selDepth = data['seldepth'];
        let lineNumber = data['multipv'] - 1;
        let score = data['score'].split(' ')[1] / 100;
        this.lines[lineNumber] = new EngineLine(score,moveList);
    }
}

class EngineLine{
    constructor(score,line){
        this.score = score;
        this.line = line;
    }
}

const keywords = ['depth','seldepth','time','nodes','pv','multipv','score','currmove','currmovenumber', 'hashfull',
                    'nps', 'tbhits', 'cpuload', 'string', 'refutation', 'currline', 'bmc'];
const ENGINE_NAME = "Stockfish 10";

let nextWork = '';
let currentWork = '';
let callOnInfo = () => {};
let engine = new Worker("/stockfish.js");
let currentState = {};
let running = false;
let onReady = () => {};
// let multipv = 1;

let send = (message) => {
    console.log("Send to engine : " + message);
    engine.postMessage(message);
};

engine.onmessage = function (message) {
    if(!message.data.startsWith('info'))
        console.log("received : ", message.data);
    handleResponse(message.data);
};


let setMultiPv = (value) => {
    send('setoption name multipv value ' + value);
    // multipv = value;
    currentState = new EngineState(ENGINE_NAME,value);
};

setMultiPv(3);

let handleResponse = (data) =>{
    if(data === 'readyok'){
        send('position fen ' + nextWork);
        currentWork = nextWork;
        send('go depth 20');
    }else if(data.startsWith('info')){
        running = true;
        let formatedData = formatInfo(data);
        currentState.update(formatedData);
        callOnInfo(currentState);
    }else if(data.startsWith('bestmove')){
        running = false;
        onReady();
        onReady = () => {};
    }
};

let extractMovesFromLine = (line, fen) => {
    let movesUci = line.trim().split(' ');
    // console.log(movesUci);
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
        if(!running){
            send('ucinewgame');
            send('isready');
        }else{
            onReady = () => {
                send('ucinewgame');
                send('isready');
            };
            send('stop')
        }
    }
};

export default StockfishManager;