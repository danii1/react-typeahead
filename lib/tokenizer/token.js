'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');
var React = require('react');
var classNames = require('classnames');

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */

var Token = function (_React$Component) {
  _inherits(Token, _React$Component);

  function Token() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Token);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Token.__proto__ || Object.getPrototypeOf(Token)).call.apply(_ref, [this].concat(args))), _this), _this._renderHiddenInput = function () {
      // If no name was set, don't create a hidden input
      if (!_this.props.name) {
        return null;
      }

      return React.createElement('input', {
        type: 'hidden',
        name: _this.props.name + '[]',
        value: _this.props.object
      });
    }, _this._renderCloseButton = function () {
      if (!_this.props.onRemove) {
        return "";
      }
      return React.createElement(
        'a',
        { className: 'typeahead-token-close', href: '#', onClick: function (event) {
            this.props.onRemove(this.props.object);
            event.preventDefault();
          }.bind(_this) },
        '\xD7'
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Token, [{
    key: 'render',
    value: function render() {
      var className = classNames(["typeahead-token", this.props.className]);

      return React.createElement(
        'div',
        { className: className },
        this._renderHiddenInput(),
        this.props.children,
        this._renderCloseButton()
      );
    }
  }]);

  return Token;
}(React.Component);

Token.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.string,
  object: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRemove: PropTypes.func
};


module.exports = Token;