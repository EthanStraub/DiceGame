//Game values
var gameStart = false;
var sideNum = 0;
var sideInt = 0;
var combatMsg = "attackTest";
var effectMsg = "defendTest";
var turn = 0;
var enemyTypeFloor = 1;
var isGameOver = false;

//Player values
var playerHp = 50;

//Enemy values
var enemyAppeared = false;

var enemy = 0;
var enemyType = ["dwarf", "goblin", "demon"];
var enemyHP = [20,40,60];
var enemyData = [];

//Mechanics
var defense = false;
var playerDamage = 0;
var enemyDamage = 0;

//Dice abilities
//--d4--
var d4power = 0;
var d4sidenum = 4;
var d4limit = 3
//--d6--
var d6crit = false;
//--d8--
var d8stockpile = 0;
var d8totalstocks = 0;
var d8limit = 2;
//--d12--
var d12recoil = false;
var recoilCalc = false;

//CSS values
var diceIDs = ["4","6","8","10","12","20"];
var diceDecIDs = ["4","6","8","10","12","20"];


function removeDice() {
  //Makes a variable containing all elements in the sideInput form
  var displayElem = document.getElementById("sideInput");
  //Loops through elements in the genDice class, changes display of them to none
  for (i=0;i<2;i++) {
    displayElem.getElementsByClassName("genDice")[i].style.display = "none";
  }
  for (i=0;i<diceIDs.length;i++) {
    if (sideNum !== diceIDs[i]) {
      var displayDice = document.getElementById("sideInput");
      displayDice.getElementsByClassName("tdw")[i].style.display = "none";
    }
  }
  for (i=0;i<diceDecIDs.length;i++) {
    if (sideNum !== diceDecIDs[i]) {
      displayDice.getElementsByClassName("descr")[i].style.display = "none";
    }
  }
}

function initialize() {
  if (!gameStart) {
    var radios = document.getElementById("sideInput").elements["DiceType"]

    for (var i = 0, length = radios.length; i < length; i++) {
     if (radios[i].checked) {
        alert(radios[i].value+"-sided die has been equiped");
        sideNumProto = radios[i].value;
        sideNum = sideNumProto.replace(/\s/g, '');
        sideInt = parseInt(sideNum);
        var initMsg = "You enter the dungeon with your "+sideNum+"-sided die!";
        var initMsgHP = " <span style='color:red'>HP: </span> "+playerHp;
        document.getElementById("combatBox").innerHTML = initMsg;
        document.getElementById("effectBox").innerHTML = initMsgHP;
        break;
      }
    }
    gameStart = true;
    removeDice();
  }
}

document.getElementById('rollButton').onclick = function() {
  if (!gameStart) {
    initialize();
  } else if (gameStart) {
    rollDie();
  }
};
document.getElementById('defendButton').onclick = function() {
  if (gameStart) {
    defendDie();
  }
};
document.getElementById('restartButton').onclick = function() {
  if (gameStart) {
    location.reload();
  }
};


function endOfTurn() {
  console.log(playerHp);
  if (isGameOver) {
    //null
    playerHp = 0;
    combatMsg = "You have perished! Press restart to try again!";
    effectMsg = " <span style='color:red'>HP: </span> "+playerHp;
  } else if (!enemyAppeared) {
    summon();
    effectMsg = "Next Enemy: "+enemyData[0]+", HP: "+playerHp;
  } else {
    effectMsg+=(" <span style='color:red'>HP: </span> "+playerHp)
    return;
  }
}
function difficultyIncr() {
  turn+=1;
  if (turn%10===0) {
    enemyTypeFloor+=1;
  }
}
function enemyAttack() {
  if (enemyData[0] == "dwarf") {
    enemyDamage = Math.floor((Math.random() * 5) + 1)
  } else if (enemyData[0] == "goblin") {
    enemyDamage = Math.floor((Math.random() * 15) + 1)
  } else if (enemyData[0] == "demon") {
    enemyDamage = Math.floor((Math.random() * 30) + 1)
  }
}
function damageCalc() {
  summon();
  enemyAttack();
  if (recoilCalc) {
    console.log(playerDamage)
    enemyDamage+=playerDamage;
    playerDamage = 0;
    recoilCalc = false;
  }
  if (defense) {
    combatMsg = "You defend against the "+enemyData[0]+"'s attack of "+enemyDamage+" damage!";
    enemyDamage = 0;
  } else if ((enemyData[1]-playerDamage) <= 0) {
    enemyDamage = 0;
    combatMsg = "You defeated the "+enemyData[0]+"!!!";
    enemyAppeared = false;
  } else {
    if ((playerHp-enemyDamage) <= 0) {
      gameOver();
      playerHp = 0;
    } else {
      enemyData[1]-=playerDamage;
    }
    if (enemyData[1] > 0 && !isGameOver) {
      playerHp-=enemyDamage;
    }
    combatMsg = "You attacked the "+enemyData[0]+" for "+playerDamage+" damage! It fights back with "+enemyDamage+" damage!"
  }
}
function summon() {
  if (!enemyAppeared) {
    enemy = Math.floor((Math.random() * 20) * enemyTypeFloor + 1);
    if (enemy <= 30) {
      enemyData[0]=enemyType[0];
      enemyData[1]=enemyHP[0];
    } else if (enemy > 30 && enemy <= 100) {
      enemyData[0]=enemyType[1];
      enemyData[1]=enemyHP[1];
    } else if (enemy > 100){
      enemyData[0]=enemyType[2];
      enemyData[1]=enemyHP[2];
    }
    enemyAppeared = true;
  }
}

