import {Component} from "react";
import ChessboardWrapper from "./ChessBoard/ChessboardWrapper/ChessboardWrapper";

// import MoveList from "./MoveList/MoveList";
import NotationView from "./NotationView/NotationView";
import React from "react";
import Position from "../models/Position";
import Chess from "chess.js";
import Game from "../models/Game";
import "./gameview.scss"

export default class GameView extends Component {
    chess = new Chess();
    game = new Game();
    state = {
        currentPosition: this.game.startingPosition
    };
    style = {
        width: "5500px"
    };
    render = () => {
        return (
            //tab index is required to catch onKeyDown
            <div className="container" onKeyDown={this.onKeyDown} tabIndex="0">
                <div className="columns">
                    <div className="column" >
                        <div onWheel={this.onWheel}>
                            <ChessboardWrapper
                                onDragStart={this.onDragStart}
                                onDrop={this.onDrop}
                                onSnapEnd={this.onSnapEnd}
                                position={this.state.currentPosition.fen}/>
                        </div>
                        <button onClick={this.previousPosition}>Previous</button>
                        <button onClick={this.nextPosition}>Next</button>
                        <textarea value={this.state.currentPosition.comment} onChange={this.saveComment}/>
                        <button onClick={this.saveComment}>Save Comment </button>
                    </div>
                    <div className="column notation-column">
                        <NotationView game={this.game} handleClick={this.setPosition} currentPosition={this.state.currentPosition} makeMove={this.makeMove}/>
                        {/* <MoveList game={this.game} handleClick={this.setPosition}
                                  currentPosition={this.state.currentPosition}/> */}
                    </div>
                </div>
            </div>
        )
    };

    onWheel = (e) => {
        if(e.deltaY < 0){
            this.previousPosition();
            return;
        }
        if(e.deltaY > 0){
            this.nextPosition();
            return;
        }
    };

    onKeyDown = (e) => {
        //key left
        if(e.keyCode === 37){
            this.previousPosition();
            e.preventDefault();
            return;
        }
        //key right
        if(e.keyCode === 39){
            this.nextPosition();
            e.preventDefault();
            return;
        }
        console.log(e.keyCode)
    };

    saveComment = (e) => {
        let positionStack = [this.game.startingPosition];
        while (positionStack.length > 0){
            let position = positionStack.pop();
            if(position == null) continue;
            positionStack.push(position.nextPosition);
            position.sublines.forEach(p => positionStack.push(p));
            if(position === this.state.currentPosition){
                position.comment = e.target.value;
                this.setState({currentPosition: position});
                break;
            }
        }
    };

    setPosition = (position) => {
        if (!position) return;
        this.setState({
            currentPosition: position
        })
    };

    previousPosition = () => {
        if (this.state.currentPosition.previousPosition) {
            this.setState({
                currentPosition: this.state.currentPosition.previousPosition
            })
        }
    };

    nextPosition = () => {
        if (this.state.currentPosition.nextPosition) {
            this.setState({
                currentPosition: this.state.currentPosition.nextPosition
            })
        }
    };

    onDragStart = (source, piece, position, orientation) => {
        this.chess.load(this.state.currentPosition.fen);
        if (this.chess.game_over() === true ||
            (this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {

            return false;
        }
    };

    isMoveLegal = (source,target) => {
        // console.log('drop')
        // see if the move is legal
        this.chess.load(this.state.currentPosition.fen);
        let move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        return move !== null;
        // console.log(this.game.turn())
        // illegal move
    };

    onDrop = (source, target) => {
        if (!this.isMoveLegal(source,target)) {
            return 'snapback';
        }
    };

    //used to avoid the other parameters of onSnapEnd from the board
    onSnapEnd = (source,target) => {
        this.makeMove(source,target)
    };

    makeMove = (source, target, promotion) => {
        //TODO optimiser un jour?
        if(this.isMoveLegal(source,target)){
            this.chess.load(this.state.currentPosition.fen);
            let move = this.chess.move({
                from: source,
                to: target,
                promotion: promotion || 'q' // NOTE: always promote to a queen for example simplicity
            });
            let pos = new Position(this.chess.fen(), move, this.state.currentPosition);
            this.state.currentPosition.addNextPosition(pos);
            this.setState({
                currentPosition: pos
            })
        }
    };

    componentDidMount() {
        // let stockfish = require("stockfish");
        // let engine = stockfish();
    }
}