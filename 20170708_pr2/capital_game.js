// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var country_capital_pairs = pairs;
var questionIdx = [];
var solvedProblem = [];

$( document ).ready(function() {
  country_capital_pairs = pairs;
  bindEvent();
  refreshTable();
  
  $(function () {
    var capital = [];
    for (var i=0; i<country_capital_pairs.length;i++) {
      capital.push(country_capital_pairs[i].capital);
    }

    $("#pr2__answer").autocomplete({
      minLength : 2,
      source : capital,
      select : function(e, ui) {
        e.preventDefault();
        var submitBtn = document.getElementById('pr2__submit');

        if(e.keyCode == 13){
          return false;
        }
        submitBtn.click();
        return false;
      },
      focus : function(e, ui) {
        var input = document.getElementById('pr2__answer');
        input.value = ui.item.value;
        return false;
      },
      classes : {
        'ui-autocomplete' : 'highlight'
      },
    });
  })
  
  $("input:radio[name = select]").click(function () {
    if($("input:radio[name = select]:checked").val() == 'Correct Only') {
      CorrectOnly();
    } else if ($("input:radio[name = select]:checked").val() == 'Wrong Only') {
      WrongOnly();
    } else {
      showAll();
    }
  })
});

//get random index whenever refresh or click the button
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function fillContents(div, index) {
  div.currentContent = index;
  div.innerHTML = country_capital_pairs[index].country;
}

//whenever refresh, do initialization of question table with no example
function refreshTable() {
  var table = document.getElementById('questionTable');
  var numRow = table.rows.length;
  for(var i=0;i<numRow-2;i++){
    table.deleteRow(1);
  } 
  questionIdx = [];
  giveNewQuestion();

  //add filtering row
  var filter = table.insertRow(-1);
  var filterCell = filter.insertCell(0);
  filterCell.colSpan = "3";
  filterCell.id = "radio";
  $('#radio').append(
    $('<input>').prop({
      type: 'radio',
      id: "All",
      name: 'select',
      value: "All",
      checked : "checked",
      onclick : "showAll()"
    })
  ).append(
    $('<label>').prop({
      for: "All"
    }).html("All")
  ).append(
    $('<input>').prop({
      type: 'radio',
      id: "checkCorrect",
      name: 'select',
      value: "Correct Only",
      onclick : "CorrectOnly()"
    })
  ).append(
    $('<label>').prop({
      for: "Correct Only"
    }).html("Correct Only")
  ).append(
    $('<input>').prop({
      type: 'radio',
      id: "checkWrong",
      name: 'select',
      value: "Wrong Only",
      onclick : "WrongOnly()"
    })
  ).append(
    $('<label>').prop({
      for: "Wrong Only"
    }).html("Wrong Only")
  )

  //add 'no entry to show' row
  noEntryRow();
}

function noEntryRow () {
  var table = document.getElementById('questionTable');
  var newRow = table.insertRow(-1);
  var newCell1 = newRow.insertCell(0);
  newCell1.id = "noEntry";
  newCell1.colSpan = "3";
  newCell1.innerHTML = 'No entry to show';
}

function giveNewQuestion () {
  var idx = -1;
  if(questionIdx.length == 0) {
    idx = getRandomInt(0, country_capital_pairs.length-1);
    questionIdx.push(idx);
  } else {
    do{
      idx = getRandomInt(0, country_capital_pairs.length-1);
    } while(questionIdx.includes(idx))
    questionIdx.push(idx);
  }

  var question = document.getElementById('pr2__question');
  var input = document.getElementById('pr2__answer');
  input.focus();
  fillContents(question, idx);
  input.value = '';
  
}

function printCorrect(curIdx, insertCell1, insertCell2, insertCell3) {
  insertCell1.innerHTML = country_capital_pairs[curIdx].country;
  insertCell2.innerHTML = country_capital_pairs[curIdx].capital;
  insertCell3.innerHTML = '<i class="fas fa-check"></i>';
  
  insertCell1.className = 'second_row';
  insertCell2.className = 'second_row';
  insertCell3.className = 'second_row';
  
  var obj = {
    "problem" : country_capital_pairs[curIdx].country,
    "answer" : country_capital_pairs[curIdx].capital,
    "check" : "correct"
  }

  solvedProblem.push(obj);
  // console.log(solvedProblem);
}

function printWrong(curIdx, input, insertCell1, insertCell2, insertCell3) {
  var test = country_capital_pairs[curIdx].country;
  insertCell1.innerHTML = country_capital_pairs[curIdx].country;
  insertCell2.innerHTML = input.value;
  insertCell3.innerHTML = country_capital_pairs[curIdx].capital + ' ' + '<button id = "delete" type = "button" onClick = "deletionOfRow(this, \''+test + 
  '\');">Delete</button>';
    
  insertCell1.className = 'third_row';
  insertCell2.className = 'third_row';
  insertCell3.className = 'third_row';
  insertCell2.id = "wrong_answer";

  var obj = {
    "problem" : country_capital_pairs[curIdx].country,
    "userAns" : input.value,
    "answer" : country_capital_pairs[curIdx].capital,
    "check" : "wrong"
  }

  solvedProblem.push(obj);
  // console.log(solvedProblem);
}

