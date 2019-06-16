import React from "react";
import {Component} from "react";
import "./Toolbar.scss"
import BookTool from "./Tools/BookTool";

const TOOL_NONE = {
    name: "None"
};

const TOOL_BOOK = {
    name: "Book",
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
                    <BookTool currentPosition={this.props.currentPosition}/>
                </div>
                }
                <a className="card-footer-item" hrefLang="#" onClick={() => this.selectTool(TOOL_BOOK)}>Book</a>
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
}
