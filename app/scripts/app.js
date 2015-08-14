
var React = window.React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    Task = require('./ui/Task.js'),
    TaskEntry = require('./ui/TaskEntry.js'),
    AppBar =  mui.AppBar,
    FlatButton = mui.FlatButton,
    mountNode = document.getElementById("optimizt");

var AppStore = require('./stores/app-store.js');
var AppActions = require('./actions/app-actions');

// The Following code is for Material UI (Material Design) to work.
var injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap. Can go away when react 1.0 release
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

function getTasks(){
  return {items: AppStore.getTasks()}
}


var TodoApp = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getInitialState: function() {
    return getTasks();
  },
  _saveTask: function(taskName) {
    // var nextItems = this.state.items.concat([taskName]);
    // this.setState({items: nextItems});
    AppActions.addTask({'name': taskName});
  },
  componentWillMount: function() {
    AppStore.addChangeListener(this._onChange)
  },
  onClearCompleted: function(e) {
    AppActions.removeCompleted();
  },
  _onChange: function(){
    this.setState(getTasks())
  },
  render: function() {
    var tasks = this.state.items.map(function(task){
      return (
        <Task key={task.id} task={task} />
      );
    })

    return (
      <div className="main">
        <AppBar
            title="Tasks"
            ref="appbar"
            iconElementRight={
              <FlatButton onTouchTap={this.onClearCompleted} label="Remove completed" />
            }>
        </AppBar>

        { tasks }

        <TaskEntry onSave={this._saveTask} />
      </div>
    );
  }
});


React.render(<TodoApp />, mountNode);

