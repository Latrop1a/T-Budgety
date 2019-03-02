let budgetController = (function() {

  let x = 23;
  
  let add = function(a) {
    return x + a;
  };

  return {
    publicAdd: function(b) {
      console.log(add(b));
    }
  };
})();



let UIController = (function() {

 
})();



let controller = (function(budgetCtrl, UICtrl) {

  budgetCtrl.publicAdd(5);

})(budgetController, UIController);


