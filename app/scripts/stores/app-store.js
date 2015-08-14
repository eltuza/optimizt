var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _tasks = [];

for(var i=1; i<5; i++){
  _tasks.push({
    'id': i,
    'name':'Task #' + i,
    'complete': false,
    'parent': null,
    'children': []
  });
}


function _removeCompleted(index) {

}

function _setParent(index) {

}

function _setCompleted(task, isCompleted) {
  // task.complete = isCompleted;
  _applyToAll(task, function() {
    this.complete = isCompleted;
  })
}

function _getTask(index) {
  return _findInArr(index, _tasks);
}

function _findInArr(id, arr) {
  for (var i=0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return arr[i];
    } else {
      var childrenFound = _findInArr(id, arr[i].children);
      if (childrenFound) return childrenFound;
    }
  }
  return false;
}

function _applyToAll(obj, action) {
  action.call(obj);

  for (var i=0; i < obj.children.length; i++) {
    _applyToAll(action.call(obj.children[i], action));
  }
}


function _addTask(task){
  console.log("task added", task);
  _tasks.push(task);
  console.log(_tasks);
}

// function _cartTotals(){
//   var qty =0, total = 0;
//   _cartItems.forEach(function(cartItem){
//     qty+=cartItem.qty;
//     total+=cartItem.qty*cartItem.cost;
//   });
//   return {'qty': qty, 'total': total};
// }

var AppStore = assign(EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  getTasks: function(){
    return _tasks
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action; // this is the action from handleViewAction
    switch(action.actionType){
      case AppConstants.ADD_TASK:
        _addTask(payload.action.task);
        break;

      case AppConstants.REMOVE_COMPLETED:
        _removeCompleted(payload.action.index);
        break;

      case AppConstants.SET_COMPLETED:
        _setCompleted(payload.action.task, payload.action.isCompleted);
        break;

      case AppConstants.SET_PARENT:
        _setParent(payload.action.index);
        break;
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
