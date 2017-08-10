'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');
var React = require('react');
var classNames = require('classnames');

/**
 * A single option within the TypeaheadSelector
 */

var TypeaheadOption = function (_React$Component) {
  _inherits(TypeaheadOption, _React$Component);

  function TypeaheadOption() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TypeaheadOption);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TypeaheadOption.__proto__ || Object.getPrototypeOf(TypeaheadOption)).call.apply(_ref, [this].concat(args))), _this), _this._getClasses = function () {
      var classes = {
        "typeahead-option": true
      };
      classes[_this.props.customClasses.listAnchor] = !!_this.props.customClasses.listAnchor;

      return classNames(classes);
    }, _this._onClick = function (event) {
      event.preventDefault();
      return _this.props.onClick(event);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TypeaheadOption, [{
    key: 'render',
    value: function render() {
      var classes = {};
      classes[this.props.customClasses.hover || "hover"] = !!this.props.hover;
      classes[this.props.customClasses.listItem] = !!this.props.customClasses.listItem;

      if (this.props.customValue) {
        classes[this.props.customClasses.customAdd] = !!this.props.customClasses.customAdd;
      }

      var classList = classNames(classes);
      var CustomComponent = this.props.customOptionComponent;

      return React.createElement(
        'li',
        { className: classList, onClick: this._onClick },
        CustomComponent ? React.createElement(
          CustomComponent,
          { className: this._getClasses(), ref: 'anchor', option: this.props.option },
          this.props.children
        ) : React.createElement(
          'a',
          { href: 'javascript: void 0;', className: this._getClasses(), ref: 'anchor' },
          this.props.children
        )
      );
    }
  }]);

  return TypeaheadOption;
}(React.Component);

TypeaheadOption.propTypes = {
  customClasses: PropTypes.object,
  customValue: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.string,
  hover: PropTypes.bool,
  option: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  customOptionComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
TypeaheadOption.defaultProps = {
  customClasses: {},
  onClick: function onClick(event) {
    event.preventDefault();
  }
};


module.exports = TypeaheadOption;