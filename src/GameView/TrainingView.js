import React from "react"
import GameService from "./GameService";
import TrainingFactory from "./TrainingFactory";
import {BLACK, WHITE} from "../models/Constants";
import ChessboardWrapper from "./ChessBoard/ChessboardWrapper/ChessboardWrapper";
import NotationView from "./NotationView/NotationView";
import Chess from "chess.js";
import Game from "../models/Game";
import _ from "lodash"
import './trainingview.scss'
import {ModalWindow, showModal} from "../components/modal/Modal";
import {LIST_DATABASE} from "../Routes";
import ChessgroundWrapper from "./ChessBoard/ChessgroundWrapper";

class ConfigModal extends ModalWindow {
  constructor(props) {
    super(props);
    this.state = {
      color: BLACK,
      showDemo: true,
      restartAfterError: true,
      lines: this.buildTraining(BLACK)
    }
  }

  handleStart = () => {
    this.close();
    this.props.onStart(this.state);
  }

  handleCancel = () => {
    this.close();
    if (this.props.history.length > 0) {
      this.props.history.goBack();
    } else {
      this.props.history.push(LIST_DATABASE)
    }
  }

  handleColorChanged = (e) => {
    let color = e.target.value;
    let lines = this.buildTraining(color);
    this.setState({color, lines})
  }

  buildTraining = (color) => {
    let t = new TrainingFactory();
    return t.createTraining(this.props.game, color);
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Configuration de l'entraînement</p>
          </header>
          <section className="modal-card-body">
            <h1 className="title">{this.props.game.whiteName + (this.props.game.blackName ? " - " + this.props.game.blackName : "")}</h1>
            <h2 className="subtitle">Nombre de lignes : {this.state.lines.length}</h2>
            <div className="field">
              <label className="label">Couleur du joueur</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select value={this.state.color} onChange={this.handleColorChanged}>
                    <option value={WHITE}>Blanc</option>
                    <option value={BLACK}>Noir</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" checked={this.state.showDemo} onChange={(e) => this.setState({showDemo: e.target.checked})}/>
                  {"    Montrer la ligne en premier"}
                </label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" checked={this.state.restartAfterError} onChange={e => this.setState({restartAfterError: e.target.checked})}/>
                  {"    Recommencer après une erreur"}
                </label>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot space-between">
            <button className="button" onClick={this.handleCancel}>Annuler</button>
            <button className="button is-success" onClick={this.handleStart}>Démarrer</button>
          </footer>
        </div>
      </div>
    )
  }
}

