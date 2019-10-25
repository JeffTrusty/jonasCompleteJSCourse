/*
// module pattern methodology will return an object with all of the functions we want to be public
// Immediately Invoked Function Expression (aka IIFE) is an anonymous (unnamed) function wrapped in ()
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

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
      },
      budget: 0,
      percentage: -1
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

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget:  income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage  of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      console.log(data.percentage);
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () {
      console.log(data);
    }

  };

})();


// UI Controller
var UIController = (function () {

  //* Get values returned from HTML form input fields
  var DOMInputs = {
    Type: '.add__type',
    Description: '.add__description',
    Amount: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMInputs.Type).value,  // will be inc or exp
        description: document.querySelector(DOMInputs.Description).value,
        value: parseFloat(document.querySelector(DOMInputs.Amount).value)
      };
    },
  //* Initial way to get the input values. However, the above way is better
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

    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMInputs.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMInputs.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function () {
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMInputs.Description + ', ' + DOMInputs.Amount);
      // convert the list returned by querySelectorAll to an array
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function (current, i, array) {
        current.value = "";
      });
      fieldsArray[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMInputs.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMInputs.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMInputs.expenseLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMInputs.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMInputs.percentageLabel).textContent = '---';
      }
    },

    getDOMInputs: function() {
      return DOMInputs;
    }
  };

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
  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

  };


  var ctrlAddItem = function () {
    var input, newItem;

    // 1. Get field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the input fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
  }
};

  return {
    init: function () {
      console.log('App has started')
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
