import React from "react";
import {Component} from "react";
import "./Toolbar.scss"
import BookTool from "./Tools/BookTool";
import EngineTool from "./Tools/EngineTool"
import ScrollManager from "./ScrollManager";

const TOOL_NONE = {
    name: "None"
};

const TOOL_BOOK = {
    name: "Book",
};
const TOOL_ENGINE = {
    name: "Engine"
};



export default class Toolbar extends Component {

    state = {
        selectedTool: TOOL_NONE
    };

    render() {
        return (
            <footer className="notation-footer">
                {this.state.selectedTool === TOOL_BOOK &&
                <div className="tool">
                    <BookTool currentPosition={this.props.currentPosition} makeMove={this.props.makeMove}/>
                </div>
                }
                {this.state.selectedTool === TOOL_ENGINE &&
                <div className="tool">
                    <EngineTool currentPosition={this.props.currentPosition} makeMove={this.props.makeMove}/>
                </div>
                }
                <a className="card-footer-item" hrefLang="#" onClick={() => this.selectTool(TOOL_BOOK)}>Book</a>
                <a className="card-footer-item" hrefLang="#" onClick={() => this.selectTool(TOOL_ENGINE)}>Stockfish</a>
            </footer>
        )
    }

    selectTool(tool) {
        if (this.state.selectedTool === tool) {
            this.setState({selectedTool: TOOL_NONE});
        } else {
            this.setState({
                selectedTool: tool,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        ScrollManager.scrollToActiveMove();
    }
}
