import React from "react";
import {Component} from "react";
import "./Notation.scss"

export default class Toolbar extends Component {

    render(){
        // let notationModel = new NotationModel(this.props.game, this.props.handleClick, this.props.currentPosition);
        return (
            <footer className="card-footer">
                <button className="card-footer-item">bliblu</button>
                <button className="card-footer-item">blublu</button>
            </footer>
        )
    }
}