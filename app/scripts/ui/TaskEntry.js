'use strict';

var React = require('react'),
    mui = require('material-ui'),
    TextField = mui.TextField;

var ReactPropTypes = React.PropTypes;

var TAB_KEYCODE = 9;


var TaskEntry = React.createClass({
  propTypes: {
    onSave: ReactPropTypes.func.isRequired,
    // value: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    return {open: false, text: '', child: false};
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
    setTimeout(function() {
      that.setState(that.getInitialState());
    }, 400);
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

    this.props.onSave(this.state.text);
    this.setState({text: ''});
  },
  /**
   * Listens for indentation chars and sets state.
   */
  _onKeyDown: function(e) {
    if (e.keyCode === TAB_KEYCODE) {
      e.preventDefault();
      if (e.shiftKey) {
        this.setState({child: false});
      } else {
        this.setState({child: true});
      }
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'task-entry': true,
      'open': this.state.open,
      'child': this.state.child
    });

    return (
      <div className={classes}>
        <div className="add">
          <a className="action" onClick={this.showForm}>
            &#43; Add task
          </a>

          <div className="form">
            <form onSubmit={this.handleSubmit}>
              <TextField hintText="What do you need to do?"
                onChange={this.onChange}
                onBlur={this.hideForm}
                onKeyDown={this._onKeyDown}
                value={this.state.text}
                style={{
                  width: '100%'
                }}
                ref="taskInput" />
            </form>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = TaskEntry;
