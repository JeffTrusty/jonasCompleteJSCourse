/*
// module patern methodology will return an object with all of the functions we want to be public
// Imediately Invoked Function Expression (aka IIFE) is an anonomus (unnamed) function wrapped in ()
var budgetController = (function () {
  var x = 3;
  // this add function is private
  var add = function (a) {
    return x + a;
  }
  return {
    // However, this function is public AND can use the private add function.
    publicTest: function (b) {
      return add(b);
    }
  }
})();

var UIController = (function () {
  // some code
})();

// modules are just functions so we can pass arguments into them.
var controller = (function (budgetCtrl, UICtrl) {

  var z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: function () {
      console.log(z);
    }
  }

})(budgetController, UIController);
*/

// BUDGET Controller
var budgetController = (function () {
  //Code here
});


// UI Controller
var UIController = (function () {
  //Code here
});

// Global app controller
var controller = (function (budgetCtrl, UICtrl) {

  var ctrlAddItem = function () {
    // TODO
    // 1. Get field input data
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget
    console.log('wahoo!')
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);


