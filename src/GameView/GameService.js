import ApiService from "../services/ApiService";
import Game from "../models/Game";
import Position from "../models/Position";

class GameToDto {
  constructor() {
    this.counter = 0;
  }

  gameToDto = (game) => {
    const dto = {};
    dto.blackName = game.blackName;
    dto.whiteName = game.whiteName;
    dto.positions = [];
    if (game.id && game.id >= 0) {
      dto.id = game.id;
    }
    this.visitPosition(game.startingPosition, dto);
    return dto;
  }

  visitPosition = (position, gameDto) => {
    const dto = {};
    dto.positionIndex = this.counter;
    this.counter++;
    dto.commentAfter = position.comment;
    dto.fen = position.fen;
    dto.lastMoveSan = position.lastMove ? position.lastMove.san : "";
    if (position.nextPosition) {
      let nextDto = this.visitPosition(position.nextPosition, gameDto);
      dto.nextPosition = nextDto.positionIndex;
    }
    let sublines = [];
    for (let variation of position.sublines) {
      let variationDto = this.visitPosition(variation, gameDto);
      sublines.push(variationDto.positionIndex);
    }
    if (sublines.length === 0) {
      dto.sublines = "";
    } else {
      dto.sublines = sublines.join(";");
    }
    gameDto.positions.push(dto);
    return dto;
  }
}

class DtoToGame {
  dtoToGame(dto) {
    let game = new Game();
    game.whiteName = dto.whiteName;
    game.blackName = dto.blackName;
    game.id = dto.id;
    if (dto.positions.length > 0) {
      let positions = [];
      for (let p of dto.positions) {
        positions[p.positionIndex] = p;
      }
      game.startingPosition = this.parsePosition(positions, 0);
    }
    return game;
  }

  parsePosition(positionsArray, index, previousPosition) {
    let dto = positionsArray[index];
    let move = index > 0 ? this.parseMove(dto) : undefined;
    let position = new Position(dto.fen, move, previousPosition);
    position.comment = dto.commentAfter;
    if (dto.nextPosition > 0) {
      let nextPos = this.parsePosition(positionsArray, dto.nextPosition, position);
      position.nextPosition = nextPos;
    }
    if (dto.sublines.length > 0) {
      for (let i of dto.sublines.split(";")) {
        let nextPos = this.parsePosition(positionsArray, parseInt(i), position);
        position.sublines.push(nextPos);
      }
    }
    return position;
  }

  parseMove(positionDto) {
    let san = positionDto.lastMoveSan;
    const nextColor = positionDto.fen.split(' ')[1];
    let color = nextColor === "b" ? "w" : "b";
    return {san, color}
  }
}

const fetchGame = (id) => {
  return ApiService.get("/game/" + id).then(res => {
    if (res.status === 200) {
      const game = new DtoToGame().dtoToGame(res.data);
      console.log(game)
      return game;
    } else {
      throw res
    }
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

const saveGame = (game) => {
  let dto = new GameToDto().gameToDto(game);
  console.log(dto)
  return ApiService.post("/game/" + game.id, dto).then(res => {
    if (res.status !== 200) {
      throw res;
    }
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

export default {
  fetchGame,
  saveGame
}
