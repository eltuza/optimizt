'use strict';

var React = require('react'),
    mui = require('material-ui'),
    Checkbox = mui.Checkbox;

var Task = React.createClass({
  getInitialState: function() {
    return {completed: false};
  },
  // componentDidMount: function() {
  // },
  // componentWillUnmount: function() {
  // },
  setCompleted: function(e, checked) {
    this.setState({
      completed: checked
    });
  },
  render: function() {
    return (
      <div className="task">
        <Checkbox
          name="completed"
          value="completed"
          label=""
          style={{
            width: 'auto',
            display: 'inline-block'
          }}
          onCheck={this.setCompleted}
          className="check" />

        <span className={this.state.completed ? "completed" : ""} >
          {this.props.task}
        </span>
      </div>
    );
  }
});


module.exports = Task;
