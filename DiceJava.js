//Game values
var gameStart = false;
var sideNum = 0;
var sideInt = 0;
var combatMsg = "attackTest";
var effectMsg = "defendTest";

//Player values
playerHp = 50;

//Mechanics
var defense = false;
var playerDamage = 0;
var enemyDamage = 0;

//Dice abilities
//--d4--
var d4power = 0;
var d4sidenum = 4;
//--d6--
var d6crit = false;
//--d8--
var d8stockpile = 0;
var d8totalstocks = 0;
var d8limit = 2;
//--d12--
var d12recoil = false;

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
        document.getElementById("combatBox").innerHTML = initMsg;
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


function rollDie() {
  defense = false;
  effectMsg = "..."
  sideEffect();
  //summon();
  if (sideNum == 4) {
    playerDamage = Math.floor(((Math.random() * d4sidenum) + 1));
  } else if (d6crit) {
    playerDamage = Math.floor(((Math.random() * 6) + 1) * 3);
  } else if (d8totalstocks > 0) {
    playerDamage = Math.floor(((Math.random() * 8) * d8totalstocks + 1));
  } else if (d12recoil) {
    console.log("selfdmg")
    playerDamage = 0;
  } else {
    playerDamage = Math.floor(((Math.random() * sideNum) + 1));
    d8totalstocks = 0;
    d8limit = 2;
  }

  console.log(playerDamage)
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
  document.getElementById("combatBox").innerHTML = combatMsg;
  document.getElementById("effectBox").innerHTML = effectMsg;
}

function sideEffect() {
  //D4 effect
  if (sideNum == 4) {
    d4power += 1;
    if (d4power == 4) {
      d4power = 0;
      d4sidenum += 1;
      effectMsg = "D-4 mutated and gained an extra side! it is now a "+d4sidenum+"-sided die!"
    } else if (defense) {
      effectMsg = "Defend successful!";
    } else {
      effectMsg = "...";
    }
  //D6 effect
  } else if (sideNum == 6 && (!defense) ) {
    if (Math.floor((Math.random() * 10) + 1) >= 8) {
      effectMsg = "D-6 landed a critical hit!";
      d6crit = true;
    } else {
      effectMsg = "...";
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
        effectMsg = "Defend successful! D-8 stockpiled energy for a total of "+d8totalstocks+". <br>Its total defense rose, and its next roll will expend energy for "+d8totalstocks+"x damage!";
      } else {
        effectMsg = "Defend successful!";;
      }
    }
  //D12 effect
  } else if (sideNum == 12 && (!defense) ) {
    if (Math.floor((Math.random() * 10) + 1) >= 9) {
      effectMsg = "D-12 damaged itself!";
      d12recoil = true;
    } else {
      effectMsg = "...";
      d12recoil = false;
    }
  }
}
