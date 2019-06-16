import React from "react";
import {Component} from "react";
import "../Toolbar.scss"

export default class BookTool extends Component {
    state = {
        moves: []
    };

    render() {
        return (
            <div className="tool-book">
                {this.state.moves.length === 0 &&
                <div>
                    <div className="title">Explorateur d'ouvertures et tables de finales</div>
                    <div>Aucune partie trouvée</div>
                </div>
                }
                {this.state.moves.length > 0 &&
                <table>
                    <thead>
                    <tr>
                        <th>Coup</th>
                        <th>Parties</th>
                        <th>Blancs / Nulle / Noirs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.moves.map(m => (
                        <tr key={m.san}>
                            <td>{m.san}</td>
                            <td>{m.white + m.black + m.draws}</td>
                            <td><ScoreBar white={m.white} black={m.black} draws={m.draws}/></td>
                        </tr>

                    ))}
                    </tbody>
                </table>
                }
            </div>
        )
    }

    fetchData(){
        fetch('https://explorer.lichess.ovh/master?fen=' + this.props.currentPosition.fen)
            .then(r => r.json())
            .then(data => this.setState({ moves: data.moves }));
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchData();
    }
}

const ScoreBar = (props) => {
    let white = props.white;
    let black = props.black;
    let draws = props.draws;
    let total = white + black + draws;
    if (total === 0) {
        return <div/>
    }

    let whitePercentage = parseInt((white / total) * 100);
    let blackPercentage = parseInt((black / total) * 100);
    let drawPercentage = parseInt((draws / total) * 100);

    let styleWhite = {
        width: whitePercentage + "%"
    };
    let styleBlack = {
        width: blackPercentage + "%"
    };
    let styleDraw = {
        width: drawPercentage + "%"
    };
    return (
        <div className="bar">
            {white !== 0 &&
            <span className="white" style={styleWhite}>{whitePercentage}%</span>
            }
            {draws !== 0 &&
            <span className="draws" style={styleDraw}>{drawPercentage}%</span>
            }
            {black !== 0 &&
            <span className="black" style={styleBlack}>{blackPercentage}%</span>
            }
        </div>
    )
};