class EndTrainingModal extends ModalWindow {
  handleGoBack = () => {
    this.close();
    if (this.props.history.length > 0) {
      this.props.history.goBack();
    } else {
      this.props.history.push(LIST_DATABASE)
    }
  }
  handleRestart = () => {
    this.close();
    this.props.onRestart();
  }
  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Entraînement terminé</p>
          </header>
          <section className="modal-card-body">
            L'entraînement est terminé. Vous pouvez recommencer ou retourner à la page précédente.
          </section>
          <footer className="modal-card-foot space-between">
            <button className="button" onClick={this.handleGoBack}>Retour</button>
            <button className="button is-success" onClick={this.handleRestart}>Recommencer</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default class TrainingView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameToTrain: null,
      currentPosition: null,
      currentLine: null,
      playerColor: BLACK,
      game: new Game(),
      totalLineCount: 0,
      currentLineIndex: 1,
      boardClass: "",
      demoRunning: false,
      errorDuringLine: false,
      showDemo: true,
      demoDelay: 800,
      restartAfterError: true,
      legalMoves:{}
    }
    this.chess = new Chess();
    this.lines = [];
    this.nextLineIndex = 0;
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    GameService.fetchGame(id).then(game => {
      const start = (config) => {
        this.lines = config.lines;
        this.setState({
          playerColor: config.color,
          totalLineCount: this.lines.length,
          showDemo: config.showDemo,
          restartAfterError: config.restartAfterError
        }, this.startLine)
      }
      showModal(<ConfigModal onStart={start} game={game} history={this.props.history}/>)
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentPosition !== prevState.currentPosition) {
      this.calcLegalMoves();
    }
  }

  calcLegalMoves() {
    if (! (this.state.currentPosition && this.state.currentPosition.fen)) {
      return;
    }
    const legalMoves = {get : d => legalMoves[d]};
    let chess = new Chess();
    chess.load(this.state.currentPosition.fen);
    chess.SQUARES.forEach(square => {
      const ms = chess.moves({square, verbose: true})
      if (ms.length > 0) {
        legalMoves[square] = ms.map(move => move.to)
      }
    })
    this.setState({legalMoves})
  }


  showDemo = async (line) => {
    function sleep(duration) {
      return new Promise(resolve => setTimeout(resolve, duration));
    }

    let currentPosition = line[0];
    while (currentPosition) {
      this.setState({currentPosition})
      if (currentPosition.previousPosition) {
        this.addPositionToNotation(currentPosition)
      }
      await sleep(this.state.demoDelay);
      currentPosition = currentPosition.nextPosition
    }
  }

  startLine = async () => {
    if (this.state.errorDuringLine && this.state.restartAfterError) {
      this.setState({
        currentPosition: this.state.currentLine[0],
        game: new Game(),
        errorDuringLine: false
      }, this.gameLoop)
    } else if (this.nextLineIndex < this.lines.length) {
      let line = this.lines[this.nextLineIndex];
      this.nextLineIndex++;
      this.setState({
        currentPosition: line[0],
        currentLine: line,
        currentLineIndex: this.nextLineIndex,
        game: new Game(),
        errorDuringLine: false
      }, async () => {
        if (this.state.showDemo) {
          await this.showDemo(line)
          this.setState({currentPosition: line[0], game: new Game()}, this.gameLoop)
        } else {
          this.gameLoop()
        }
      })
    } else {
      const restart = () => {
        this.nextLineIndex = 0;
        this.setState({currentLineIndex: 1}, this.startLine)
      }
      showModal(<EndTrainingModal history={this.props.history} onRestart={restart}/>)
    }
  }

  gameLoop = () => {
    let currentPosition = this.state.currentPosition;
    if (!currentPosition.nextPosition) {
      setTimeout(this.startLine, 1000)
    } else if (currentPosition.sideToMove() !== this.state.playerColor) {
      setTimeout(() => {
        this.setState({
          currentPosition: currentPosition.nextPosition
        })
        this.addPositionToNotation(currentPosition.nextPosition);
        currentPosition = this.state.currentPosition;
        if (!currentPosition.nextPosition) {
          setTimeout(this.startLine, 1000)
        }
      }, 300)
    }
  }

  addPositionToNotation = (position) => {
    let gamePos = this.state.game.startingPosition;
    while (gamePos.nextPosition) {
      gamePos = gamePos.nextPosition;
    }
    let clone = _.cloneDeep(position);
    gamePos.nextPosition = clone;
    clone.previousPosition = gamePos;
    clone.nextPosition = null;
    this.setState({
      game: this.state.game
    })
  }

  // onDragStart = (source, piece, position, orientation) => {
  //   if (this.state.demoRunning) {
  //     return false;
  //   }
  //   const isWhitePiece = piece.startsWith("w");
  //   this.chess.load(this.state.currentPosition.fen);
  //   let sideToMove = this.chess.turn() === "w" ? WHITE : BLACK;
  //   console.log(sideToMove, isWhitePiece, this.state.playerColor, this.chess.turn(), piece)
  //   if (sideToMove !== this.state.playerColor) {
  //     return false;
  //   }
  //   if (isWhitePiece && sideToMove === BLACK) {
  //     return false;
  //   }
  //   if (!isWhitePiece && sideToMove === WHITE) {
  //     return false;
  //   }
  // };

  onMove = (source, target) => {
    const currentPosition = this.state.currentPosition;
    this.chess.load(currentPosition.fen);
    let move = this.chess.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    if (!move) {
      console.error("Error illegal move")
    }
    if (!currentPosition.nextPosition) {
      console.error("Error no next position")
    }
    if (currentPosition.nextPosition.lastMove.san !== move.san) {
      //WRONG MOVE
      this.flashBoard(false);
      this.setState({errorDuringLine: true})
    } else {
      //GOOD MOVE
        this.setState({
          currentPosition: currentPosition.nextPosition,
        })
        this.flashBoard(true);
        this.addPositionToNotation(currentPosition.nextPosition)
      this.gameLoop()
    }
  }
  // onDrop = (source, target) => {
  //   const currentPosition = this.state.currentPosition;
  //   this.chess.load(currentPosition.fen);
  //   let move = this.chess.move({
  //     from: source,
  //     to: target,
  //     promotion: 'q' // NOTE: always promote to a queen for example simplicity
  //   });
  //   if (!move) {
  //     return 'snapback';
  //   }
  //   if (!currentPosition.nextPosition) {
  //     console.error("No next position")
  //     return 'snapback';
  //   }
  //   if (currentPosition.nextPosition.lastMove.san !== move.san) {
  //     this.flashBoard(false);
  //     this.setState({errorDuringLine: true})
  //     return 'snapback';
  //   }
  // };
  //
  // onSnapEnd = () => {
  //   const currentPosition = this.state.currentPosition;
  //   if (currentPosition.nextPosition) {
  //     this.setState({
  //       currentPosition: currentPosition.nextPosition,
  //     })
  //     this.flashBoard(true);
  //     this.addPositionToNotation(currentPosition.nextPosition)
  //   }
  //   this.gameLoop()
  // }

  flashBoard = (goodMove) => {
    let className = goodMove ? "rightMove" : "wrongMove";
    this.setState({
      boardClass: className
    })
    setTimeout(() => this.setState({boardClass: ""}), 500)
  }

  render() {
    return (
      <>
        {this.state.currentPosition ?
          <div className="container" onKeyDown={this.onKeyDown} tabIndex="0">
            <div className="columns">
              <div className="column">
                <div>
                  {/*<ChessboardWrapper*/}
                  {/*  className={this.state.boardClass}*/}
                  {/*  onDragStart={this.onDragStart}*/}
                  {/*  onDrop={this.onDrop}*/}
                  {/*  onSnapEnd={this.onSnapEnd}*/}
                  {/*  position={this.state.currentPosition.fen}*/}
                  {/*  orientation={this.state.playerColor === WHITE ? "white" : "black"}/>*/}
                  <ChessgroundWrapper
                    className={this.state.boardClass}
                    orientation={this.state.playerColor === WHITE ? "white" : "black"}
                    movableColor={this.state.playerColor === WHITE ? "white" : "black"}
                    onMove={this.onMove}
                    legalMoves={this.state.legalMoves}
                    viewOnly={this.state.demoRunning}
                    position={this.state.currentPosition.fen}
                  />
                </div>
              </div>
              <div className="column notation-column">
                <div>Ligne {this.state.currentLineIndex} / {this.state.totalLineCount}</div>
                <NotationView game={this.state.game}
                              handleClick={this.setPosition}
                              currentPosition={this.state.currentPosition}
                              makeMove={this.makeMove}
                              onContextualAction={this.handleContextualActionOnNotation}/>
              </div>
            </div>
          </div>
          : <div>loading</div>}
      </>
    )
  }
}
