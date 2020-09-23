import React from "react";
import {Component} from "react";
import { NotationModel } from "./NotationModel";
import Toolbar from  "./Toolbar"
import "./Notation.scss"
import ScrollManager from "./ScrollManager"

export default class NotationView extends Component {

    render(){
        let notationModel = new NotationModel(this.props.game, this.props.handleClick, this.props.currentPosition, this.props.onContextualAction);
        return (
            <div className="card game-details-panel">
                <header className="card-header game-header">
                    <p className="card-header-title">
                        {this.props.game.whiteName} - {this.props.game.blackName}
                    </p>
                </header>
                <div className="card-content notation-wrapper">
                    {notationModel.render()}
                </div>
                <Toolbar currentPosition={this.props.currentPosition} makeMove={this.props.makeMove} game={this.props.game}/>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        ScrollManager.scrollToActiveMove();
    }
}