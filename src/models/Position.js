import * as Constants from './Constants';
export default class Position{
    constructor(fen, lastMove, previousPosition){
        this.fen = fen;
        this.lastMove = lastMove;
        this.previousPosition = previousPosition;
        this.nextPosition = null;
        this.comment = "";
        this.sublines = [];
        
        if(this.previousPosition){
            if(this.lastMove.color === 'w'){
                this.moveNumber = this.previousPosition.moveNumber + 1;
            }else{
                this.moveNumber = this.previousPosition.moveNumber
            }
        }else{
            this.moveNumber = 0
        }
    }

    sideToMove(){
        if(!this.lastMove || this.lastMove.color === Constants.BLACK)
            return Constants.WHITE
        else
            return Constants.BLACK
    }

    addNextPosition(nextPosition){
        if(!this.nextPosition){
            this.nextPosition = nextPosition;
            return
        }
        if(this.nextPosition.fen === nextPosition.fen){
            return
        }
        if(!this.sublines.find(pos => pos.fen === nextPosition.fen)){
            this.sublines.push(nextPosition)
        }
    }
}