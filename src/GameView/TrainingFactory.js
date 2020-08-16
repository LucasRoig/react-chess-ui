import _ from "lodash"
export default class TrainingFactory {
  lines = []
  color = null

  createTraining(game, color) {
    this.lines = [];
    this.color = color;
    let g = _.cloneDeep(game);
    this.parseLine(g.startingPosition);
    return this.lines;
  }

  parseLine(position, previousPositions = []) {
    let currentLine = previousPositions;
    let currentPosition = position;
    while (currentPosition) {
      currentLine.push(currentPosition);
      if (currentPosition.sublines.length > 0 && currentPosition.sideToMove() !== this.color) {
        for (let p of currentPosition.sublines) {
          this.parseLine(_.cloneDeep(p), _.cloneDeep(currentLine));
        }
      }
      currentPosition = currentPosition.nextPosition;
    }
    for (let i = 0; i < currentLine.length - 1; i++) {
      currentLine[i].nextPosition = currentLine[i+1];
      currentLine[i].sublines = [];
      currentLine[i+1].previousPosition = currentLine[i];
      currentLine[i+1].sublines = [];
    }
    this.lines.push(currentLine);
  }
}
