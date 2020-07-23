//Dice returns random number 1-6
function rollDice(){
  return Math.floor(Math.random() * 6) + 1
}

//test Game Function
function testGame(){
  var numberOfPlayers = 3;
  SnakesAndLadders(numberOfPlayers);
}

//Snakes and Ladders Game
function SnakesAndLadders(numberOfPlayers){
  var turnsTaken = 0;
  var Players = Array.apply(null, Array(numberOfPlayers)).map((x) => 0 )
  Logger.log(Players);
  
  //Game Loop
  var gameWon = false;
  while(!gameWon){
    //Increment turns taken
    turnsTaken++;
    //Simulate each Player
    for(var player = 0;player<Players.length;player++){
      //Roll Dice
      var diceValue = rollDice();
      Logger.log("Player: "+(player+1)+" Rolls: "+diceValue);
      Players[player]+= diceValue;
      //Render new position Prior to Applying Snake/Ladder
      RenderSnakesAndLadders(Players);
      //Check for Snake/Ladder - for players current position
      var ladder = false;
      switch(Players[player]){
        //Ladders
        case 1:
          Players[player] = 38;
          ladder = true;
          break;
        case 4:
          Players[player] = 14;
          ladder = true;
          break;
        case 8:
          Players[player] = 30;
          ladder = true;
          break;
        case 21:
          Players[player] = 42;
          ladder = true;
          break;
        case 28:
          Players[player] = 76;
          ladder = true;
          break;
        case 50:
          Players[player] = 67;
          ladder = true;
          break;
        case 71:
          Players[player] = 92;
          ladder = true;
          break;
        case 80:
          Players[player] = 99;
          ladder = true;
          break;
      }
      if(ladder){
        Logger.log("This hill is no match for me");
      }
      var snake = false;
      switch(Players[player]){
        //Snakes
        case 32:
          Players[player] = 10;
          snake = true;
          break;
        case 36:
          Players[player] = 6;
          snake = true;
          break;
        case 48:
          Players[player] = 26;
          snake = true;
          break;
        case 62:
          Players[player] = 18;
          snake = true;
          break;
        case 88:
          Players[player] = 24;
          snake = true;
          break;
        case 95:
          Players[player] = 56;
          snake = true;
          break;
        case 97:
          Players[player] = 78;
          snake = true;
          break;
      }
      if(snake){
        Logger.log("Oh no one slippery slope");
      }
      if(Players[player] > 99){
        Players[player] = 100;
      }
      Logger.log("Player: "+(player+1)+" is at Position: "+Players[player]);
      //Game Won when reach >99
      RenderSnakesAndLadders(Players);
      if(Players[player] > 99){
        Logger.log("Congratulations Player: "+(player+1)+" Turns Taken: "+turnsTaken);
        RenderWinner(player+1,turnsTaken);
        gameWon = true;
        break;
      }
    }
   
  }
  
}

function testTranslatePosition(){
  for(var pos = 1;pos<101;pos++){
    Logger.log(translatePosition(pos));
  }
}

//Returns [row, col] in google sheets
function translatePosition(position){
  var R1 = Math.floor(position / 10);
  if(position % 10 == 0){
    R1-= 1;
  }
  var row = 10 - R1;
  
  var col;
  var R2 = position % 10;
  
  //If ODD/EVEN
  if(Math.floor(position / 10) % 2 == 1){
    //ODD
    if(R2==0){
      col = 10;
    }else{
      col = 10 - R2 +1;
    }
  }else{
    //EVEN
    if(R2==0){
      col = 1;
    }else{
      col = R2;
    }
  }
  return [row, col];
}

function testRender(){
  RenderSnakesAndLadders([2,22,5]);
}

//Given a players Array with positions it will render a board 
function RenderSnakesAndLadders(Players){
  Logger.log(Players);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //Grab board
  var boardRange = sheet.getRange(1,1,10,10);
  var boardColours = boardRange.getBackgrounds();
  //Blank out Colours
  for(var row = 0;row<boardColours.length;row++){
    for(var col = 0;col<boardColours[row].length;col++){
      boardColours[row][col] = "#FFFFFF";
    }
  }
  for(var player = 0;player<Players.length;player++){
    var position = Players[player];
    var [row,col] = translatePosition(position);
    if(position>0 && position<101){
      boardColours[row-1][col-1] = boardColours[row-1][col-1].slice(0,1+player*2)+"00"+boardColours[row-1][col-1].slice(1+player*2+2);
    }
  }
  boardRange.setBackgrounds(boardColours);
}

//Writeout who won the game
function RenderWinner(Player,turnCount){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var outputRange = sheet.getRange(8,11,2,2);
  var boardValues = outputRange.getValues();
  //Set values of cells
  boardValues[0][0] = "Game Winner:";
  boardValues[0][1] = Player;
  boardValues[1][0] = "Turns Taken:";
  boardValues[1][1] = turnCount;
  //Write them out
  outputRange.setValues(boardValues);
}