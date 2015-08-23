var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';


var _tasks = [];


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

function _indent(task, moveForward) {

}

function _setCompleted(task, isCompleted) {
  _applyToAll(task, function() {
    this.complete = isCompleted;
  })
}

function _getTask(id) {
  return _findInArr(id, _tasks, function(arr, i) {
    return arr[i];
  });
}

function _getImmediatePrecedingSibling(id) {
  return _findInArr(id, _tasks, function(arr, i) {
    if (i) {
      return arr[i];
    }
    return null;
  });
}

function _findInArr(id, arr, returnFunc) {
  for (var i=0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return returnFunc(arr, i);
    } else {
      var childrenFound = _findInArr(id, arr[i].children, returnFunc);
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

/**
 * Seek into task hierarchy for the last element up to the given indentation level.
 * Returns the parent id of the last task where a newly created task through
 * TaskEntry should be appended.
 */
function _getLastTaskParentId(indentation) {
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

function _indent(task, moveForward) {
  if (moveForward) {
    _reparentTask(task, _getImmediatePrecedingSibling(task.id));
  } else {
    var oldParent = _getTask(task.parent, _tasks);
    var newParent = _getTask(oldParent.parent, _tasks);
    _reparentTask(task, newParent || null, oldParent);
  }
}

function _reparentTask(task, parent, afterSibling) {
  var siblingsArray;
  if (parent) {
    _removeTaskFromArray(task, parent.children);
    task.parent = parent.id;
    siblingsArray = parent.children;
  } else {
    _removeTaskFromArray(task, _tasks);
    task.parent = null;
    siblingsArray = _tasks;
  }

  if (afterSibling) {
    for(var i = 0; i < siblingsArray.length; i++) {
      if (afterSibling.id == siblingsArray[i].id) {
        siblingsArray.splice(i+1, 0, task);
      }
    }
  } else {
    siblingsArray.push(task);
  }
}

function _removeTaskFromArray(task, arr) {
  arr.filter(function(taskObj) {
    return taskObj.id != task.id;
  })
}

function _addTask(task){
  var parent = _getTask(task.parent, _tasks);
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
  /**
   * Returns the parent ID under which the current element can be indented or
   * null if it can't be indented.
   */
  getIndentParent: function(id) {
    var sibling = _getImmediatePrecedingSibling(id);
    if (sibling) {
      return sibling.id;
    }
    return 0;
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action;
    switch(action.actionType){
      case AppConstants.ADD_TASK:
        var parentId = _getLastTaskParentId(payload.action.task.indentation);
        var task = payload.action.task;
        task['complete'] = false;
        task['children'] = [];
        task['parent'] = parentId;
        _addTask(task);
        break;

      case AppConstants.REMOVE_COMPLETED:
        _tasks = _removeCompleted(_tasks);
        break;

      case AppConstants.SET_COMPLETED:
        _setCompleted(payload.action.task, payload.action.isCompleted);
        break;

      case AppConstants.INDENT:
        _indent(payload.action.task, payload.action.moveForward);
        break;
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
