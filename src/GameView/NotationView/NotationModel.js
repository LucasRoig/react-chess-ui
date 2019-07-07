import * as Constants from "../../models/Constants"
import React from 'react'
import './Notation.scss'
import { ContextMenuTrigger, ContextMenu, MenuItem, connectMenu } from "react-contextmenu";

const MAIN_LINE_MOVE_CONTEXT_MENU_ID = "mainLineMoveContextMenu";

const DynamicMainLineMoveMenu = (props) => {
    const {id, trigger} = props;
    let contextMenuItemAttributes = {
        className: "item"
    };
    let title = "";
    if(trigger){
        title = trigger.position.moveNumber + (trigger.position.sideToMove() === Constants.BLACK ? '.' : '...')+ trigger.san;
    }
    return(
        <ContextMenu id={id} className="context-menu">
            {trigger && <p className="title">{title}</p>}
            {trigger &&
            <MenuItem attributes={contextMenuItemAttributes}>
                Supprimer la suite
            </MenuItem>
            }
            {trigger &&
            <MenuItem attributes={contextMenuItemAttributes}>
                TEST
            </MenuItem>
            }
        </ContextMenu>
    )
};

const MainLineMoveMenu = connectMenu(MAIN_LINE_MOVE_CONTEXT_MENU_ID)(DynamicMainLineMoveMenu);

class NotationMove {
    constructor(san, position, onMoveClicked, currentPosition) {
        this.san = san;
        this.position = position;
        this.handleClick = onMoveClicked;
        this.classes = "move ";
        if(currentPosition === position) this.classes += " active";
        this.classes = {
            className : this.classes
        }
    }

    render() {
        let collect = (props) => {
            return{
                position: props.position,
                san: props.san
            }
        };
        return (
            <ContextMenuTrigger id={MAIN_LINE_MOVE_CONTEXT_MENU_ID}
                                attributes={this.classes}
                                position={this.position}
                                san={this.san}
                                collect={collect}
                                onClick={() => this.handleClick(this.position)}>
               {this.san}
            </ContextMenuTrigger>
        )
    }
}

class NotationIndex {
    constructor(moveNumber) {
        this.moveNumber = moveNumber
    }

    render() {
        return (<div className="move-number">{this.moveNumber}</div>)
    }
}

class NotationEmptyMove {
    render() {
        return <div className="empty-move">...</div>
    }
}

class NotationInlineComment {
    constructor(comment){
        this.comment = comment;
    }

    render() {
        return <div className="comment">{this.comment}</div>
    }
}

class NotationInterrupt {
    constructor(comment, sublines, onMoveClicked, currentPosition) {
        this.comment = comment;
        this.sublines = sublines.map(subline => new NotationSubline(subline, onMoveClicked, currentPosition));
    }

    render() {
        return (
            <div className="interrupt">
                { this.comment && this.comment !== "" &&
                    <div className="comment">
                        {this.comment}
                    </div>
                }
                { this.sublines.length > 0 &&
                    <div className="sublines">
                        {this.sublines.map(line => line.render())}
                    </div>
                }
            </div>)
    }
}

class NotationSubline {
    constructor(position, onMoveClicked, currentPosition) {
        this.moves = [];
        this.sublines = [];
        while (position !== null) {
            let isWhite = position.lastMove.color === Constants.WHITE;
            if (isWhite) {
                this.moves.push(new NotationSublineMove(position.lastMove.san, position.moveNumber + '.', position, onMoveClicked, currentPosition));
            } else if (this.moves.length === 0) {
                this.moves.push(new NotationSublineMove(position.lastMove.san, position.moveNumber + '...', position, onMoveClicked, currentPosition));
            } else {
                this.moves.push(new NotationSublineMove(position.lastMove.san,null, position, onMoveClicked, currentPosition));
            }
            if(position.comment && position.comment !== ""){
                this.moves.push(new NotationInlineComment(position.comment));
            }
            if (position.sublines.length > 0){
                this.sublines.push(new NotationSubline(position.nextPosition, onMoveClicked, currentPosition));
                position.sublines.forEach(subline => this.sublines.push(new NotationSubline(subline, onMoveClicked, currentPosition)));
                break;
            }
            position = position.nextPosition;
        }
    }

    render() {
        return (
            <div className="subline">
                {this.moves.map(move => move.render())}
                {this.sublines.length > 0 &&
                    <div className="sublines">
                        {this.sublines.map(subline => subline.render())}
                    </div>
                }
            </div>
        )
    }
}

class NotationSublineMove {
    constructor(san, moveNumber, position, onMoveClicked, currentPosition) {
        this.san = san;
        this.moveNumber = moveNumber;
        this.position = position;
        this.handleClick = onMoveClicked;
        this.classes = "subline-move ";
        if(currentPosition === position) this.classes += " active";
    }

    render() {
        return (
            <div className={this.classes} onClick={() => this.handleClick(this.position)}>
                {this.moveNumber &&
                <div className="move-number">{this.moveNumber}</div>
                }
                {this.san}
            </div>)
    }
}

export class NotationModel {

    constructor(game, onMoveClicked, currentPosition) {
        this.notation = [];
        let position = game.startingPosition.nextPosition;
        while (position !== null) {
            let isWhite = position.lastMove.color === Constants.WHITE;
            if (isWhite) {
                this.notation.push(new NotationIndex(position.moveNumber))
            }
            this.notation.push(new NotationMove(position.lastMove.san, position, onMoveClicked, currentPosition));
            if ((position.comment && position.comment !== "") || position.previousPosition.sublines.length > 0) {
                if (isWhite) {
                    this.notation.push(new NotationEmptyMove())
                }
                this.notation.push(new NotationInterrupt(position.comment, position.previousPosition.sublines, onMoveClicked, currentPosition));
                if (isWhite) {
                    this.notation.push(new NotationIndex(position.lastMove.san));
                    this.notation.push(new NotationEmptyMove());
                }
            }
            position = position.nextPosition
        }
    }

    render() {
        return (
            <div className="notation">
                {this.notation.map(n => n.render())}
                <MainLineMoveMenu/>
            </div>
        )
    }
}

