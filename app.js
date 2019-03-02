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
            exp: [],
            inc: []
        }
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

        testing: function() {
            console.log(data);
        }
    };
})();



// UI CONTROLLER
let UIController = (function() {
    let DOMstrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    };
    
    return {
        // returns an object with the UI inputs
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //either inc or exp
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: document.querySelector(DOMstrings.inputValue).value
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
        //making DOMstrings public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();



// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {
    let setupEventListeners = function() {
        let DOM = UIController.getDOMstrings();
        //for button click on adding budget elements
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        
        //event listener for return key. called on document object (whole page)
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };
    
    // What happens when new budget element gets added
    const ctrlAddItem = function() {
        let input, newItem;
        //1. Get field input data
        input = UIController.getInput();
        console.log(input);
        
        //2. Add item to the budget controller
        newItem = budgetController.addItem(
            input.type,
            input.description,
            input.value);
        
        //3. Add item to the UI
        UIController.addListItem(newItem, input.type);
        //4. Calc budget
            
        //5. Display budget on UI
    };
        
        return {
            init: function() {
                console.log("App started!");
                setupEventListeners();
            }
        };
    })(budgetController, UIController);
    
    controller.init();
    