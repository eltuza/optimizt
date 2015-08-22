'use strict';

var React = require('react'),
    mui = require('material-ui'),
    TextField = mui.TextField;

var AppStore = require('../stores/app-store.js'),
    AppActions = require('../actions/app-actions.js');

var TAB_KEYCODE = 9;
var INPUT_PLACEHOLDER = "What do you need to do?";


var TaskEntry = React.createClass({
  getInitialState: function() {
    return {open: false, text: '', indentation: 0};
  },
  /**
   * Called when the user clicks on the Add Task action.
   */
  showForm: function() {
    this.setState({open: true}, function() {
      this.refs.taskInput.focus();
    });
  },
  /**
   * Delays the hiding of the task entry form.
   */
  hideForm: function() {
    var that = this;
    this.setState(that.getInitialState());
    // TODO(mfarias): Add transition to hide slowly
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  /**
   * Handles the task entry submission.
   */
  handleSubmit: function(e) {
    e.preventDefault();

    if (this.state.text.trim() == '') {
      this.refs.taskInput.setErrorText("You must enter a task name");
      return;
    }

    AppActions.addTask({
      'id': this.generateTaskId(),
      'name': this.state.text,
      'indentation': this.state.indentation
    });

    this.setState({text: ''});
  },
  /**
   * Generates a 5 digit random ID for a task.
   */
  generateTaskId: function() {
    return Math.floor(Math.random() * 90000) + 10000;
  },
  /**
   * Listens for indentation chars and sets state.
   */
  _onKeyDown: function(e) {
    var indentation;
    if (this.state.open && e.keyCode === TAB_KEYCODE) {
      e.preventDefault();

      if (e.shiftKey) {
        indentation = this.state.indentation <= 1 ? 0 : this.state.indentation - 1;
        this.setState({indentation: indentation});
      } else {
        var maxAllowedIndentation = AppStore.getLastIndentationLevel() + 1;
        indentation = this.state.indentation + 1;
        indentation = indentation > maxAllowedIndentation ? maxAllowedIndentation : indentation;
        this.setState({indentation: indentation});
      }
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'task-entry': true,
      'open': this.state.open,
    });

    var st = {
      "margin-left": 30 * this.state.indentation + "px"
    };


    return (
      <div className={classes} >
        <div className="add">
          <a className="action" onClick={this.showForm}>
            &#43; Add task
          </a>

          <div className="form" style={st}>
            <form onSubmit={this.handleSubmit}>
              <TextField hintText={INPUT_PLACEHOLDER}
                onChange={this.onChange}
                onBlur={this.hideForm}
                onKeyDown={this._onKeyDown}
                value={this.state.text}
                style={{width: '100%'}}
                ref="taskInput" />
            </form>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = TaskEntry;
