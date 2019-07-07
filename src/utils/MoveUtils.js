import * as Constants from '../models/Constants'
export default {
    moveListToString : (moveList, initialPosition) => {
        let result = "";
        let moveCount = initialPosition.sideToMove() === Constants.WHITE ? initialPosition.moveNumber + 1 : initialPosition.moveNumber;
        moveList.forEach((move,index) => {
            if(index === 0){
                result += move.color === 'w' ? moveCount + "." : moveCount + "..."
            }else if(move.color === 'w'){
                result += moveCount + "."
            }
            result += move.san + " ";
            if(move.color === "b"){
                moveCount++;
            }
        });
        // console.log(result);
        return result;
    }
};