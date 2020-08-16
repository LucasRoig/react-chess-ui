import React, {Component, useState} from 'react';
import './DatabaseList.scss';
import DatabaseService from "./DatabaseService";
import {showConfirmationModal} from "../components/modal/ConfirmationModal";


const DatabaseItem = (props) => {
  function del(e) {
    e.stopPropagation();
    let properties = {
      title: "Suppression de la base " + props.database.name,
      message: "Êtes vous sûr de vouloir supprimer la base " + props.database.name,
      confirmButtonText: "Supprimer",
      confirmButtonClass: "is-danger",
      onConfirm: () => {
        const databaseId = props.database.id;
        DatabaseService.deleteDatabase(databaseId).then(res => {
          if (res) {
            props.onDelete(databaseId)
          }
        })
      }
    }
    showConfirmationModal(properties)
  }

  return (
    <tr onClick={props.onClick}>
      <td>{props.database.name}</td>
      <td>{props.database.gameHeaders.length}</td>
      <td></td>
      <td>
        <button className="button is-danger" onClick={del}>Supprimer</button>
      </td>
    </tr>
  )
}

const CreateDatabaseForm = (props) => {
  const [name, setName] = useState("");
  function createDatabase() {
    if (name.length === 0) {
      return;
    }
    DatabaseService.postDatabase({name}).then(database => {
      props.onDatabaseCreated(database)
    })
  }
  return (
    <div className="field has-addons">
      <div className="control">
        <input className="input" type="text" placeholder="Créer une base" value={name}
               onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="control" >
        <span className="button is-success" onClick={createDatabase} disabled={name.length === 0}>
          Valider
        </span>
      </div>
    </div>
  )
}

class DatabaseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      databases: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    DatabaseService.listDatabases().then(databases => {
      this.setState({
        databases
      })
    });
  }

  onDatabaseCreated = (database) => {
      let db = this.state.databases;
      db.push(database);
      this.setState({
        databases: db
      })
  }

  onDatabaseDeleted = (databaseId) => {
    let db = this.state.databases;
    db = db.filter(i => i.id !== databaseId);
    this.setState({
      databases: db
    });
  }

  render() {
    return (
      <div>
        <CreateDatabaseForm onDatabaseCreated={this.onDatabaseCreated}/>
        <table className="databases table is-striped is-hoverable is-fullwidth">
          <thead>
          <tr>
            <th>Nom</th>
            <th>Nombre de parties</th>
            <th>Types</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.state.databases && this.state.databases.map(database =>
            <DatabaseItem database={database} key={database.id} onDelete={this.onDatabaseDeleted}
                          onClick={() => this.props.history.push('/database/' + database.id)}/>)
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default DatabaseList;
