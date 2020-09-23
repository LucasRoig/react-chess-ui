import React, {Component} from "react";

export default class StatsTool extends Component {
    constructor(props) {
        super(props);
    }
    nbOfPositions = () => {
        function nbOfpos(position) {
            let n = 1;
            if (position.nextPosition) {
                n += nbOfpos(position.nextPosition)
            }
            n += position.sublines.map(line => nbOfpos(line)).reduce((a,b) => a +b, 0);
            return n;
        }
        return nbOfpos(this.props.game.startingPosition);
    }
    nbOfLines = () => {
        function nbOfLines(position) {
            let n = 1;
            if (position.nextPosition) {
                n += nbOfLines(position.nextPosition) - 1;
            }
            n += position.sublines.map(line => nbOfLines(line)).reduce((a,b) => a +b, 0)
            return n;
        }
        return nbOfLines(this.props.game.startingPosition);
    }
    render() {
        return(
        <div className="stats-tool">
            <div className="title">STATS</div>
            <p>Nombre de positions : {this.nbOfPositions()}</p>
            <p>Nombre de lignes : {this.nbOfLines()}</p>
        </div>
        )
    }
}