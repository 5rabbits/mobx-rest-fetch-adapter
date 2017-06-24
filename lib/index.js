'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global fetch, Headers, Request */


exports.ajaxOptions = ajaxOptions;
exports.checkStatus = checkStatus;

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ajaxOptions(options) {
  var headers = new Headers(Object.assign({}, {
    'Content-Type': 'application/json'
  }, options.headers));

  return _extends({}, options, {
    method: options.method,
    headers: headers,
    body: options.data ? JSON.stringify(options.data) : null
  });
}

function checkStatus(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function ajax(url, options) {
  if (options.method === 'GET' && options.data) {
    url = url + '?' + _qs2.default.stringify(options.data);
    delete options.data;
  }
  var request = new Request(url, ajaxOptions(options));
  var xhr = fetch(request);
  var promise = new Promise(function (resolve, reject) {
    xhr.then(checkStatus).then(resolve, function (error) {
      var ret = error ? error.errors : {};

      return reject(ret || {});
    });
  });

  var abort = function abort() {}; // noop, fetch is not cancelable

  return { abort: abort, promise: promise };
}

exports.default = {
  apiPath: '',
  commonOptions: {},

  get: function get(path, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return ajax('' + this.apiPath + path, (0, _deepExtend2.default)({}, { method: 'GET' }, this.commonOptions, options, { data: data }));
  },
  post: function post(path, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return ajax('' + this.apiPath + path, (0, _deepExtend2.default)({}, { method: 'POST' }, this.commonOptions, options, { data: data }));
  },
  put: function put(path, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return ajax('' + this.apiPath + path, (0, _deepExtend2.default)({}, { method: 'PUT' }, this.commonOptions, options, { data: data }));
  },
  del: function del(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return ajax('' + this.apiPath + path, (0, _deepExtend2.default)({}, { method: 'DELETE' }, this.commonOptions, options));
  }
};