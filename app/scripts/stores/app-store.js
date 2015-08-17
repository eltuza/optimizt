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


function _removeCompleted(taskArray) {
  var filteredTasks = taskArray.filter(function(task) {
    if (task.complete) {
      return false;
    }

    // Apply recursively to children.
    if (task.children) {
      task.children = _removeCompleted(task.children);
    }

    return true;
  });

  return filteredTasks;
}

function _setParent(index) {

}

function _setCompleted(task, isCompleted) {
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

  if (obj.children) {
    for (var i=0; i < obj.children.length; i++) {
      _applyToAll(obj.children[i], action);
    }
  }
}

function _getParentId(indentation) {
  var lastTask = _tasks[_tasks.length - 1];

  if (!indentation) {
    return null;
  }

  if (indentation > 1) {
    while (indentation-- && lastTask.children && lastTask.children.length) {
      lastTask = lastTask.children[lastTask.children.length - 1];
    }
  }

  return lastTask.id;
}

function _addTask(task){
  console.log("task added", task);
  var parent = _findInArr(task.parent, _tasks);
  parent ? parent.children.push(task) : _tasks.push(task);
}

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
  /**
   * Helps determine the indentation levels that the TaskEntry can take.
   */
  getLastIndentationLevel: function() {
    var indentation = 0;
    var lastTask = _tasks[_tasks.length - 1];
    while (lastTask.children && lastTask.children.length) {
      lastTask = lastTask.children[lastTask.children.length - 1];
      indentation++;
    }
    return indentation;
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action; // this is the action from handleViewAction
    switch(action.actionType){
      case AppConstants.ADD_TASK:
        var parentId = _getParentId(payload.action.task.indentation);
        var task = {
          'id': payload.action.task.id,
          'name':'Task #' + payload.action.task.id,
          'complete': false,
          'parent': parentId,
          'indentation': payload.action.task.indentation,
          'children': []
        };
        _addTask(task);
        break;

      case AppConstants.REMOVE_COMPLETED:
        _tasks = _removeCompleted(_tasks);
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
