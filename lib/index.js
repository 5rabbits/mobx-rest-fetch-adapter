'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.ajaxOptions = ajaxOptions;
exports.checkStatus = checkStatus;

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* global fetch, Headers */


function ajaxOptions(options) {
  var headers = options.headers,
      data = options.data,
      otherOptions = _objectWithoutProperties(options, ['headers', 'data']);

  var baseHeaders = {};

  if (data) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  var headersObject = new Headers(Object.assign(baseHeaders, headers));

  return _extends({}, otherOptions, {
    headers: headersObject,
    body: data ? JSON.stringify(data) : null
  });
}

function checkStatus(response) {
  return response.ok ? Promise.resolve(response) : Promise.reject(response);
}

var methodsMapping = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  del: 'DELETE',
  head: 'HEAD'
};

var adapter = {
  urlRoot: '',
  defaults: {},

  errorUnwrap: function errorUnwrap(error, _config) {
    return (error ? error.errors : {}) || {};
  },
  request: function request(path, options) {
    var _this = this;

    var url = '' + this.urlRoot + path;
    var rejectPromise = void 0;

    options = (0, _lodash2.default)({}, this.defaults, options);

    var finalOptions = _extends({}, options);

    if (options.method === 'GET' && options.data) {
      url = url + '?' + _qs2.default.stringify(options.data, options.qs);

      delete options.data;
      delete options.qs;
    }

    var xhr = fetch(url, ajaxOptions(options));
    var promise = new Promise(function (resolve, reject) {
      rejectPromise = reject;
      xhr.then(checkStatus).then(function (response) {
        return response.json();
      }).then(resolve).catch(function (response) {
        response.json().then(function (error) {
          reject({
            requestResponse: response,
            error: _this.errorUnwrap(error, { options: finalOptions, path: path })
          });
        });
      });
    });

    var abort = function abort() {
      return rejectPromise('abort');
    };

    return { abort: abort, promise: promise };
  },
  del: function del(path, options) {
    return this.request(path, (0, _lodash2.default)({ method: 'DELETE' }, options));
  }
};

var _loop = function _loop(_method) {
  if (_method === 'del') {
    return 'continue';
  }

  adapter[_method] = function (path, data, options) {
    return this.request(path, (0, _lodash2.default)({ method: methodsMapping[_method] }, options, { data: data }));
  };
};

for (var _method in methodsMapping) {
  var _ret = _loop(_method);

  if (_ret === 'continue') continue;
}

exports.default = adapter;