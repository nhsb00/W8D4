// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let newArray = Array(8).fill("").map(x => Array(8));
  newArray[3][4] = new Piece("black");
  newArray[4][3] = new Piece("black");
  newArray[3][3] = new Piece("white");
  newArray[4][4] = new Piece("white");

  return newArray;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function(pos) {
  if ((pos[0] >= 0 && pos[0] < 8) && (pos[1] >= 0 && pos[1] < 8)) {
    return true; 
  } else {
    return false
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error('Not valid pos!');
  } else {
    return this.grid[pos[0]][pos[1]] ; 
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  if (piece === undefined){
    return false;
  }
  return (piece.color === color)? true : false;
  
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return (this.grid[pos[0]][pos[1]] === undefined ) ? false : true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  if (!piecesToFlip) {
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos);
  };
  // if (!this.isValidPos(pos)) {
  //   return [];
  // }

  let nextPos = [pos[0]+dir[0], pos[1]+dir[1]];

  if (!this.isValidPos(nextPos)){
      return [];
  } else if (!this.isOccupied(nextPos)){
      return [];
  } else if (this.isMine(nextPos, color)){
      return (piecesToFlip === undefined) ? [] : piecesToFlip;
  } else {
      return this._positionsToFlip(nextPos, color, dir, piecesToFlip);
  };
// else if (this.DIRS.includes(dir)) {
//     return [];
//   } 
  // };
  //   if ((this.getPiece(nextPos)) && (this.getPiece(nextPos).color != color)){
  //   piecesToFlip.push(nextPos);
  //   return this._positionsToFlip(nextPos. color, dir, piecesToFlip);
  // } else {
  //   return piecesToFlip;
  // };
    
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  } else if (!this.isValidPos(pos)) {
    return false;
  } 

  let dirs = Board.DIRS;
  for (let i = 0; i < dirs.length; i++) { 
    let possibleDir = (this._positionsToFlip(pos, color, dirs[i]));
    if (possibleDir.length > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) { 

  if (this.validMove(pos,color)) {
    this.grid[pos[0]][pos[1]] = new Piece(color)
    // changing the subsequent pieces colors
    for (let i = 0; i < Board.DIRS.length; i++) { 
      let possibleMoves = (this._positionsToFlip(pos, color, Board.DIRS[i]));

      for (let i = 0; i < possibleMoves.length; i++) {
        let piece = this.getPiece(possibleMoves[i]);
        piece.flip();
      }
    }
  } else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let answer = [];

  for (let i = 0; i < 8; i++) { 
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i,j], color)) {
        answer.push([i,j]);
      }
    }
  }
  return answer;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {

  return (this.validMoves(color).length > 0);
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {

  if (!this.hasMove("black") && !this.hasMove("white")) {
    return true;
  }
return false;
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  print(this.grid.toString)

};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE