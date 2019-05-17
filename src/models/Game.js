import Position from './Position'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
export default class{
    constructor(){
        this.positions = [];
        this.startingPosition = new Position(STARTING_FEN);
        this.whiteName = "white"
        this.blackName = "black"
    }
}