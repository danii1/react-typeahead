var PropTypes = require('prop-types');
var React = require('react');
var classNames = require('classnames');

/**
 * A single option within the TypeaheadSelector
 */
class TypeaheadOption extends React.Component {
  static propTypes = {
    customClasses: PropTypes.object,
    customValue: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string,
    hover: PropTypes.bool,
    option: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    customOptionComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ])
  };

  static defaultProps = {
    customClasses: {},
    onClick: function(event) {
      event.preventDefault();
    }
  };

  render() {
    var classes = {};
    classes[this.props.customClasses.hover || "hover"] = !!this.props.hover;
    classes[this.props.customClasses.listItem] = !!this.props.customClasses.listItem;

    if (this.props.customValue) {
      classes[this.props.customClasses.customAdd] = !!this.props.customClasses.customAdd;
    }

    var classList = classNames(classes);
    var CustomComponent = this.props.customOptionComponent;

    return (
      <li className={classList} onClick={this._onClick}>
        {CustomComponent
          ? <CustomComponent className={this._getClasses()} ref="anchor" option={this.props.option} >
              { this.props.children }
            </CustomComponent>
          : <a href="javascript: void 0;" className={this._getClasses()} ref="anchor">
              { this.props.children }
            </a>}

      </li>
    );
  }

  _getClasses = () => {
    var classes = {
      "typeahead-option": true,
    };
    classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;

    return classNames(classes);
  };

  _onClick = (event) => {
    event.preventDefault();
    return this.props.onClick(event);
  };
}


module.exports = TypeaheadOption;
