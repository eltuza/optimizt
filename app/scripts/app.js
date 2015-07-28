
var React = window.React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    Task = require('./ui/Task.js'),
    TaskEntry = require('./ui/TaskEntry.js'),
    mountNode = document.getElementById("optimizt");

// The Following code is for Material UI (Material Design) to work.
var injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap. Can go away when react 1.0 release
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


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
    return {
      items: ["Example task 1"]
    };
  },
  _saveTask: function(taskName) {
    var nextItems = this.state.items.concat([taskName]);
    this.setState({items: nextItems});
  },
  render: function() {
    var todos = [];
    for (var i = 0; i < this.state.items.length; i++) {
      todos.push(<Task task={this.state.items[i]} />);
    }

    return (
      <div className="main">
        {todos}

        <TaskEntry onSave={this._saveTask} />
      </div>
    );
  }
});


React.render(<TodoApp />, mountNode);

