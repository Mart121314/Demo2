//#region
import { log } from "console";
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout
});
//#endregion

const MOVE_LEFT = "a";
const MOVE_RIGHT = "d";
const MOVE_UP = "w";
const MOVE_DOWN = "s";
const GAME_WIDTH = 20;
const GAME_HEIGHT = 20;
const EMPTY = " ";
const PLAYER = "@";
let  playerPos = pickStartPos(GAME_HEIGHT, GAME_WIDTH);
let level = makeLevel(GAME_HEIGHT,GAME_WIDTH);
let isPlaying = true


// Starting the game loop
while(isPlaying){

  console.clear();
  draw(level,playerPos, PLAYER);
  console.log("Move w/a/s/d");
  const move = await getMove();
  isPlaying = update(level,playerPos, move);

}

process.exit();
// End of game







// ----------------------------------------------------------------------------------

function update(level,playerPos, move){

  // First we find the value of the position the player wants to move into.
  let nRow = playerPos.row + move.v;
  let nCol = playerPos.col + move.h;
  let value = level[nRow][nCol];

  // Now we must figure out if that is a valid move.
  // * The move must not move the player beyond the bounds of the level.
  // * The move must not have the player cross a location that they have allready been.
  let canMove = false;

  if(value === EMPTY){
    // The player tied to move directly into an empty cell. That is not allowed.
    return false;
  }

  if(move.v != 0){

    // VERTICAL MOVEMENT

    let bounds;

    // First I test that the move keeps me in bounds
    let isInBounds = false;
    if(move.v < 0){
      if(nRow - value - 1 >= 0){
        isInBounds = true;
        bounds = nRow - value -1;
      }
    } else if( move.v > 0 ){
      if(nRow + value + 1 < level.length){
        isInBounds = true;
        bounds = nRow + value +1 ;
      }
    }

    // If the move keeps us in bounds we can now check that there are no EMPTY (visited) spaces in the move
    if(isInBounds){
      let cells = [];
      // Now we can iterate through the rows 
      for (let row = nRow; row != bounds ; row += move.v ) {
        cells.push(level[row][playerPos.col])
      }
      // All celles that the player will move through is now in the cells array. 
      // If there is an EMPTY value in the list, the move is not valid. 
      if(cells.indexOf(EMPTY) === -1){
        canMove = true;
      }
    }

  } else if(move.h != 0){

    let bounds;
    let isInBounds = false;
    // TODO: Implement vertical movement
    // TIP: This is similar to vertical movment with the exception of the direction of movement. 
    if(move.h > 0 ){
      
    } else if (move.h < 0){
      
    }

    if(isInBounds){
      
    }

  }
  else{
    console.error("Move was not a correct value");
  }
  
  // Finaly if the move can be done we update the level 
  if(canMove){   
    do{
      level[playerPos.row][playerPos.col] = EMPTY
      if(move.v != 0){
        playerPos.row += move.v;
      } 
      value --;
    }while(value > 0)

  } 

  return canMove;
}

async function getMove(){
  
  // Get valid move from the user.
  let input = ""
  do{
    input = await rl.question("");
  }while(isUserInputValid(input) === false);

  // Transform the user input into a movment in horizontal(h) or vertical(v) directions
  let move = { h:0, v:0};
  
  if(input === MOVE_LEFT){
    move.h = -1;
  } else if(input === MOVE_RIGHT){
    move.h = 1;
  } else if(input === MOVE_UP){
    move.v = -1;
  } else if(input === MOVE_DOWN){
    move.v = 1;
  }

  return move;
}

function isUserInputValid(input){
  // The valid inputs are put into ann array. 
  // Then we see if the users input is to be found in that array. 
  // If it is not there we wil get the value -1 and the logic -1 != -1 will return false (because -1 is not diffrent from -1)
  return [MOVE_LEFT,MOVE_RIGHT,MOVE_DOWN,MOVE_UP].indexOf(input.toLowerCase()) != -1
}

function pickStartPos(rows, columns){
  const row = Math.round(Math.random() * (rows-1));
  const col = Math.round(Math.random() * (columns-1));
  return {row,col};
}

function draw(level,playerPos,playerSymbole){
  // Our level is just lines of text, but wee need to output it 1 line at a time to get the effect we want.
  let drawing = ""
  for(let row = 0; row < level.length; row++){
    
    const rowData = level[row];
    let rowDrawing = "";

    for(let column = 0; column < rowData.length; column ++){
      if(row == playerPos.row && column == playerPos.col ){
        // Draw the player symbole with a colord backgrund.
        rowDrawing = rowDrawing + colorBackground(playerSymbole,2);
      } else{
        // Draw number or empty cell
        rowDrawing = rowDrawing + colorize(rowData[column]);
      } 
    }

    // Add a line to the drawing. 
    drawing = drawing + rowDrawing + "\n";

  }

  // Display the drawing
  console.log(drawing);
}

function colorBackground(symbole, color){
  return `\x1b[4${color}m${symbole}\x1b[0m`;
}

function colorize(num){
  return `\x1b[3${num}m${num}\x1b[0m`;
}

function makeLevel(height,width){
  const level = [];
  const rows = height;
  const columns = width;
  
  for(let i = 0; i < rows; i++){
    level.push(makeRow(columns))
  }

  return level;
}

function makeRow(columns){
  let row = [];
  for(let i = 0; i < columns; i++){
    row.push(newLevelNumber())
  }
  return row;
}

function newLevelNumber(){
  return Math.ceil(Math.random() * 9)
}

