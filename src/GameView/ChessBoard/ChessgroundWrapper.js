import React from "react"
import Chessground from "react-chessground"
import "react-chessground/dist/styles/chessground.css"
import "./Chessground.scss"
class ChessgroundWrapper extends React.Component {

    render() {
        return (
            //Setting height to 0 and padding to 100% allows us to keep a 1:1 ratio
            <Chessground width="100%" style={{height: 0, paddingBottom:"100%"}}/>
        )
    }
}

export default ChessgroundWrapper;