var PropTypes = require('prop-types');
var React = require('react');
var TypeaheadSelector = require('./selector');
var KeyEvent = require('../keyevent');
var fuzzy = require('fuzzy');
var classNames = require('classnames');

var IDENTITY_FN = function(input) { return input; };
var SHOULD_SEARCH_VALUE = function(input) { return input && input.trim().length > 0; };
var _generateAccessor = function(field) {
  return function(object) { return object[field]; };
};

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
class Typeahead extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    customClasses: PropTypes.object,
    maxVisible: PropTypes.number,
    options: PropTypes.array,
    allowCustomValues: PropTypes.number,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    textarea: PropTypes.bool,
    inputProps: PropTypes.object,
    onOptionSelected: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
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
    formInputOption: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    defaultClassNames: PropTypes.bool,
    customListComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    customOptionComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ])
  };

  static defaultProps = {
    options: [],
    customClasses: {},
    allowCustomValues: 0,
    defaultValue: "",
    value: null,
    placeholder: "",
    textarea: false,
    inputProps: {},
    onOptionSelected: function(option) {},
    onChange: function(event) {},
    onKeyDown: function(event) {},
    onKeyUp: function(event) {},
    onFocus: function(event) {},
    onBlur: function(event) {},
    filterOption: null,
    defaultClassNames: true,
    customListComponent: TypeaheadSelector
  };

  getOptionsForValue = (value, options) => {
    if (!SHOULD_SEARCH_VALUE(value)) { return []; }
    var filterOptions = this._generateFilterFunction();
    var result = filterOptions(value, options);
    if (this.props.maxVisible) {
      result = result.slice(0, this.props.maxVisible);
    }
    return result;
  };

  setEntryText = (value) => {
    this.refs.entry.value = value;
    this._onTextEntryUpdated();
  };

  focus = () => {
    this.refs.entry.focus()
  };

  _hasCustomValue = () => {
    if (this.props.allowCustomValues > 0 &&
      this.state.entryValue.length >= this.props.allowCustomValues &&
      this.state.visible.indexOf(this.state.entryValue) < 0) {
      return true;
    }
    return false;
  };

  _getCustomValue = () => {
    if (this._hasCustomValue()) {
      return this.state.entryValue;
    }
    return null;
  };

  _renderIncrementalSearchResults = () => {
    // Nothing has been entered into the textbox
    if (!this.state.entryValue) {
      return "";
    }

    // Something was just selected
    if (this.state.selection) {
      return "";
    }

    return (
      <this.props.customListComponent
        ref="sel" options={this.state.visible}
        onOptionSelected={this._onOptionSelected}
        customValue={this._getCustomValue()}
        customClasses={this.props.customClasses}
        customOptionComponent={this.props.customOptionComponent}
        selectionIndex={this.state.selectionIndex}
        defaultClassNames={this.props.defaultClassNames}
        displayOption={this._generateOptionToStringFor(this.props.displayOption)} />
    );
  };

  getSelection = () => {
    var index = this.state.selectionIndex;
    if (this._hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      } else {
        index--;
      }
    }
    return this.state.visible[index];
  };

  _onOptionSelected = (option, event) => {
    var nEntry = this.refs.entry;
    nEntry.focus();

    var displayOption = this._generateOptionToStringFor(this.props.displayOption);
    var optionString = displayOption(option, 0);

    var formInputOption = this._generateOptionToStringFor(this.props.formInputOption || displayOption);
    var formInputOptionString = formInputOption(option);

    nEntry.value = optionString;
    this.setState({visible: this.getOptionsForValue(optionString, this.props.options),
                   selection: formInputOptionString,
                   entryValue: optionString});
    return this.props.onOptionSelected(option, event);
  };

  _onTextEntryUpdated = () => {
    var value = this.refs.entry.value;
    this.setState({visible: this.getOptionsForValue(value, this.props.options),
                   selection: null,
                   entryValue: value});
  };

  _onEnter = (event) => {
    var selection = this.getSelection();
    if (!selection) {
      return this.props.onKeyDown(event);
    }
    return this._onOptionSelected(selection, event);
  };

  _onEscape = () => {
    this.setState({
      selectionIndex: null
    });
  };

  _onTab = (event) => {
    var selection = this.getSelection();
    var option = selection ?
      selection : (this.state.visible.length > 0 ? this.state.visible[0] : null);

    if (option === null && this._hasCustomValue()) {
      option = this._getCustomValue();
    }

    if (option !== null) {
      return this._onOptionSelected(option, event);
    }
  };

  eventMap = (event) => {
    var events = {};

    events[KeyEvent.DOM_VK_UP] = this.navUp;
    events[KeyEvent.DOM_VK_DOWN] = this.navDown;
    events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this._onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
    events[KeyEvent.DOM_VK_TAB] = this._onTab;

    return events;
  };

  _nav = (delta) => {
    if (!this._hasHint()) {
      return;
    }
    var newIndex = this.state.selectionIndex === null ? (delta == 1 ? 0 : delta) : this.state.selectionIndex + delta;
    var length = this.state.visible.length;
    if (this._hasCustomValue()) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    this.setState({selectionIndex: newIndex});
  };

  navDown = () => {
    this._nav(1);
  };

  navUp = () => {
    this._nav(-1);
  };

  _onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    this._onTextEntryUpdated();
  };

  _onKeyDown = (event) => {
    // If there are no visible elements, don't perform selector navigation.
    // Just pass this up to the upstream onKeydown handler.
    // Also skip if the user is pressing the shift key, since none of our handlers are looking for shift
    if (!this._hasHint() || event.shiftKey) {
      return this.props.onKeyDown(event);
    }

    var handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return this.props.onKeyDown(event);
    }
    // Don't propagate the keystroke back to the DOM/browser
    event.preventDefault();
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: this.getOptionsForValue(this.state.entryValue, nextProps.options)
    });
  }

  render() {
    var inputClasses = {};
    inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
    var inputClassList = classNames(inputClasses);

    var classes = {
      typeahead: this.props.defaultClassNames
    };
    classes[this.props.className] = !!this.props.className;
    var classList = classNames(classes);

    var InputElement = this.props.textarea ? 'textarea' : 'input';

    return (
      <div className={classList}>
        { this._renderHiddenInput() }
        <InputElement ref="entry" type="text"
          {...this.props.inputProps}
          placeholder={this.props.placeholder}
          className={inputClassList}
          value={this.state.entryValue}
          defaultValue={this.props.defaultValue}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        { this._renderIncrementalSearchResults() }
      </div>
    );
  }

  _renderHiddenInput = () => {
    if (!this.props.name) {
      return null;
    }

    return (
      <input
        type="hidden"
        name={ this.props.name }
        value={ this.state.selection }
      />
    );
  };

  _generateFilterFunction = () => {
    var filterOptionProp = this.props.filterOption;
    if (typeof filterOptionProp === 'function') {
      return function(value, options) {
        return options.filter(function(o) { return filterOptionProp(value, o); });
      };
    } else {
      var mapper;
      if (typeof filterOptionProp === 'string') {
        mapper = _generateAccessor(filterOptionProp);
      } else {
        mapper = IDENTITY_FN;
      }
      return function(value, options) {
        return fuzzy
          .filter(value, options, {extract: mapper})
          .map(function(res) { return options[res.index]; });
      };
    }
  };

  _generateOptionToStringFor = (prop) => {
    if (typeof prop === 'string') {
      return _generateAccessor(prop);
    } else if (typeof prop === 'function') {
      return prop;
    } else {
      return IDENTITY_FN;
    }
  };

  _hasHint = () => {
    return this.state.visible.length > 0 || this._hasCustomValue();
  };

  state = {
    // The currently visible set of options
    visible: this.getOptionsForValue(this.props.defaultValue, this.props.options),

    // This should be called something else, "entryValue"
    entryValue: this.props.value || this.props.defaultValue,

    // A valid typeahead value
    selection: this.props.value,

    // Index of the selection
    selectionIndex: null
  };
}

module.exports = Typeahead;
