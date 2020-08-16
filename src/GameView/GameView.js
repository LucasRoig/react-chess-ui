import {Component} from "react";
import ChessboardWrapper from "./ChessBoard/ChessboardWrapper/ChessboardWrapper";

// import MoveList from "./MoveList/MoveList";
import NotationView from "./NotationView/NotationView";
import React from "react";
import Position from "../models/Position";
import Chess from "chess.js";
import Game from "../models/Game";
import "./gameview.scss"
import GameService from "./GameService";

export default class GameView extends Component {
  chess = new Chess();
  style = {
    width: "5500px"
  };

  constructor(props) {
    super(props);
    let gameId = props.match.params.id
    if (gameId) {
      this.state = {
        currentPosition: null,
        game: null
      }
    } else {
      let game = new Game();
      this.state = {
        game,
        currentPosition: this.game.startingPosition
      }
    }
  }

  render = () => {
    return (
      <>
        {this.state.game ?
          //tab index is required to catch onKeyDown
          <div className="container" onKeyDown={this.onKeyDown} tabIndex="0">
            <div className="columns">
              <div className="column">
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
                <button onClick={this.saveComment}>Save Comment</button>
              </div>
              <div className="column notation-column">
                <NotationView game={this.state.game}
                              handleClick={this.setPosition}
                              currentPosition={this.state.currentPosition}
                              makeMove={this.makeMove}
                              onContextualAction={this.handleContextualActionOnNotation}/>
                {/* <MoveList game={this.game} handleClick={this.setPosition}
                                  currentPosition={this.state.currentPosition}/> */}
              </div>
            </div>
          </div>
          : <div>loading</div>}
      </>
    )
  };

  onWheel = (e) => {
    if (e.deltaY < 0) {
      this.previousPosition();
      return;
    }
    if (e.deltaY > 0) {
      this.nextPosition();
      return;
    }
  };

  onKeyDown = (e) => {
    //key left
    if (e.keyCode === 37) {
      this.previousPosition();
      e.preventDefault();
      return;
    }
    //key right
    if (e.keyCode === 39) {
      this.nextPosition();
      e.preventDefault();
      return;
    }
    console.log(e.keyCode)
  };

  saveComment = (e) => {
    let p = this.findPositionInGame(this.state.currentPosition);
    if (p) {
      p.comment = e.target.value
      this.setState({currentPosition: p});
    }
    // let positionStack = [this.game.startingPosition];
    // while (positionStack.length > 0){
    //     let position = positionStack.pop();
    //     if(position == null) continue;
    //     positionStack.push(position.nextPosition);
    //     position.sublines.forEach(p => positionStack.push(p));
    //     if(position === this.state.currentPosition){
    //         position.comment = e.target.value;
    //         this.setState({currentPosition: position});
    //         break;
    //     }
    // }
  };

  findPositionInGame(positionToFind) {
    let positionStack = [this.state.game.startingPosition];
    while (positionStack.length > 0) {
      let position = positionStack.pop();
      if (position == null) continue;
      positionStack.push(position.nextPosition);
      position.sublines.forEach(p => positionStack.push(p));
      if (position === positionToFind) {
        return position;
      }
    }
    return null;
  }

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

  isMoveLegal = (source, target) => {
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
    if (!this.isMoveLegal(source, target)) {
      return 'snapback';
    }
  };

  //used to avoid the other parameters of onSnapEnd from the board
  onSnapEnd = (source, target) => {
    this.makeMove(source, target)
  };

  makeMove = (source, target, promotion) => {
    //TODO optimiser un jour?
    if (this.isMoveLegal(source, target)) {
      this.chess.load(this.state.currentPosition.fen);
      let move = this.chess.move({
        from: source,
        to: target,
        promotion: promotion || 'q' // NOTE: always promote to a queen for example simplicity
      });
      let fen = this.chess.fen();
      if (this.state.currentPosition.nextPosition && this.state.currentPosition.nextPosition.fen === fen) {
        this.setState({currentPosition: this.state.currentPosition.nextPosition})
      } else {
        let lookInSublines = this.state.currentPosition.sublines.filter(pos => pos.fen === fen);
        if (lookInSublines.length > 0) {
          this.setState({currentPosition: lookInSublines[0]})
        } else {
          let pos = new Position(this.chess.fen(), move, this.state.currentPosition);
          this.state.currentPosition.addNextPosition(pos);
          this.setState({
            currentPosition: pos
          })
          this.saveGame();
        }
      }
    }
  };

  saveGame = () => {
    GameService.saveGame(this.state.game);
  }

  handleContextualActionOnNotation = (e, data, target) => {
    const {action, position} = data;
    if (action === "DELETE_NEXT_POSITIONS") {
      let p = this.findPositionInGame(position);
      if (p) {
        p.nextPosition = null;
        p.sublines = [];
        this.setState({currentPosition: p})
        this.saveGame()
        return;
      }
    }
    if (action === "PROMOTE_SUBLINE" || action === "DELETE_SUBLINE") {
      let p = this.findPositionInGame(position);
      if (p) {
        let positionBeforeP = p.previousPosition;
        while (positionBeforeP) {
          if (positionBeforeP.nextPosition !== p) {
            let i = positionBeforeP.sublines.indexOf(p);
            if (action === "PROMOTE_SUBLINE") {
              positionBeforeP.sublines[i] = positionBeforeP.nextPosition;
              positionBeforeP.nextPosition = p;
              this.setState({currentPosition: position})
              return;
            } else if (action === "DELETE_SUBLINE") {
              positionBeforeP.sublines.splice(i, 1)
              this.setState({currentPosition: positionBeforeP})
              console.log(this.state.game)
              return;
            }
          }
          p = positionBeforeP;
          positionBeforeP = p.previousPosition;
        }
        this.saveGame()
      }
    }
    console.log(e, data, target);
  };

  componentDidMount() {
    let gameId = this.props.match.params.id;
    if (gameId) {
      GameService.fetchGame(gameId).then(game => {
        this.setState({
          game,
          currentPosition: game.startingPosition
        })
      })
    }
    // let stockfish = require("stockfish");
    // let engine = stockfish();
  }
}
