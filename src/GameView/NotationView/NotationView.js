import React from "react";
import {Component} from "react";
import { NotationModel } from "./NotationModel";
import "./Notation.scss"

export default class NotationView extends Component {

    render(){
        let notationModel = new NotationModel(this.props.game, this.props.handleClick, this.props.currentPosition);
        return (
            <div className="card">
                <div className="card-content notation">
                    {notationModel.render()}
                </div>
            </div>
        )
    }
}