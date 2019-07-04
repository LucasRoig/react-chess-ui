import React from "react";
import {Component} from "react";
import "../Toolbar.scss"
import "./EngineTool.scss"
import StockfishManager from "../../../engine/StockfishManager";
import MoveUtils from "../../../utils/MoveUtils";

let EngineLines = (props) => {
    return (
        <div>
        {props.lines.map(line => {
                if (line.score){
                    return <EngineLine line={line.line} score={line.score} currentPosition={props.currentPosition}/>
                }else{
                    return ''
                }
            })}
        </div>
    )
};

let EngineLine = (props) => {
    let score;
    if(props.score > 0){
        score = '+' + props.score;
    }else{
        score = '-' + (-1 * props.score);
    }
    return(

        <div className="engine-line">
            <strong className="score">{score}</strong>
            <span className="line-text">{MoveUtils.moveListToString(props.line,props.currentPosition)}</span>
        </div>
    )
};
export default class EngineTool extends Component {
    state = {
        engineState: null,
    };

    render() {
        let engineState = this.state.engineState;
        if(engineState){
            return (
                <div className="tool-engine">
                    <div>
                        <div className="title">{engineState.name} depth {engineState.depth}/{engineState.selDepth}</div>
                        <div>
                        <EngineLines lines={engineState.lines} currentPosition={this.props.currentPosition}/>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="tool-book">
                <div>
                    <div className="title">Stockfish</div>
                </div>
            </div>
        )
    }

    onEngineInfo = (engineState) => {
        console.log(engineState);
        this.setState({engineState})
    };

    startAnalyse = () => {
        StockfishManager.analysePosition(this.props.currentPosition.fen, this.onEngineInfo);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.currentPosition.fen !== this.props.currentPosition.fen){
            this.setState({engineState: null});
            this.startAnalyse();
        }
    }

    componentDidMount() {
        this.startAnalyse();
    }
}