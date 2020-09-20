import React from "react"
import Chessground from "react-chessground"
import "react-chessground/dist/styles/chessground.css"
import "./Chessground.scss"
class ChessgroundWrapper extends React.Component {
    static defaultProps = {
        movableColor: "both",
        orientation: "white",
        lastMove: [],
        viewOnly: false
    }
    turnColor = () => {
        if (this.props.position) {
            const split = this.props.position.split(" ");
            if (split.length > 1 && split[1] === "b") {
                return "black"
            }
        }
        return "white"
    }
    render() {
        return (
            <div className={this.props.className}>
            {/*Setting height to 0 and padding to 100% allows us to keep a 1:1 ratio*/}
            <Chessground width="100%" style={{height: 0, paddingBottom:"100%"}} className={this.props.className}
                         fen={this.props.position}
                         orientation={this.props.orientation}
                         movable={{free: false, dests: this.props.legalMoves, color: this.props.movableColor}}
                         premovable={{enabled: false}}
                         lastMove={this.props.lastMove}
                         onMove={this.props.onMove}
                         turnColor={this.turnColor()}
                         viewOnly={this.props.viewOnly}/>
            </div>
        )
    }
}

export default ChessgroundWrapper;