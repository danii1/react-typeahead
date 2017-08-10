var PropTypes = require('prop-types');
var React = require('react');
var classNames = require('classnames');

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
class Token extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.string,
    object: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onRemove: PropTypes.func
  };

  render() {
    var className = classNames([
      "typeahead-token",
      this.props.className
    ]);

    return (
      <div className={className}>
        {this._renderHiddenInput()}
        {this.props.children}
        {this._renderCloseButton()}
      </div>
    );
  }

  _renderHiddenInput = () => {
    // If no name was set, don't create a hidden input
    if (!this.props.name) {
      return null;
    }

    return (
      <input
        type="hidden"
        name={ this.props.name + '[]' }
        value={ this.props.object }
      />
    );
  };

  _renderCloseButton = () => {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      <a className="typeahead-token-close" href="#" onClick={function(event) {
          this.props.onRemove(this.props.object);
          event.preventDefault();
        }.bind(this)}>&#x00d7;</a>
    );
  };
}

module.exports = Token;
