'use strict';

var React = require('react'),
    mui = require('material-ui'),
    TextField = mui.TextField;

var ReactPropTypes = React.PropTypes;

var TaskEntry = React.createClass({
  propTypes: {
    onSave: ReactPropTypes.func.isRequired,
    //value: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    return {open: false, text: ''};
  },
  showForm: function() {
    this.setState({open: true}, function() {
      this.refs.theInput.focus();
    });
  },
  hideForm: function() {
    this.setState({open: false});
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSave(this.state.text);
    this.setState({text: ''});
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'task-entry': true,
      'open': this.state.open
    });
    return (
      <div className={classes}>
        <a className="action" onClick={this.showForm}>
          &#43; Add task
        </a>
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <TextField hintText="What do you need to do?"
              onChange={this.onChange}
              onBlur={this.hideForm}
              value={this.state.text}
              style={{
                width: '100%'
              }}
              ref="theInput" />
          </form>
        </div>
      </div>
    );
  }
});


module.exports = TaskEntry;
