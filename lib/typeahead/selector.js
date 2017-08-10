'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');
var React = require('react');
var TypeaheadOption = require('./option');
var classNames = require('classnames');

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */

var TypeaheadSelector = function (_React$Component) {
  _inherits(TypeaheadSelector, _React$Component);

  function TypeaheadSelector() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TypeaheadSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TypeaheadSelector.__proto__ || Object.getPrototypeOf(TypeaheadSelector)).call.apply(_ref, [this].concat(args))), _this), _this._onClick = function (result, event) {
      return _this.props.onOptionSelected(result, event);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TypeaheadSelector, [{
    key: 'render',
    value: function render() {
      var classes = {
        "typeahead-selector": this.props.defaultClassNames
      };
      classes[this.props.customClasses.results] = this.props.customClasses.results;
      var classList = classNames(classes);

      // CustomValue should be added to top of results list with different class name
      var customValue = null;
      var customValueOffset = 0;
      if (this.props.customValue !== null) {
        customValueOffset++;
        customValue = React.createElement(
          TypeaheadOption,
          { ref: this.props.customValue, key: this.props.customValue,
            hover: this.props.selectionIndex === 0,
            customClasses: this.props.customClasses,
            customValue: this.props.customValue,
            onClick: this._onClick.bind(this, this.props.customValue) },
          this.props.customValue
        );
      }

      var results = this.props.options.map(function (result, i) {
        var displayString = this.props.displayOption(result, i);
        var uniqueKey = displayString + '_' + i;
        return React.createElement(
          TypeaheadOption,
          { ref: uniqueKey, key: uniqueKey,
            hover: this.props.selectionIndex === i + customValueOffset,
            customClasses: this.props.customClasses,
            customOptionComponent: this.props.customOptionComponent,
            option: result,
            onClick: this._onClick.bind(this, result) },
          displayString
        );
      }, this);

      return React.createElement(
        'ul',
        { className: classList },
        customValue,
        results
      );
    }
  }]);

  return TypeaheadSelector;
}(React.Component);

TypeaheadSelector.propTypes = {
  options: PropTypes.array,
  customClasses: PropTypes.object,
  customValue: PropTypes.string,
  selectionIndex: PropTypes.number,
  onOptionSelected: PropTypes.func,
  displayOption: PropTypes.func.isRequired,
  defaultClassNames: PropTypes.bool,
  customOptionComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
TypeaheadSelector.defaultProps = {
  selectionIndex: null,
  customClasses: {},
  customValue: null,
  onOptionSelected: function onOptionSelected(option) {},
  defaultClassNames: true
};


module.exports = TypeaheadSelector;