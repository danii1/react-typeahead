var PropTypes = require('prop-types');
var React = require('react');
var TypeaheadOption = require('./option');
var classNames = require('classnames');

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
var TypeaheadSelector = React.createClass({
  propTypes: {
    options: PropTypes.array,
    customClasses: PropTypes.object,
    customValue: PropTypes.string,
    selectionIndex: PropTypes.number,
    onOptionSelected: PropTypes.func,
    displayOption: PropTypes.func.isRequired,
    defaultClassNames: PropTypes.bool,
    customOptionComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ])
  },

  getDefaultProps: function() {
    return {
      selectionIndex: null,
      customClasses: {},
      customValue: null,
      onOptionSelected: function(option) { },
      defaultClassNames: true
    };
  },

  render: function() {
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
      customValue = (
        <TypeaheadOption ref={this.props.customValue} key={this.props.customValue}
          hover={this.props.selectionIndex === 0}
          customClasses={this.props.customClasses}
          customValue={this.props.customValue}
          onClick={this._onClick.bind(this, this.props.customValue)}>
          { this.props.customValue }
        </TypeaheadOption>
      );
    }

    var results = this.props.options.map(function(result, i) {
      var displayString = this.props.displayOption(result, i);
      var uniqueKey = displayString + '_' + i;
      return (
        <TypeaheadOption ref={uniqueKey} key={uniqueKey}
          hover={this.props.selectionIndex === i + customValueOffset}
          customClasses={this.props.customClasses}
          customOptionComponent={this.props.customOptionComponent}
          option={result}
          onClick={this._onClick.bind(this, result)}>
          { displayString }
        </TypeaheadOption>
      );
    }, this);


    return (
      <ul className={classList}>
        { customValue }
        { results }
      </ul>
    );
  },

  _onClick: function(result, event) {
    return this.props.onOptionSelected(result, event);
  }

});

module.exports = TypeaheadSelector;
