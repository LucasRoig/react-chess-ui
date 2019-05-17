import React, { Component } from 'react';
import './DatabaseList.scss';
import DatabaseRepository from '../repositories/DatabaseRepository'

const DatabaseItem = (props) => (
    <tr onClick={props.onClick}>
        <td>{props.database.name}</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
)

class DatabaseList extends Component {
    render() {
        let databases = DatabaseRepository.findAll();
        return (
            <table className="databases table is-striped is-hoverable is-fullwidth" >
                <thead>
                    <th>Nom</th>
                    <th>Nombre de parties</th>
                    <th>Types</th>
                    <th></th>
                </thead>
                <tbody>
                    {databases.map(database => <DatabaseItem database={database} onClick={() => this.props.history.push('/database/' + database.id)}/>)}
                </tbody>
            </table>
        )
    }
}

export default DatabaseList;