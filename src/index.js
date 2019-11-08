/*
Budget App with ES5 Syntax

Feature Ideas:
-update into proper es6 and modules (medium) (done)
-webpack, npm (done)
-Delete all (done)
-loop to make the thousand marker work with big numbers(done)

-Date picker(medium?)
-add categories and a chart split into the categories (hard)
-add months dropdown with temp storing of months (very hard?)
-edit button on each list element (medium?)

-add users and saving of data via NODE JS (very very hard)

*/

import Model from "./model";
import View from "./view";
import { DOMstrings as DOM } from "./base";

// APP CONTROLLER
//
//function having all the eventListeners running waiting for User input
const setupEventListeners = function() {
  //for button click on adding budget elements
  document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
  //event listener for return key. called on document object (whole page)
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
  //delete a list item - bubbles up
  document
    .querySelector(DOM.container)
    .addEventListener("click", ctrlDeleteItem);
  //event for change of type -> red outline on expenses
  document
    .querySelector(DOM.inputType)
    .addEventListener("change", View.changedType);
  //event for delete Incomes / Expenses
  document
    .querySelector(DOM.inputBtnDelInc)
    .addEventListener("click", ctrlDeleteListType);
  document
    .querySelector(DOM.inputBtnDelExp)
    .addEventListener("click", ctrlDeleteListType);
};

// Function to-calc the budget
// seperate function because we call it on add and delete tiems
const updateBudget = function() {
  //1. Calc budget
  Model.calculateBudget();
  //2. Return budget - getter method
  let budget = Model.getBudget();
  //3. Display on ui
  View.displaybudget(budget);
};

const updatePercentages = function() {
  //1. Calc the percentages
  Model.calculatePercentages();
  //2. Read them form budget Controller
  let percentages = Model.getPercentages();
  //3. Update UI with new percentages
  View.displayPercentages(percentages);
  console.log(percentages);
};

// What happens when new budget element gets added
const ctrlAddItem = function() {
  let input, newItem;
  //1. Get field input data
  input = View.getInput();
  console.log(input);
  // Check for correct input
  if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
    //2. Add item to the budget controller
    //   getting the created object back from .addItem()
    newItem = Model.addItem(input.type, input.description, input.value);

    //3. Add item to the UI
    View.addListItem(newItem, input.type);
    //4. Clear fields
    View.clearFields();
    //calc and update budget
    updateBudget();
    //calc and update percentages
    updatePercentages();
  }
};

const ctrlEditItem = function() {
  let itemID, splitID, type, id;
  //get input --- make item input field pop off?? somewehre else?
  input = View.getEditInput();
  //select the ItemBox
  itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
  if (itemID) {
    //split returns array with 2 strings(more with more -): before&after "-"
    splitID = itemID.split("-");
    type = splitID[0];
    id = parseInt(splitID[1]);
    //1. edit item in data structure
    Model.editItem(type, id, input);
    //2. delete item from UI
    View.editListItem(itemID);
    //3. update and show new budget - use method from before
    updateBudget();
    //4. calc and update percentages
    updatePercentages();
  }
};

// Delete list items. event is the orginating bubble element
//not best solution since hardcoded the DOM path
const ctrlDeleteItem = function(event) {
  let itemID, splitID, type, id;
  //selects the ItemBox via id. Has to traverse up
  itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
  //only one id in html..on the items
  if (itemID) {
    //split returns array with 2 strings(more with more -): before&after "-"
    splitID = itemID.split("-");
    type = splitID[0];
    id = parseInt(splitID[1]);
    //1. delete item from data structure
    Model.deleteItem(type, id);
    //2. delete item from UI
    View.deleteListItem(itemID);
    //3. update and show new budget - use method from before
    updateBudget();
    //4. calc and update percentages
    updatePercentages();
  }
};

//Deletes whole list of type
const ctrlDeleteListType = function(event) {
  let type;
  console.log(event.target.parentNode.classList);
  if (event.target.parentNode.classList.value === "allInc__delete--btn") {
    type = "inc";
  } else if (
    event.target.parentNode.classList.value === "allExp__delete--btn"
  ) {
    type = "exp";
  }
  // 1. Delete all objects from budgetCtrl
  Model.deleteType(type);
  // 2. Remove items from UI
  View.deleteList(type);
  // 3. Rerun budget calc perc calc
  updateBudget();
  updatePercentages();
};

const init = function() {
  console.log("App started!");
  View.displayMonth();
  setupEventListeners();
  //make everything zero on start. inserting custom obj
  View.displaybudget({
    budget: 0,
    totalInc: 0,
    totalExp: 0,
    percentage: -1
  });
};

init();
