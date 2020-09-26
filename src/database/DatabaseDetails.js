import React, {Component} from 'react';
import './DatabaseList.scss';
import DatabaseService from "./DatabaseService";
import {DbDetails} from "./DbDetails";
import GameService from "../GameView/GameService";
import {showConfirmationModal} from "../components/modal/ConfirmationModal";

const GameDetails = (props) => {
  function handleTraining(e) {
    e.stopPropagation();
    props.history.push("/training/" + props.game.id);
  }
  function handleDelete(e) {
    props.onDelete(props.game);
    e.stopPropagation();
  }
  return (
    <tr onClick={props.onClick}>
      <td>{props.game.whiteName}</td>
      <td>{props.game.blackName}</td>
      <td></td>
      <td>
        <button className="button" onClick={handleTraining}>Training</button>
        <button className="button is-danger" onClick={handleDelete}>Supprimer</button>
      </td>
    </tr>
  )
}

class DatabaseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: null,
      selectedPgn: null
    }
  }

  componentDidMount() {
    DatabaseService.getDetails(this.props.match.params.id).then(database => {
      console.log(database)
      this.setState({database})
    })
  }

  createGame = () => {
    DatabaseService.createGame(this.state.database.id).then(game => {
      let db = this.state.database;
      this.setState({
        database: DbDetails.update(db, {gameHeaders: {$push: [game]}})
      })
    });
  }

  deleteGame = (game) => {
    let properties = {
      title: "Suppression de la partie " + game.whiteName + " - " + game.blackName,
      message: "Êtes vous sûr de vouloir supprimer la partie " + game.whiteName + " - " + game.blackName,
      confirmButtonText: "Supprimer",
      confirmButtonClass: "is-danger",
      onConfirm: () => {
        GameService.deleteGame(game).then(res => {
          if (res) {
            let db = this.state.database;
            let i = db.gameHeaders.indexOf(game);
            if (i >= 0) {
              this.setState({
                database: DbDetails.update(db, {gameHeaders: {$splice: [[i,1]]}})
              })
            }
          }
        })
      }
    }
    showConfirmationModal(properties)

  }

  onFileChanged = (e) => {
    this.setState({selectedPgn: e.target.files[0]})
  }

  uploadPgn = () => {
    const selectedPgn = this.state.selectedPgn;
    if (selectedPgn) {
      DatabaseService.importPgn(this.state.database.id, selectedPgn).then(g => {
        let db = this.state.database;
        this.setState({
          database: DbDetails.update(db, {gameHeaders: {$push: [g]}})
        })
      });
    }
  }

  render() {
    return (
      <>
        {this.state.database ?
          <>
            <h1 className="title is-1">{this.state.database.name}</h1>
            <div>
              <button className="button" onClick={this.createGame}>Add new Game</button>
            </div>
            <div>
              <input type="file" onChange={this.onFileChanged}/>
              <button className="button" onClick={this.uploadPgn}>Importer</button>
            </div>
            <table className="databases table is-striped is-hoverable is-fullwidth">
              <thead>
              <tr>
                <th>White</th>
                <th>Black</th>
                <th></th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {this.state.database.gameHeaders.map(game =>
                <GameDetails key={game.id} game={game}
                             onClick={() => this.props.history.push("/game/" + game.id)}
                             onDelete={this.deleteGame}
                             history={this.props.history}/>)
              }
              </tbody>
            </table>
          </>
          : <div>Loading</div>}
      </>
    )
  }
}

export default DatabaseDetails;
