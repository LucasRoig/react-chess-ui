import React, { Component } from 'react';

class ChessboardWrapper extends Component{
    state={};
    board;
    style = {
        width:"550px"
    };
    render(){
        return (
            <div id="board" style={this.style} className={this.props.className} />
        )
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.position && this.board){
            this.board.position(this.props.position)
        }
    }

    componentDidMount(){
        //console.log(this.props)
        let config = {
          draggable: true,
          position:this.props.position,
          onDragStart: this.props.onDragStart,
          onDrop: this.props.onDrop,
          onSnapEnd: this.props.onSnapEnd,
          orientation: this.props.orientation || "white"
        }

        console.log('yo');
        this.board = window.ChessBoard('board', config);
      }
}

export default ChessboardWrapper
