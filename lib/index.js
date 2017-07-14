'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.ajaxOptions = ajaxOptions;
exports.checkStatus = checkStatus;

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* global fetch, Headers, Request */


function ajaxOptions(options) {
  var headers = options.headers,
      data = options.data,
      otherOptions = _objectWithoutProperties(options, ['headers', 'data']);

  var headersObject = new Headers(Object.assign({}, {
    'Content-Type': 'application/json'
  }, headers));

  return _extends({}, otherOptions, {
    headers: headersObject,
    body: data ? JSON.stringify(data) : null
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
  var rejectPromise = void 0;

  var promise = new Promise(function (resolve, reject) {
    rejectPromise = reject;

    xhr.then(checkStatus).then(resolve, function (error) {
      var ret = error ? error.errors : {};

      return reject(ret || {});
    });
  });

  var abort = function abort() {
    return rejectPromise('abort');
  };

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