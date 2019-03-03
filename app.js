// BUDGET CONTROLLER
let budgetController = (function() {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
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
        //getter method for budget values. using object because many values
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            // Insert HTML into DOM - beforeend so we have it as last element in list
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        clearFields: function() {
            let fields, fieldsArr;
            //querySelectorAll returns list of findings
            fields = document.querySelectorAll(DOMstrings.inputDesc + ", " + DOMstrings.inputValue);
            //using the splice() from array to covert the list we got from above
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
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },

        //making DOMstrings public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();



// GLOBAL APP CONTROLLER
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
        });
    };

    // Function to-calc the budget
    // seperate function because we call it on add and delete
    const updateBudget = function() {
        //1. Calc budget
        budgetController.calculateBudget(); 
        //2. Return budget - getter method
        let budget = budgetController.getBudget();
        //3. Display on ui
        UIController.displaybudget(budget);
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
        }
    };
        
        return {
            init: function() {
                console.log("App started!");
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
    