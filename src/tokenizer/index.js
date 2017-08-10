var PropTypes = require('prop-types');
var React = require('react');
var Token = require('./token');
var KeyEvent = require('../keyevent');
var Typeahead = require('../typeahead');
var classNames = require('classnames');

function _arraysAreDifferent(array1, array2) {
  if (array1.length != array2.length){
    return true;
  }
  for (var i = array2.length - 1; i >= 0; i--) {
    if (array2[i] !== array1[i]){
      return true;
    }
  }
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
var TypeaheadTokenizer = React.createClass({
  propTypes: {
    name: PropTypes.string,
    options: PropTypes.array,
    customClasses: PropTypes.object,
    allowCustomValues: PropTypes.number,
    defaultSelected: PropTypes.array,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    inputProps: PropTypes.object,
    onTokenRemove: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onTokenAdd: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    filterOption: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    displayOption: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    maxVisible: PropTypes.number,
    defaultClassNames: PropTypes.bool,
    customOptionComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ])
  },

  getInitialState: function() {
    return {
      // We need to copy this to avoid incorrect sharing
      // of state across instances (e.g., via getDefaultProps())
      selected: this.props.defaultSelected.slice(0)
    };
  },

  getDefaultProps: function() {
    return {
      options: [],
      defaultSelected: [],
      customClasses: {},
      allowCustomValues: 0,
      defaultValue: "",
      placeholder: "",
      inputProps: {},
      defaultClassNames: true,
      filterOption: null,
      displayOption: function(token){return token },
      onKeyDown: function(event) {},
      onKeyUp: function(event) {},
      onFocus: function(event) {},
      onBlur: function(event) {},
      onTokenAdd: function() {},
      onTokenRemove: function() {}
    };
  },

  componentWillReceiveProps: function(nextProps){
    // if we get new defaultProps, update selected
    if (_arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)){
      this.setState({selected: nextProps.defaultSelected.slice(0)})
    }
  },

  focus: function(){
    this.refs.typeahead.focus();
  },

  getSelectedTokens: function(){
    return this.state.selected;
  },

  // TODO: Support initialized tokens
  //
  _renderTokens: function() {
    var tokenClasses = {};
    tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
    var classList = classNames(tokenClasses);
    var result = this.state.selected.map(function(selected, index) {
      var displayString = this.props.displayOption(selected);
      return (
        <Token key={ displayString + '_' + index } className={classList}
          onRemove={ this._removeTokenForValue }
          object={selected}
          name={ this.props.name }>
          { displayString }
        </Token>
      );
    }, this);
    return result;
  },

  _getOptionsForTypeahead: function() {
    // return this.props.options without this.selected
    return this.props.options;
  },

  _onKeyDown: function(event) {
    // We only care about intercepting backspaces
    if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
      return this._handleBackspace(event);
    }
    this.props.onKeyDown(event);
  },

  _handleBackspace: function(event){
    // No tokens
    if (!this.state.selected.length) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    var entry = this.refs.typeahead.refs.entry;
    if (entry.selectionStart == entry.selectionEnd &&
        entry.selectionStart == 0) {
      this._removeTokenForValue(
        this.state.selected[this.state.selected.length - 1]);
      event.preventDefault();
    }
  },

  _removeTokenForValue: function(value) {
    var index = this.state.selected.indexOf(value);
    if (index == -1) {
      return;
    }

    this.state.selected.splice(index, 1);
    this.setState({selected: this.state.selected});
    this.props.onTokenRemove(value);
    return;
  },

  _addTokenForValue: function(value) {
    if (this.state.selected.indexOf(value) != -1) {
      return;
    }
    this.state.selected.push(value);
    this.setState({selected: this.state.selected});
    this.refs.typeahead.setEntryText("");
    this.props.onTokenAdd(value);
  },

  render: function() {
    var classes = {};
    classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
    var classList = classNames(classes);
    var tokenizerClasses = [this.props.defaultClassNames && "typeahead-tokenizer"];
    tokenizerClasses[this.props.className] = !!this.props.className;
    var tokenizerClassList = classNames(tokenizerClasses)

    return (
      <div className={tokenizerClassList}>
        { this._renderTokens() }
        <Typeahead ref="typeahead"
          className={classList}
          placeholder={this.props.placeholder}
          inputProps={this.props.inputProps}
          allowCustomValues={this.props.allowCustomValues}
          customClasses={this.props.customClasses}
          customOptionComponent={this.props.customOptionComponent}
          options={this._getOptionsForTypeahead()}
          defaultValue={this.props.defaultValue}
          maxVisible={this.props.maxVisible}
          onOptionSelected={this._addTokenForValue}
          onKeyDown={this._onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          displayOption={this.props.displayOption}
          defaultClassNames={this.props.defaultClassNames}
          filterOption={this.props.filterOption} />
      </div>
    );
  }
});

module.exports = TypeaheadTokenizer;
