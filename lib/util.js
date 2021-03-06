'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValuesForKey = getValuesForKey;
exports.searchStrings = searchStrings;
exports.createFilter = createFilter;

var _fuse = require('fuse.js');

var _fuse2 = _interopRequireDefault(_fuse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getValuesForKey(key, item) {
  var keys = key.split('.');
  var results = [item];
  keys.forEach(function (_key) {
    var tmp = [];
    results.forEach(function (result) {
      if (result) {
        if (result instanceof Array) {
          result.forEach(function (res) {
            tmp.push(res[_key]);
          });
        } else {
          tmp.push(result[_key]);
        }
      }
    });

    results = tmp;
  });

  return results.filter(function (r) {
    return typeof r === 'string' || typeof r === 'number';
  });
}

function searchStrings(strings, term, caseSensitive, fuzzy) {
  strings = strings.map(function (e) {
    return e.toString();
  });
  try {
    if (fuzzy) {
      var fuse = new _fuse2.default(strings.map(function (s) {
        return { id: s };
      }), { keys: ['id'], id: 'id', caseSensitive: caseSensitive });
      return fuse.search(term).length;
    }
    return strings.some(function (value) {
      try {
        if (!caseSensitive) {
          value = value.toLowerCase();
        }
        if (value && value.search(term) !== -1) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    });
  } catch (e) {
    return false;
  }
}

function createFilter(term, keys, caseSensitive, fuzzy) {
  return function (item) {
    if (term === '') {
      return true;
    }

    if (!caseSensitive) {
      term = term.toLowerCase();
    }

    var terms = term.split(' ');

    if (!keys) {
      return terms.every(function (term) {
        return searchStrings([item], term, caseSensitive, fuzzy);
      });
    }

    if (typeof keys === 'string') {
      keys = [keys];
    }

    return terms.every(function (term) {
      // allow search in specific fields with the syntax `field:search`
      var currentKeys = void 0;
      if (term.indexOf(':') > -1) {
        (function () {
          var searchedField = term.split(':')[0];
          term = term.split(':')[1];
          currentKeys = keys.filter(function (key) {
            return key.toLowerCase().indexOf(searchedField) > -1;
          });
        })();
      } else {
        currentKeys = keys;
      }

      return currentKeys.find(function (key) {
        var values = getValuesForKey(key, item);
        return searchStrings(values, term, caseSensitive, fuzzy);
      });
    });
  };
}