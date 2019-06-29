import React from "react";
import {Component} from "react";
import "../Toolbar.scss"
import StockfishManager from "../../../engine/StockfishManager";

export default class EngineTool extends Component {
    state = {
        line: []
    };

    render() {
        return (
            <div className="tool-book">
                <div>
                    <div className="title">Stockfish</div>
                    {this.state.line.map(move => (
                        <span>{move.san + " "}
                        </span>
                    ))}
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
            this.startAnalyse();
        }
    }

    componentDidMount() {
        this.startAnalyse();
    }
}