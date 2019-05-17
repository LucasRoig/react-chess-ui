import {Component} from "react";
import ChessboardWrapper from "./ChessBoard/ChessboardWrapper/ChessboardWrapper";
// import MoveList from "./MoveList/MoveList";
import NotationView from "./NotationView/NotationView";
import React from "react";
import Position from "../models/Position";
import Chess from "chess.js";
import Game from "../models/Game";

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
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <ChessboardWrapper onDragStart={this.onDragStart}
                                           onDrop={this.onDrop}
                                           onSnapEnd={this.onSnapEnd}
                                           position={this.state.currentPosition.fen}/>
                        <button onClick={this.previousPosition}>Previous</button>
                        <button onClick={this.nextPosition}>Next</button>
                        <textarea value={this.state.currentPosition.comment} onChange={this.saveComment}/>
                        <button onClick={this.saveComment}>Save Comment </button>
                    </div>
                    <div className="column">
                        <NotationView game={this.game} handleClick={this.setPosition} currentPosition={this.state.currentPosition}/>
                        {/* <MoveList game={this.game} handleClick={this.setPosition}
                                  currentPosition={this.state.currentPosition}/> */}
                    </div>
                </div>
            </div>
        )
    };

    saveComment = (e) => {
        this.state.currentPosition.comment = e.target.value;
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
        this.chess.load(this.state.currentPosition.fen)
        if (this.chess.game_over() === true ||
            (this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {

            return false;
        }
    };

    onDrop = (source, target) => {
        // console.log('drop')
        // see if the move is legal
        this.chess.load(this.state.currentPosition.fen)
        let move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // console.log(this.game.turn())
        // illegal move
        if (move === null) {
            return 'snapback';
        }
    };

    onSnapEnd = (source, target) => {
        this.chess.load(this.state.currentPosition.fen)
        let move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        let pos = new Position(this.chess.fen(), move, this.state.currentPosition);
        this.state.currentPosition.addNextPosition(pos)
        this.setState({
            currentPosition: pos
        })
    };
}