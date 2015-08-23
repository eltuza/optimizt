var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
  addTask: function(task){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_TASK,
      task: task
    })
  },
  removeCompleted: function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_COMPLETED
    })
  },
  setCompleted: function(task, isCompleted){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_COMPLETED,
      task: task,
      isCompleted: isCompleted
    })
  },
  indent: function(task, moveForward){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.INDENT,
      task: task,
      moveForward: moveForward
    })
  }
};

module.exports = AppActions;
