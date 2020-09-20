import React from "react"
import Chessground from "react-chessground"
import "react-chessground/dist/styles/chessground.css"
import "./Chessground.scss"
class ChessgroundWrapper extends React.Component {
    static defaultProps = {
        movableColor: "both",
        orientation: "white",
        lastMove: []
    }
    render() {
        console.log("render chessground")
        return (
            //Setting height to 0 and padding to 100% allows us to keep a 1:1 ratio
            <Chessground width="100%" style={{height: 0, paddingBottom:"100%"}}
                         fen={this.props.position}
                         orientation={this.props.orientation}
                         movable={{free: false, dests: this.props.legalMoves, color: this.props.movableColor}}
                         premovable={{enabled: false}}
                         lastMove={this.props.lastMove}
                         onMove={this.props.onMove}/>
        )
    }
}

export default ChessgroundWrapper;