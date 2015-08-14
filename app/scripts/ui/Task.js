'use strict';

var React = require('react'),
    mui = require('material-ui'),
    Checkbox = mui.Checkbox;

var UniqeIdMixin = require('unique-id-mixin');

var AppActions = require('../actions/app-actions');

var Task = React.createClass({
  mixins: [ UniqeIdMixin ],
  propTypes: {
    task: React.PropTypes.object.isRequired
  },
  // componentDidMount: function() {
  // },
  // componentWillUnmount: function() {
  // },
  setCompleted: function(e, checked) {
    AppActions.setCompleted(this.props.task, checked);
  },

  render: function() {
    return (
      <div className="task">
        <Checkbox
          name="completed"
          value="completed"
          style={{
            width: 'auto',
            display: 'inline-block'
          }}
          id={ this.getNextHtmlFor() }
          onCheck={this.setCompleted}
          className="check" />

        <label htmlFor={ this.getNextHtmlFor() } className={this.props.task.complete ? "completed" : ""} >
          {this.props.task.name}
        </label>
      </div>
    );
  }
});


module.exports = Task;
