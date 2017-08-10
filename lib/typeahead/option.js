'use strict';

var PropTypes = require('prop-types');
var React = require('react');
var classNames = require('classnames');

/**
 * A single option within the TypeaheadSelector
 */
var TypeaheadOption = React.createClass({
  displayName: 'TypeaheadOption',

  propTypes: {
    customClasses: PropTypes.object,
    customValue: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string,
    hover: PropTypes.bool,
    option: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    customOptionComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      customClasses: {},
      onClick: function onClick(event) {
        event.preventDefault();
      }
    };
  },

  render: function render() {
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
  },

  _getClasses: function _getClasses() {
    var classes = {
      "typeahead-option": true
    };
    classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;

    return classNames(classes);
  },

  _onClick: function _onClick(event) {
    event.preventDefault();
    return this.props.onClick(event);
  }
});

module.exports = TypeaheadOption;