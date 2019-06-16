import React from "react";
import {Component} from "react";
import "../Toolbar.scss"

export default class BookTool extends Component {
    render() {
        return (
            <div className="tool-book">
                {this.props.currentPosition.fen}
                <table>
                    <thead>
                    <tr>
                    <th>Coup</th>
                    <th>Parties</th>
                    <th>Blancs / Nulle / Noirs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {moves.map(m => (
                        <tr key={m.san}>
                            <td>{m.san}</td>
                            <td>{m.white + m.black + m.draws}</td>
                            <td><ScoreBar white={m.white} black={m.black} draws={m.draws}/></td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

const ScoreBar = (props) => {
    let white = props.white;
    let black = props.black;
    let draws = props.draws;
    let total = white + black + draws;
    if(total === 0){
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
    let styleDraw= {
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


const moves = [{
    "uci": "c2c4",
    "san": "c4",
    "white": 49932,
    "draws": 71946,
    "black": 28447,
    "averageRating": 2427
}, {
    "uci": "g1f3",
    "san": "Nf3",
    "white": 11216,
    "draws": 15700,
    "black": 8215,
    "averageRating": 2389
}, {
    "uci": "c1f4",
    "san": "Bf4",
    "white": 1217,
    "draws": 1325,
    "black": 811,
    "averageRating": 2400
}, {
    "uci": "c1g5",
    "san": "Bg5",
    "white": 855,
    "draws": 947,
    "black": 654,
    "averageRating": 2386
}, {
    "uci": "b1c3",
    "san": "Nc3",
    "white": 490,
    "draws": 555,
    "black": 499,
    "averageRating": 2359
}, {
    "uci": "e2e3",
    "san": "e3",
    "white": 93,
    "draws": 133,
    "black": 108,
    "averageRating": 2341
}, {
    "uci": "g2g3",
    "san": "g3",
    "white": 97,
    "draws": 130,
    "black": 77,
    "averageRating": 2350
}, {
    "uci": "c2c3",
    "san": "c3",
    "white": 62,
    "draws": 84,
    "black": 71,
    "averageRating": 2361
}, {
    "uci": "e2e4",
    "san": "e4",
    "white": 50,
    "draws": 57,
    "black": 80,
    "averageRating": 2329
}, {
    "uci": "a2a3",
    "san": "a3",
    "white": 19,
    "draws": 31,
    "black": 11,
    "averageRating": 2350
}, {
    "uci": "f2f4",
    "san": "f4",
    "white": 5,
    "draws": 5,
    "black": 8,
    "averageRating": 2332
}, {
    "uci": "b1d2",
    "san": "Nd2",
    "white": 5,
    "draws": 4,
    "black": 4,
    "averageRating": 2353
}
];