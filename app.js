/*
Budget App with ES5 Syntax

Feature Ideas:
-Delete all (done)
-Date picker(medium?)
-loop to make the thousand marker work with big numbers(easy)
-add categories and a chart split into the categories (hard)
-add reset button (easy)
-add months dropdown with temp storing of months (hard?)
-edit button on each list element (medium?)

-add users and saving of data via NODE JS (very hard)


*/

// BUDGET CONTROLLER
let budgetController = (function() {
    // Expense Constructor
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;   //not yet defined
    };

    // Method: Calculate percentage from total
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };
    // Income Contructor
    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        
    };

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
        percentage: -1  //value -1 so we now it doesnt exist yet
    };

    //calculates total for either inc or exp
    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    };
    
    return {
        //add an item with the info coming from getter method out of UI
        addItem: function(type, des, val) {
            let newItem, ID;
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new Item based on inc or exp type
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
            //Push into data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        //delete item from data object
        deleteItem: function(type, id) {
            let ids, index;
            //need to consider that id != index
            //map like forEach but returns a new array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            //returns the index of the id we are looking for
            index = ids.indexOf(id);

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
})();



// UI CONTROLLER

//all classnames of html. simple to change later on
let UIController = (function() {
    const DOMstrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        inputBtnDelInc: ".allInc__delete--btn",
        inputBtnDelExp: ".allExp__delete--btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    };

    const formatNumber = function(num, type) {
        let numSplit, int, dec, sign;
        /* + or - before number 
            2 decimal poiiiints
            comma separating thousand
        */
        num = Math.abs(num);
        num = num.toFixed(2);    //method from num.prototype - converts to string object
        numSplit = num.split(".");  //converts into 2 parts and stores array
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {   //puts the 1000 point
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3);
        }

        type === "inc" ? sign = "+" : sign = "-";

        return sign + " " + int + "." + dec;
    };

    // Custom function to use forEach on nodeList
    const nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        // returns an object with the UI inputs
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //either inc or exp
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml;
            // Create html string with placeholder text - choose between inc and exp
            if (type === "inc") {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
            // Insert HTML into DOM - beforeend so we have it as last element in list
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        deleteList: function(type) {
            let typeContainer, ele;
            //chooses the right list
            type === "inc" ? typeContainer = DOMstrings.incomeContainer : typeContainer = DOMstrings.expensesContainer;
            //removes children until none
            ele = document.querySelector(typeContainer)
            while (ele.firstChild) {
               ele.removeChild(ele.firstChild);
            }
        },

        clearFields: function() {
            let fields, fieldsArr;
            //querySelectorAll returns list of findings
            fields = document.querySelectorAll(DOMstrings.inputDesc + ", " + DOMstrings.inputValue);
            //using the slice() from array to covert the list we got from above
            fieldsArr = Array.prototype.slice.call(fields);
            //sets value to zero for every ele
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            //Sets focus back on description field
            fieldsArr[0].focus();
        },
        // to display the calculated budget items. gets obj with 4 properties
        displaybudget: function(obj) {
            let type;
            obj.budget > 0 ? type = "inc" : type = "exp";   //determine if budget is positive

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
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
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = monthNames[month]+ " " + year;
        },

        //make the outlines red when expense is selected
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + "," + 
                DOMstrings.inputDesc + "," + 
                DOMstrings.inputValue);
            
            //use our custom forEach nodelist
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle("red-focus");
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
        },

        //making DOMstrings public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();



// APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {
    //function having all the eventListeners running waiting for User input
    const setupEventListeners = function() {
        const DOM = UIController.getDOMstrings();
        //for button click on adding budget elements
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        //event listener for return key. called on document object (whole page)
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        //bubbles up
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
        //event for change of type -> red outline on expenses
        document.querySelector(DOM.inputType).addEventListener("change", UIController.changedType);
        //event for delete Incomes / Expenses
        document.querySelector(DOM.inputBtnDelInc).addEventListener("click", ctrlDeleteAll);
        document.querySelector(DOM.inputBtnDelExp).addEventListener("click", ctrlDeleteAll);
        });
    };

    // Function to-calc the budget
    // seperate function because we call it on add and delete tiems
    const updateBudget = function() {
        //1. Calc budget
        budgetController.calculateBudget(); 
        //2. Return budget - getter method
        let budget = budgetController.getBudget();
        //3. Display on ui
        UIController.displaybudget(budget);
    };

    const updatePercentages = function() {
        //1. Calc the percentages
        budgetController.calculatePercentages();
        //2. Read them form budget Controller
        let percentages = budgetController.getPercentages();
        //3. Update UI with new percentages
        UIController.displayPercentages(percentages);
        console.log(percentages);
    };
    
    // What happens when new budget element gets added
    const ctrlAddItem = function() {
        let input, newItem;
        //1. Get field input data
        input = UIController.getInput();
        console.log(input);
        // Check for correct input
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add item to the budget controller
            newItem = budgetController.addItem(
                input.type,
                input.description,
                input.value);
            
            //3. Add item to the UI
            UIController.addListItem(newItem, input.type);
            //4. Clear fields
            UIController.clearFields();
            //calc and update budget
            updateBudget();
            //calc and update percentages
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
            budgetController.deleteItem(type, id);

            //2. delete item from UI
            UIController.deleteListItem(itemID);
            //3. update and show new budget - use method from before
            updateBudget();
            //4. calc and update percentages
            updatePercentages();
        }
    };

    //Deletes all items entered
    const ctrlDeleteAll = function(event) {
        let type;
        console.log(event.target.parentNode.classList);
        if (event.target.parentNode.classList.value === "allInc__delete--btn") { type = "inc"; }
        else if (event.target.parentNode.classList.value === "allExp__delete--btn") { type = "exp"; }
        // 1. Delete all objects from budgetCtrl
        budgetController.deleteType(type);
        // 2. Remove items from UI
        UIController.deleteList(type);
        // 3. Rerun budget calc
        updateBudget();
    }

    return {
        init: function() {
            console.log("App started!");
            UIController.displayMonth();
            setupEventListeners();
            //make everything zero on start. inserting custom obj
            UIController.displaybudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };
})(budgetController, UIController);
    
controller.init();
    