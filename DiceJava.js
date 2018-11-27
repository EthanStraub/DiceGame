function rollDie() {
  var radios = document.getElementById("sideInput").elements["DiceType"]

  for (var i = 0, length = radios.length; i < length; i++)
  {
   if (radios[i].checked)
   {
    // do whatever you want with the checked radio
    alert(radios[i].value);
    console.log("12345")
    // only one radio can be logically checked, don't check the rest
    break;
   }
  }
}

document.getElementById('myBtn').onclick = function() {
   rollDie();
};