function printOneProblem () {
  var input = document.getElementById('pr2__answer');
  var curIdx = document.getElementById('pr2__question').currentContent;
  var table = document.getElementById('questionTable');
  var insertRow = table.insertRow(-1);
  var insertCell1 = insertRow.insertCell(0);
  var insertCell2 = insertRow.insertCell(1);
  var insertCell3 = insertRow.insertCell(2);
  if(input.value.toLowerCase() == country_capital_pairs[curIdx].capital.toLowerCase()) {
      //정답일때
      if($("input:radio[name = select]:checked").val() == 'Wrong Only') {
        // console.log('correct but in wrong only btn');
        var obj = {
          "problem" : country_capital_pairs[curIdx].country,
          "answer" : country_capital_pairs[curIdx].capital,
          "check" : "correct"
        }
      
        solvedProblem.push(obj);
        var radioBtn = document.getElementById("All");
        radioBtn.checked = true;
        showAll();

      } else {
        printCorrect(curIdx, insertCell1, insertCell2, insertCell3);
      }
  } else {
    //틀렸을때
    if($("input:radio[name = select]:checked").val() == 'Correct Only') {
      // console.log('wrong but in correct btn');
      var obj = {
        "problem" : country_capital_pairs[curIdx].country,
        "userAns" : input.value,
        "answer" : country_capital_pairs[curIdx].capital,
        "check" : "wrong"
      }
    
      solvedProblem.push(obj);
      var radioBtn = document.getElementById("All");
      radioBtn.checked = true;
      showAll();

    } else {
      printWrong(curIdx, input, insertCell1, insertCell2, insertCell3);
    }
    
  }
}

function CorrectOption(i, insertCell1, insertCell2, insertCell3) {
  var test = solvedProblem[i].problem;
  insertCell1.innerHTML = solvedProblem[i].problem;
  insertCell2.innerHTML = solvedProblem[i].answer;
  insertCell3.innerHTML = '<i class="fas fa-check"></i>' + '<button id = "delete" type = "button" onClick = "deletionOfRow(this, \''+test + 
  '\');">Delete</button>';
  
  insertCell1.className = 'second_row';
  insertCell2.className = 'second_row';
  insertCell3.className = 'second_row';
}

function WrongOption(i, insertCell1, insertCell2, insertCell3) {
  var test = solvedProblem[i].problem;
  insertCell1.innerHTML = solvedProblem[i].problem;
  insertCell2.innerHTML = solvedProblem[i].userAns;
  insertCell3.innerHTML = solvedProblem[i].answer + '<button id = "delete" type = "button" onClick = "deletionOfRow(this, \''+test + 
  '\');">Delete</button>';
    
  insertCell1.className = 'third_row';
  insertCell2.className = 'third_row';
  insertCell3.className = 'third_row';
  insertCell2.id = "wrong_answer";
}

function bindEvent() {
  var submitBtn = document.getElementById('pr2__submit');
  submitBtn.onclick = function () {
    if(solvedProblem.length==0) {
      var table = document.getElementById('questionTable');
      table.deleteRow(-1);
    }
    $("#pr2__answer").autocomplete("close");
    printOneProblem();
    giveNewQuestion();
    $( "#pr2__answer" ).autocomplete( "search", "" );
  }

  //button should be clicked if a user press the enter in the input box
  var input = document.getElementById('pr2__answer');
  input.addEventListener("keydown", function(e) {
    if (e.keyCode == 13){
      e.preventDefault();
      submitBtn.click();
    }
  })
}

function deletionOfRow(obj, i) {
  var table = document.getElementById('questionTable');
  var index = solvedProblem.findIndex(function (problem) {
    return problem.problem == i;
  })
  solvedProblem.splice(index, 1);

  var tr = $(obj).parent().parent();
  tr.remove();

  if(table.rows.length == 3) {
    noEntryRow();
  }
}

function CorrectOnly() {
  var table = document.getElementById('questionTable');
  var numRow = table.rows.length;
  for(var j=0;j<numRow-3;j++){
    table.deleteRow(-1);
  }

  var cnt=0;
  for(var i=0;i<solvedProblem.length;i++) {
    if(solvedProblem[i].check == 'correct') {
      var insertRow = table.insertRow(-1);
      var insertCell1 = insertRow.insertCell(0);
      var insertCell2 = insertRow.insertCell(1);
      var insertCell3 = insertRow.insertCell(2);
      CorrectOption(i, insertCell1, insertCell2, insertCell3);
      cnt++;
    } else {
      continue;
    }
  }
  if(cnt==0) {
    noEntryRow();
  }
}

function WrongOnly () {
  var table = document.getElementById('questionTable');
  var numRow = table.rows.length;
  for(var j=0;j<numRow-3;j++){
    table.deleteRow(-1);
  }
  
  var cnt = 0;
  for(var i=0;i<solvedProblem.length;i++) {
    if(solvedProblem[i].check == 'wrong') {
      cnt++;
      var insertRow = table.insertRow(-1);
      var insertCell1 = insertRow.insertCell(0);
      var insertCell2 = insertRow.insertCell(1);
      var insertCell3 = insertRow.insertCell(2);
      WrongOption(i, insertCell1, insertCell2, insertCell3);
    } else {
      continue;
    }
  }
  
  if(cnt == 0) {
    noEntryRow();
  }
}

function showAll() {
  var table = document.getElementById('questionTable');
  var numRow = table.rows.length;
  for(var j=0;j<numRow-3;j++){
    table.deleteRow(-1);
  }

  if(solvedProblem.length == 0) {
    noEntryRow();
  } else {
    for(var i=0;i<solvedProblem.length;i++) {
      var insertRow = table.insertRow(-1);
      var insertCell1 = insertRow.insertCell(0);
      var insertCell2 = insertRow.insertCell(1);
      var insertCell3 = insertRow.insertCell(2);
  
      if(solvedProblem[i].check == 'correct') {
        CorrectOption(i, insertCell1, insertCell2, insertCell3);
      } else if(solvedProblem[i].check == 'wrong'){
        WrongOption(i, insertCell1, insertCell2, insertCell3);
      }
    }
  }
}





