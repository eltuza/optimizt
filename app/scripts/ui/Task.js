'use strict';

var React = require('react'),
    mui = require('material-ui'),
    Checkbox = mui.Checkbox;

var AppActions = require('../actions/app-actions');

var Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },
  // componentDidMount: function() {
  // },
  // componentWillUnmount: function() {
  // },
  getInitialState: function() {
    return {
      contracted: false
    }
  },

  /**
   * Toggles the contracted state.
   * @param {MouseEvent} e The click event.
   */
  toggleDropdown: function(e) {
    this.setState({
      contracted: !this.state.contracted
    })
  },
  setCompleted: function(e, checked) {
    AppActions.setCompleted(this.props.task, checked);
  },

  hasChildren: function() {
    return this.props.task.children && this.props.task.children.length;
  },

  render: function() {
    var children = '';

    if(this.props.task.children) {
      children = this.props.task.children.map(function (childTask) {
        return (
          <Task key={childTask.id} task={childTask} />
        );
      });
    }

    return (
      <div className={this.state.contracted ? "task-container contracted" : "task-container"}>
        <div className="task">
          <a className={this.hasChildren() ? "handle" : "handle hidden"} onClick={this.toggleDropdown}>&rsaquo;</a>
          <Checkbox
            name="completed"
            value="completed"
            defaultChecked={this.props.task.complete}
            style={{
              width: 'auto',
              display: 'inline-block'
            }}
            id={ this.props.task.id }
            onCheck={this.setCompleted}
            className="check" />

          <label htmlFor={ this.props.task.id } className={this.props.task.complete ? "completed" : ""} >
            {this.props.task.name}
          </label>
        </div>
        <div className="children" ref="children">
          { children }
        </div>
      </div>
    );
  }
});


module.exports = Task;
