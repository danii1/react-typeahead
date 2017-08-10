'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');
var React = require('react');
var Token = require('./token');
var KeyEvent = require('../keyevent');
var Typeahead = require('../typeahead');
var classNames = require('classnames');

function _arraysAreDifferent(array1, array2) {
  if (array1.length != array2.length) {
    return true;
  }
  for (var i = array2.length - 1; i >= 0; i--) {
    if (array2[i] !== array1[i]) {
      return true;
    }
  }
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */

var TypeaheadTokenizer = function (_React$Component) {
  _inherits(TypeaheadTokenizer, _React$Component);

  function TypeaheadTokenizer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TypeaheadTokenizer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TypeaheadTokenizer.__proto__ || Object.getPrototypeOf(TypeaheadTokenizer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      // We need to copy this to avoid incorrect sharing
      // of state across instances (e.g., via getDefaultProps())
      selected: _this.props.defaultSelected.slice(0)
    }, _this.focus = function () {
      _this.refs.typeahead.focus();
    }, _this.getSelectedTokens = function () {
      return _this.state.selected;
    }, _this._renderTokens = function () {
      var tokenClasses = {};
      tokenClasses[_this.props.customClasses.token] = !!_this.props.customClasses.token;
      var classList = classNames(tokenClasses);
      var result = _this.state.selected.map(function (selected, index) {
        var displayString = this.props.displayOption(selected);
        return React.createElement(
          Token,
          { key: displayString + '_' + index, className: classList,
            onRemove: this._removeTokenForValue,
            object: selected,
            name: this.props.name },
          displayString
        );
      }, _this);
      return result;
    }, _this._getOptionsForTypeahead = function () {
      // return this.props.options without this.selected
      return _this.props.options;
    }, _this._onKeyDown = function (event) {
      // We only care about intercepting backspaces
      if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
        return _this._handleBackspace(event);
      }
      _this.props.onKeyDown(event);
    }, _this._handleBackspace = function (event) {
      // No tokens
      if (!_this.state.selected.length) {
        return;
      }

      // Remove token ONLY when bksp pressed at beginning of line
      // without a selection
      var entry = _this.refs.typeahead.refs.entry;
      if (entry.selectionStart == entry.selectionEnd && entry.selectionStart == 0) {
        _this._removeTokenForValue(_this.state.selected[_this.state.selected.length - 1]);
        event.preventDefault();
      }
    }, _this._removeTokenForValue = function (value) {
      var index = _this.state.selected.indexOf(value);
      if (index == -1) {
        return;
      }

      _this.state.selected.splice(index, 1);
      _this.setState({ selected: _this.state.selected });
      _this.props.onTokenRemove(value);
      return;
    }, _this._addTokenForValue = function (value) {
      if (_this.state.selected.indexOf(value) != -1) {
        return;
      }
      _this.state.selected.push(value);
      _this.setState({ selected: _this.state.selected });
      _this.refs.typeahead.setEntryText("");
      _this.props.onTokenAdd(value);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TypeaheadTokenizer, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // if we get new defaultProps, update selected
      if (_arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)) {
        this.setState({ selected: nextProps.defaultSelected.slice(0) });
      }
    }

    // TODO: Support initialized tokens
    //

  }, {
    key: 'render',
    value: function render() {
      var classes = {};
      classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
      var classList = classNames(classes);
      var tokenizerClasses = [this.props.defaultClassNames && "typeahead-tokenizer"];
      tokenizerClasses[this.props.className] = !!this.props.className;
      var tokenizerClassList = classNames(tokenizerClasses);

      return React.createElement(
        'div',
        { className: tokenizerClassList },
        this._renderTokens(),
        React.createElement(Typeahead, { ref: 'typeahead',
          className: classList,
          placeholder: this.props.placeholder,
          inputProps: this.props.inputProps,
          allowCustomValues: this.props.allowCustomValues,
          customClasses: this.props.customClasses,
          customOptionComponent: this.props.customOptionComponent,
          options: this._getOptionsForTypeahead(),
          defaultValue: this.props.defaultValue,
          maxVisible: this.props.maxVisible,
          onOptionSelected: this._addTokenForValue,
          onKeyDown: this._onKeyDown,
          onKeyUp: this.props.onKeyUp,
          onFocus: this.props.onFocus,
          onBlur: this.props.onBlur,
          displayOption: this.props.displayOption,
          defaultClassNames: this.props.defaultClassNames,
          filterOption: this.props.filterOption })
      );
    }
  }]);

  return TypeaheadTokenizer;
}(React.Component);

TypeaheadTokenizer.propTypes = {
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
  filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  maxVisible: PropTypes.number,
  defaultClassNames: PropTypes.bool,
  customOptionComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
TypeaheadTokenizer.defaultProps = {
  options: [],
  defaultSelected: [],
  customClasses: {},
  allowCustomValues: 0,
  defaultValue: "",
  placeholder: "",
  inputProps: {},
  defaultClassNames: true,
  filterOption: null,
  displayOption: function displayOption(token) {
    return token;
  },
  onKeyDown: function onKeyDown(event) {},
  onKeyUp: function onKeyUp(event) {},
  onFocus: function onFocus(event) {},
  onBlur: function onBlur(event) {},
  onTokenAdd: function onTokenAdd() {},
  onTokenRemove: function onTokenRemove() {}
};


module.exports = TypeaheadTokenizer;