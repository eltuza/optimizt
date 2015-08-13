'use strict';

var React = require('react'),
    mui = require('material-ui'),
    Checkbox = mui.Checkbox;

var ReactPropTypes = React.PropTypes;
var UniqeIdMixin = require('unique-id-mixin');

var Task = React.createClass({
  mixins: [ UniqeIdMixin ],
  propTypes: {
    task: ReactPropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {completed: false, children: []};
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
          style={{
            width: 'auto',
            display: 'inline-block'
          }}
          id={ this.getNextHtmlFor() }
          onCheck={this.setCompleted}
          className="check" />

        <label htmlFor={ this.getNextHtmlFor() } className={this.state.completed ? "completed" : ""} >
          {this.props.task}
        </label>
      </div>
    );
  }
});


module.exports = Task;
