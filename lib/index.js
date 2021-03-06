'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilter = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Search = _react2.default.createClass({
  displayName: 'Search',

  propTypes: {
    className: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    caseSensitive: _react2.default.PropTypes.bool,
    fuzzy: _react2.default.PropTypes.bool,
    throttle: _react2.default.PropTypes.number,
    filterKeys: _react2.default.PropTypes.oneOf([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
    value: _react2.default.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      onChange: function onChange() {},

      caseSensitive: false,
      fuzzy: false,
      throttle: 200
    };
  },
  getInitialState: function getInitialState() {
    return {
      searchTerm: this.props.value || ''
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      var e = {
        target: {
          value: nextProps.value
        }
      };
      this.updateSearch(e);
    }
  },
  render: function render() {
    var _props = this.props;
    var onChange = _props.onChange;
    var caseSensitive = _props.caseSensitive;
    var throttle = _props.throttle;
    var filterKeys = _props.filterKeys;
    var value = _props.value;

    var inputProps = _objectWithoutProperties(_props, ['onChange', 'caseSensitive', 'throttle', 'filterKeys', 'value']);

    inputProps.type = inputProps.type || 'search';
    inputProps.value = this.state.searchTerm;
    inputProps.onChange = this.updateSearch;
    inputProps.placeholder = inputProps.placeholder || 'Search';
    return _react2.default.createElement('input', inputProps);
  },
  updateSearch: function updateSearch(e) {
    var _this = this;

    var searchTerm = e.target.value;
    this.setState({
      searchTerm: searchTerm
    }, function () {
      if (_this._throttleTimeout) {
        clearTimeout(_this._throttleTimeout);
      }

      _this._throttleTimeout = setTimeout(function () {
        return _this.props.onChange(searchTerm);
      }, _this.props.throttle);
    });
  },
  filter: function filter(keys) {
    return (0, _util.createFilter)(this.state.searchTerm, keys || this.props.filterKeys, this.props.caseSensitive, this.props.fuzzy);
  }
});

exports.default = Search;
exports.createFilter = _util.createFilter;