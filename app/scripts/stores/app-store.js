var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';


var _tasks = [];


/**
 * Recursively search through map hierarchy to find a task for the given @id.
 */
function _getTask(id) {
  return _findInArr(id, _tasks, function(arr, i) {
    return arr[i];
  });
}

function _getImmediatePrecedingSibling(id) {
  return _findInArr(id, _tasks, function(arr, i) {
    if (i) {
      return arr[i-1];
    }
    return null;
  });
}

/**
 * Recursively search through @arr for the element with the id property that
 * equals @id, and apply the @returnFunc to the found element.
 */
function _findInArr(id, arr, returnFunc) {
  for (var i=0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return returnFunc(arr, i);
    } else {
      var childrenFound = _findInArr(id, arr[i].children, returnFunc);
      if (childrenFound) return childrenFound;
    }
  }
  return null;
}

/**
 * Applies @action function to @task and all its children.
 */
function _applyToAll(task, action) {
  action.call(task);

  if (task.children) {
    for (var i=0; i < task.children.length; i++) {
      _applyToAll(task.children[i], action);
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

/**
 * Handles both indent and unindent action depending on @moveForward value.
 */
function _indent(task, moveForward) {
  var oldParent = _getTask(task.parent, _tasks);
  if (moveForward) {
    var upperSibling = _getImmediatePrecedingSibling(task.id);
    _reparentTask(task, upperSibling);
  } else {
    var newParent = _getTask(oldParent.parent, _tasks);
    _reparentTask(task, newParent, oldParent);
  }
}

/**
 * Given a @task, it will remove it from the current position and reparent it
 * to be child of @parent and optionally inserted after @afterSibling.
 * @param {Object} task The task to be reparented.
 * @param {Object} parent The parent
 * @param {Object} afterSibling The sibling after which it should be inserted.
 */
function _reparentTask(task, parent, afterSibling) {
  var siblingsArray;
  if (parent) {
    task.parent = parent.id;
    siblingsArray = parent.children;
  } else {
    task.parent = null;
    siblingsArray = _tasks;
  }

  // First remove the current action from the outdated position in the array.
  _removeTaskFromArray(task, siblingsArray);

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

/**
 * Recursively search the @arr array and remove the @task item.
 */
function _removeTaskFromArray(task, arr) {
  _findInArr(task.id, _tasks, function(arr, i) {
    arr.splice(i, 1);
  });
}

/**
 * Adds a @task to the tasks list.
 */
function _addTask(task){
  var parent = _getTask(task.parent, _tasks);
  parent ? parent.children.push(task) : _tasks.push(task);
}

/**
 * Removes all completed tasks from the @taskArray
 */
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

function _setCompleted(task, isCompleted) {
  _applyToAll(task, function() {
    this.complete = isCompleted;
  })
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
      // Create a task object and dispatch the task creation action.
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
