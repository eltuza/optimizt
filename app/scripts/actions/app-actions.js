var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
  addTask: function(task){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_TASK,
      task: task
    })
  },
  removeCompleted: function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_COMPLETED,
      index: index
    })
  },
  setCompleted: function(task, isCompleted){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_COMPLETED,
      task: task,
      isCompleted: isCompleted
    })
  },
  setParent: function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_PARENT,
      index: index
    })
  }
};

module.exports = AppActions;
