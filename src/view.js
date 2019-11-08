import { DOMstrings } from "./base";

// UI CONTROLLER
const formatNumber = function(num, type) {
  let numSplit, int, newInt, dec, sign, counter;
  /* + or - before number
			2 decimal poiiiints
			comma separating thousand
		*/
  num = Math.abs(num);
  num = num.toFixed(2); //method from num.prototype - converts to string object
  numSplit = num.split("."); //converts into 2 parts and stores array
  int = numSplit[0];
  dec = numSplit[1];
  newInt = int.substr(int.length - 1, 1);

  //puts the 1000 point
  counter = 1;
  for (let i = int.length - 2; i >= 0; i--) {
    if (counter % 3 === 0) {
      newInt = int.substr(i, 1) + "," + newInt;
    } else {
      newInt = int.substr(i, 1) + newInt;
    }
    counter++;
  }
  //Old solution
  //int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3);

  type === "inc" ? (sign = "+") : (sign = "-");

  return `${sign} ${newInt}.${dec}`;
};

// Custom function to use forEach on nodeList
const nodeListForEach = function(list, callback) {
  for (let i = 0; i < list.length; i++) {
    callback(list[i], i);
  }
};

export default {
  // returns an object with the UI inputs
  getInput: function() {
    return {
      type: document.querySelector(DOMstrings.inputType).value, //either inc or exp
      description: document.querySelector(DOMstrings.inputDesc).value,
      value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
    };
  },

  // returns an object with the new inputs - - maybe from pop up box?
  getEditInput: function() {
    return {
      type: document.querySelector(DOMstrings.inputType).value, //either inc or exp
      description: document.querySelector(DOMstrings.inputDesc).value,
      value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
    };
  },

  addListItem: function(obj, type) {
    let html, value, element;

    value = formatNumber(obj.value, type);

    // Create html string with placeholder text - choose between inc and exp
    if (type === "inc") {
      element = DOMstrings.incomeContainer;

      html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">+ ${value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    } else if (type === "exp") {
      element = DOMstrings.expensesContainer;

      html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">- ${value}</div><div class="item__percentage"> 12%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    }
    // Insert HTML into DOM - beforeend so we have it as last element in list
    document.querySelector(element).insertAdjacentHTML("beforeend", html);
  },

  deleteListItem: function(selectorID) {
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
  },

  deleteList: function(type) {
    let typeContainer, ele;
    //chooses the right list
    type === "inc"
      ? (typeContainer = DOMstrings.incomeContainer)
      : (typeContainer = DOMstrings.expensesContainer);
    //removes children until none
    ele = document.querySelector(typeContainer);
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  },

  // Clears our input fields
  clearFields: function() {
    document.querySelector(DOMstrings.inputDesc).value = "";
    document.querySelector(DOMstrings.inputValue).value = "";
    //Sets focus back on description field
    document.querySelector(DOMstrings.inputDesc).focus();
  },
  // to display the calculated budget items. gets obj with 4 properties
  displaybudget: function(obj) {
    let type;
    //determine if budget is positive for format number
    obj.budget > 0 ? (type = "inc") : (type = "exp");

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
      obj.budget,
      type
    );
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
      obj.totalInc,
      "inc"
    );
    document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(
      obj.totalExp,
      "exp"
    );
    if (obj.percentage > 0) {
      document.querySelector(DOMstrings.percentageLabel).textContent =
        obj.percentage + "%";
    } else {
      document.querySelector(DOMstrings.percentageLabel).textContent = "---";
    }
  },

  displayPercentages: function(percentages) {
    // dont know what items exactly -> SelectorAll
    //returns nodeList
    let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
    // Custom ForEach() on nodeList gets used with anon callback func
    nodeListForEach(fields, function(current, index) {
      // If we have percentage for index we display it via textContent at the html element coming out of fields Nodelist
      if (percentages[index] > 0) {
        current.textContent = percentages[index] + "%";
      } else {
        current.textContent = "---";
      }
    });
  },

  displayMonth: function() {
    let now, year, month, monthNames;
    now = new Date();
    monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    month = now.getMonth();
    year = now.getFullYear();
    document.querySelector(DOMstrings.dateLabel).textContent =
      monthNames[month] + " " + year;
  },

  //make the outlines red when expense is selected
  changedType: function() {
    var fields = document.querySelectorAll(
      DOMstrings.inputType +
        "," +
        DOMstrings.inputDesc +
        "," +
        DOMstrings.inputValue
    );

    //use our custom forEach nodelist
    nodeListForEach(fields, cur => {
      cur.classList.toggle("red-focus");
    });

    document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
  }
};
