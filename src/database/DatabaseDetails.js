import React, { Component } from 'react';
import './DatabaseList.scss';
import DatabaseRepository from '../repositories/DatabaseRepository'

const DatabaseItem = (props) => (
    <tr onClick={props.onClick}>
        <td>{props.game.whiteName}</td>
        <td>{props.game.blackName}</td>
        <td></td>
        <td></td>
    </tr>
)

class DatabaseDetails extends Component {
    render() {
        let database = DatabaseRepository.find(this.props.match.params.id);
        return (
            <table className="databases table is-striped is-hoverable is-fullwidth" >
                <thead>
                    <th>White</th>
                    <th>Black</th>
                    <th></th>
                    <th></th>
                </thead>
                <tbody>
                    {database.games.map(game => <DatabaseItem game={game} onClick={() => this.props.history.push('/database/' + database.id)}/>)}
                </tbody>
            </table>
        )
    }
}

export default DatabaseDetails;