function rollDie() {
  defense = false;
  effectMsg = "Floor: "+enemyTypeFloor
  sideEffect();
  //summon();
  if (sideNum == 4) {
    playerDamage = Math.floor(((Math.random() * d4sidenum) + 1));
  } else if (d6crit) {
    playerDamage = Math.floor(((Math.random() * 6) + 1) * 3);
  } else if (d8totalstocks > 0) {
    playerDamage = Math.floor(((Math.random() * 8) * d8totalstocks + 1));
    d8totalstocks = 0;
  } else if (d12recoil) {
    playerDamage = Math.floor(((Math.random() * sideNum) + 1));
    recoilCalc = true;
    console.log(recoilCalc)
  } else {
    playerDamage = Math.floor(((Math.random() * sideNum) + 1));
    d8totalstocks = 0;
    d8limit = 2;
  }
  //console.log(playerDamage)
  damageCalc();
  difficultyIncr();
  endOfTurn();
  document.getElementById("combatBox").innerHTML = combatMsg;
  document.getElementById("effectBox").innerHTML = effectMsg;
}

function defendDie() {
  defense = true;
  effectMsg = "Defend successful!"
  if (sideNum == 20) {
    effectMsg = "D-20 cannot defend!";
    defense = false;
  }
  sideEffect();
  damageCalc();
  difficultyIncr();
  endOfTurn();
  document.getElementById("combatBox").innerHTML = combatMsg;
  document.getElementById("effectBox").innerHTML = effectMsg;
}

function sideEffect() {
  //D4 effect
  if (sideNum == 4) {
    d4power += 1;
    if (d4power >= d4limit) {
      d4power = 0;
      d4sidenum += 1;
      d4limit += 0.25
      effectMsg = "D-4 mutated and gained an extra side! it is now a "+d4sidenum+"-sided die!"
    } else if (defense) {
      effectMsg = "Defend successful!";
    } else {
      effectMsg = "Floor: "+enemyTypeFloor;
    }
  //D6 effect
  } else if (sideNum == 6 && (!defense) ) {
    if (Math.floor((Math.random() * 10) + 1) >= 8) {
      effectMsg = "D-6 landed a critical hit!";
      d6crit = true;
    } else {
      effectMsg = "Floor: "+enemyTypeFloor;
      d6crit = false;
    }
  //D8 effect
  } else if (sideNum == 8) {
    if (defense) {
      d8stockpile += 1;
      if (d8stockpile >= d8limit) {
        d8stockpile = 0;
        d8totalstocks +=1;
        d8limit += 0.5;
        effectMsg = "Defend successful! D-8 stockpiled energy for a total of "+d8totalstocks+". <br>Its next roll will expend energy for "+d8totalstocks+"x damage!";
      } else {
        effectMsg = "Defend successful!";;
      }
    }
  //D12 effect
  } else if (sideNum == 12 && (!defense) ) {
    if (Math.floor((Math.random() * 10) + 1) >= 9) {
      effectMsg = "D-12 damaged itself! It took an additional "+playerDamage+" damage!";
      d12recoil = true;
    } else {
      effectMsg = "Floor: "+enemyTypeFloor;
      d12recoil = false;
    }
  }
}

function gameOver() {
  playerHp = 0;
  combatMsg = "You have perished! Press restart to try again!";
  isGameOver = true;
  endOfTurn();
}
