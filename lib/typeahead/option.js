'use strict';

var React = require('react');
var classNames = require('classnames');

/**
 * A single option within the TypeaheadSelector
 */
var TypeaheadOption = React.createClass({
  displayName: 'TypeaheadOption',

  propTypes: {
    customClasses: React.PropTypes.object,
    customValue: React.PropTypes.string,
    onClick: React.PropTypes.func,
    children: React.PropTypes.string,
    hover: React.PropTypes.bool,
    option: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
    customOptionComponent: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.func])
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