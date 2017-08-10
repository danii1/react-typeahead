'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');
var React = require('react');
var TypeaheadSelector = require('./selector');
var KeyEvent = require('../keyevent');
var fuzzy = require('fuzzy');
var classNames = require('classnames');

var IDENTITY_FN = function IDENTITY_FN(input) {
  return input;
};
var SHOULD_SEARCH_VALUE = function SHOULD_SEARCH_VALUE(input) {
  return input && input.trim().length > 0;
};
var _generateAccessor = function _generateAccessor(field) {
  return function (object) {
    return object[field];
  };
};

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */

var Typeahead = function (_React$Component) {
  _inherits(Typeahead, _React$Component);

  function Typeahead() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Typeahead);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Typeahead.__proto__ || Object.getPrototypeOf(Typeahead)).call.apply(_ref, [this].concat(args))), _this), _this.getOptionsForValue = function (value, options) {
      if (!SHOULD_SEARCH_VALUE(value)) {
        return [];
      }
      var filterOptions = _this._generateFilterFunction();
      var result = filterOptions(value, options);
      if (_this.props.maxVisible) {
        result = result.slice(0, _this.props.maxVisible);
      }
      return result;
    }, _this.setEntryText = function (value) {
      _this.refs.entry.value = value;
      _this._onTextEntryUpdated();
    }, _this.focus = function () {
      _this.refs.entry.focus();
    }, _this._hasCustomValue = function () {
      if (_this.props.allowCustomValues > 0 && _this.state.entryValue.length >= _this.props.allowCustomValues && _this.state.visible.indexOf(_this.state.entryValue) < 0) {
        return true;
      }
      return false;
    }, _this._getCustomValue = function () {
      if (_this._hasCustomValue()) {
        return _this.state.entryValue;
      }
      return null;
    }, _this._renderIncrementalSearchResults = function () {
      // Nothing has been entered into the textbox
      if (!_this.state.entryValue) {
        return "";
      }

      // Something was just selected
      if (_this.state.selection) {
        return "";
      }

      return React.createElement(_this2.props.customListComponent, {
        ref: 'sel', options: _this.state.visible,
        onOptionSelected: _this._onOptionSelected,
        customValue: _this._getCustomValue(),
        customClasses: _this.props.customClasses,
        customOptionComponent: _this.props.customOptionComponent,
        selectionIndex: _this.state.selectionIndex,
        defaultClassNames: _this.props.defaultClassNames,
        displayOption: _this._generateOptionToStringFor(_this.props.displayOption) });
    }, _this.getSelection = function () {
      var index = _this.state.selectionIndex;
      if (_this._hasCustomValue()) {
        if (index === 0) {
          return _this.state.entryValue;
        } else {
          index--;
        }
      }
      return _this.state.visible[index];
    }, _this._onOptionSelected = function (option, event) {
      var nEntry = _this.refs.entry;
      nEntry.focus();

      var displayOption = _this._generateOptionToStringFor(_this.props.displayOption);
      var optionString = displayOption(option, 0);

      var formInputOption = _this._generateOptionToStringFor(_this.props.formInputOption || displayOption);
      var formInputOptionString = formInputOption(option);

      nEntry.value = optionString;
      _this.setState({ visible: _this.getOptionsForValue(optionString, _this.props.options),
        selection: formInputOptionString,
        entryValue: optionString });
      return _this.props.onOptionSelected(option, event);
    }, _this._onTextEntryUpdated = function () {
      var value = _this.refs.entry.value;
      _this.setState({ visible: _this.getOptionsForValue(value, _this.props.options),
        selection: null,
        entryValue: value });
    }, _this._onEnter = function (event) {
      var selection = _this.getSelection();
      if (!selection) {
        return _this.props.onKeyDown(event);
      }
      return _this._onOptionSelected(selection, event);
    }, _this._onEscape = function () {
      _this.setState({
        selectionIndex: null
      });
    }, _this._onTab = function (event) {
      var selection = _this.getSelection();
      var option = selection ? selection : _this.state.visible.length > 0 ? _this.state.visible[0] : null;

      if (option === null && _this._hasCustomValue()) {
        option = _this._getCustomValue();
      }

      if (option !== null) {
        return _this._onOptionSelected(option, event);
      }
    }, _this.eventMap = function (event) {
      var events = {};

      events[KeyEvent.DOM_VK_UP] = _this.navUp;
      events[KeyEvent.DOM_VK_DOWN] = _this.navDown;
      events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = _this._onEnter;
      events[KeyEvent.DOM_VK_ESCAPE] = _this._onEscape;
      events[KeyEvent.DOM_VK_TAB] = _this._onTab;

      return events;
    }, _this._nav = function (delta) {
      if (!_this._hasHint()) {
        return;
      }
      var newIndex = _this.state.selectionIndex === null ? delta == 1 ? 0 : delta : _this.state.selectionIndex + delta;
      var length = _this.state.visible.length;
      if (_this._hasCustomValue()) {
        length += 1;
      }

      if (newIndex < 0) {
        newIndex += length;
      } else if (newIndex >= length) {
        newIndex -= length;
      }

      _this.setState({ selectionIndex: newIndex });
    }, _this.navDown = function () {
      _this._nav(1);
    }, _this.navUp = function () {
      _this._nav(-1);
    }, _this._onChange = function (event) {
      if (_this.props.onChange) {
        _this.props.onChange(event);
      }

      _this._onTextEntryUpdated();
    }, _this._onKeyDown = function (event) {
      // If there are no visible elements, don't perform selector navigation.
      // Just pass this up to the upstream onKeydown handler.
      // Also skip if the user is pressing the shift key, since none of our handlers are looking for shift
      if (!_this._hasHint() || event.shiftKey) {
        return _this.props.onKeyDown(event);
      }

      var handler = _this.eventMap()[event.keyCode];

      if (handler) {
        handler(event);
      } else {
        return _this.props.onKeyDown(event);
      }
      // Don't propagate the keystroke back to the DOM/browser
      event.preventDefault();
    }, _this._renderHiddenInput = function () {
      if (!_this.props.name) {
        return null;
      }

      return React.createElement('input', {
        type: 'hidden',
        name: _this.props.name,
        value: _this.state.selection
      });
    }, _this._generateFilterFunction = function () {
      var filterOptionProp = _this.props.filterOption;
      if (typeof filterOptionProp === 'function') {
        return function (value, options) {
          return options.filter(function (o) {
            return filterOptionProp(value, o);
          });
        };
      } else {
        var mapper;
        if (typeof filterOptionProp === 'string') {
          mapper = _generateAccessor(filterOptionProp);
        } else {
          mapper = IDENTITY_FN;
        }
        return function (value, options) {
          return fuzzy.filter(value, options, { extract: mapper }).map(function (res) {
            return options[res.index];
          });
        };
      }
    }, _this._generateOptionToStringFor = function (prop) {
      if (typeof prop === 'string') {
        return _generateAccessor(prop);
      } else if (typeof prop === 'function') {
        return prop;
      } else {
        return IDENTITY_FN;
      }
    }, _this._hasHint = function () {
      return _this.state.visible.length > 0 || _this._hasCustomValue();
    }, _this.state = {
      // The currently visible set of options
      visible: _this.getOptionsForValue(_this.props.defaultValue, _this.props.options),

      // This should be called something else, "entryValue"
      entryValue: _this.props.value || _this.props.defaultValue,

      // A valid typeahead value
      selection: _this.props.value,

      // Index of the selection
      selectionIndex: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Typeahead, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        visible: this.getOptionsForValue(this.state.entryValue, nextProps.options)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var inputClasses = {};
      inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
      var inputClassList = classNames(inputClasses);

      var classes = {
        typeahead: this.props.defaultClassNames
      };
      classes[this.props.className] = !!this.props.className;
      var classList = classNames(classes);

      var InputElement = this.props.textarea ? 'textarea' : 'input';

      return React.createElement(
        'div',
        { className: classList },
        this._renderHiddenInput(),
        React.createElement(InputElement, _extends({ ref: 'entry', type: 'text'
        }, this.props.inputProps, {
          placeholder: this.props.placeholder,
          className: inputClassList,
          value: this.state.entryValue,
          defaultValue: this.props.defaultValue,
          onChange: this._onChange,
          onKeyDown: this._onKeyDown,
          onKeyUp: this.props.onKeyUp,
          onFocus: this.props.onFocus,
          onBlur: this.props.onBlur
        })),
        this._renderIncrementalSearchResults()
      );
    }
  }]);

  return Typeahead;
}(React.Component);

Typeahead.propTypes = {
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
  filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  formInputOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  defaultClassNames: PropTypes.bool,
  customListComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  customOptionComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
Typeahead.defaultProps = {
  options: [],
  customClasses: {},
  allowCustomValues: 0,
  defaultValue: "",
  value: null,
  placeholder: "",
  textarea: false,
  inputProps: {},
  onOptionSelected: function onOptionSelected(option) {},
  onChange: function onChange(event) {},
  onKeyDown: function onKeyDown(event) {},
  onKeyUp: function onKeyUp(event) {},
  onFocus: function onFocus(event) {},
  onBlur: function onBlur(event) {},
  filterOption: null,
  defaultClassNames: true,
  customListComponent: TypeaheadSelector
};


module.exports = Typeahead;