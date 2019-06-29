import React from "react";
import {Component} from "react";
import "../Toolbar.scss"
import StockfishManager from "../../../engine/StockfishManager";
import MoveUtils from "../../../utils/MoveUtils";

export default class EngineTool extends Component {
    state = {
        line: []
    };

    render() {
        return (
            <div className="tool-book">
                <div>
                    <div className="title">Stockfish</div>
                    {MoveUtils.moveListToString(this.state.line,this.props.currentPosition)}
                </div>
            </div>
        )
    }

    onEngineInfo = (data) => {
        console.log(data);
        this.setState({line:data})
    };

    startAnalyse = () => {
        StockfishManager.analysePosition(this.props.currentPosition.fen, this.onEngineInfo);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.currentPosition.fen !== this.props.currentPosition.fen){
            this.setState({line:[]})
            this.startAnalyse();
        }
    }

    componentDidMount() {
        this.startAnalyse();
    }
}