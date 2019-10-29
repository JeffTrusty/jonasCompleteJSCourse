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

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }
  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //* create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //* Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //* Push it onto our data stack
      data.allItems[type].push(newItem);

      //* Return the new element
      return newItem;
    },

    testing: function () {
      console.log(data);
    }

  }

})();


// UI Controller
var UIController = (function () {

  //* Get values returned from HTML form input fields
  var DOMInputs = {
    Type: '.add__type',
    Description: '.add__description',
    Amount: '.add__value',
    inputBtn: '.add__btn'
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMInputs.Type).value,  // will be inc or exp
        description: document.querySelector(DOMInputs.Description).value,
        value: document.querySelector(DOMInputs.Amount).value
      };
    },
    getDOMInputs: function () {
      return DOMInputs;
    }
  };

  //* Initial way to get these values. However, the above way is better
  /*
    return {
      getInput: function () {
        return {
          type: document.querySelector('.add__type').value,  // will be inc or exp
          description: document.querySelector('.add__description').value,
          value: document.querySelector('.add__value').value
        };
      }
    };
  */
})();

// Global app controller
var controller = (function (budgetCtrl, UICtrl) {

  //* Event Handler
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMInputs();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });
  };



  var ctrlAddItem = function () {
    var input, newItem;

    // TODO
    // 1. Get field input data
    input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget
  };

  return {
    init: function () {
      console.log('App has started')
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();