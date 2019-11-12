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
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    };

    Expense.prototype.getPercentage = function () {
      return this.percentage;
    };

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

    deleteItem: function (type, id) {
      var ids, index
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id); // returns the index where the value passed resides
      if (index !== -1) {
        data.allItems[type].splice(index, 1); // splice method removes items from an array
      }
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
      //console.log(data.percentage);
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
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
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function (num, type) {
    // + or -, 2 decimal points, comma separator
    var numSplit, int, dec, type;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.')
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }
    dec = numSplit[1];

    return (type === 'exp' ? '- ' : '+ ') + int + '.' + dec;
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMInputs.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      var type;
      obj.budget >= 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMInputs.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMInputs.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMInputs.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMInputs.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMInputs.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMInputs.expensesPercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = percentages[index] + '---';
        }
      });
    },

    displayMonth: function () {
      var now, year, month, months
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      document.querySelector(DOMInputs.dateLabel).textContent = months[month] + '-' + year;
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMInputs.Type + ',' +
        DOMInputs.Description + ',' +
        DOMInputs.Amount);

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMInputs.inputBtn).classList.toggle('red');
    },

    getDOMInputs: function () {
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
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.Type).addEventListener('change', UICtrl.changedType);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

  };

  var updatePercentages = function () {
    // calc percentages
    budgetCtrl.calculatePercentages();
    // read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
    //console.log(percentages);


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
      updatePercentages();
    };
};

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);  // convert string to Int
      // Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // Update and show the new budget
      updateBudget();
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('App has started')
      UICtrl.displayMonth();
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
