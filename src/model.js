// BUDGET CONTROLLER
// Expense Constructor
class Expense {
  constructor(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1; //not yet defined
  }
  // Method: Calculate percentage from total
  calcPercentage(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }
  getPercentage() {
    return this.percentage;
  }
}

// Income Contructor
class Income {
  constructor(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
}

let data = {
  allItems: {
    exp: [],
    inc: []
  },
  totals: {
    exp: 0,
    inc: 0
  },
  budget: 0,
  percentage: -1 //value -1 so we now it doesnt exist yet
};

//calculates total for either inc or exp
const calculateTotal = type => {
  let sum = 0;
  data.allItems[type].forEach(element => {
    sum += element.value;
  });
  data.totals[type] = sum;
};


// gets new ID for addItem()
const getNewID = type => {
  //select right array according to type
  let array = data.allItems[type];
  //check if any items before
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  } else {
    return 0;
  }
};


//gets Index of Item
const getIndex = function(type, id) {
  let ids, index;
  //need to consider that id != index
  //map like forEach but returns a new array
  ids = data.allItems[type].map(current => {
    return current.id;
  });
  //returns the index of the id we are looking for
  return ids.indexOf(id);
};


//add an item with the info coming from getter method out of UI

export default model = {

  addItem: function(type, des, val) {
    let newItem, id;
    //Create new id
    id = getNewID(type);
    //Create new Item based on inc or exp type
    if (type === "exp") {
      newItem = new Expense(id, des, val);
    } else if (type === "inc") {
      newItem = new Income(id, des, val);
    }
    //Push into data structure
    data.allItems[type].push(newItem);
    return newItem;
  },

  //edits the data of an item
  editItem: function(type, id, value) {
    let index, item;
    //returns the index of the id we are looking for
    index = getIndex(type, id);

    if (index !== -1) {
      item = data.allItems[type][index];
      item.value = value;
    }
  },

  //delete item from data object
  deleteItem: function(type, id) {
    let index;
    //returns the index of the id we are looking for
    index = getIndex(type, id);

    if (index !== -1) {
      //splice removes elements from our array at position index
      data.allItems[type].splice(index, 1);
    }
  },

  deleteType: function(type) {
    //deletes all data of type
    data.allItems[type] = [];
  },

  calculateBudget: function() {
    //calc total income and expense
    calculateTotal("exp");
    calculateTotal("inc");
    //calc budget: income - expense
    data.budget = data.totals.inc - data.totals.exp;
    //calc the percentage of income we spent
    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  },

  calculatePercentages: function() {
    data.allItems.exp.forEach(function(cur) {
      cur.calcPercentage(data.totals.inc);
    });
  },

  //getter method for budget values. using object because many values
  getBudget: function() {
    return {
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage
    };
  },

  getPercentages: function() {
    let allPerc = data.allItems.exp.map(function(cur) {
      return cur.getPercentage();
    });
    return allPerc;
  },

  testing: function() {
    calculateTotal("exp");
    console.log(data);
  }
};