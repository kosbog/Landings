'use strict';

// config example
//{
//    apiUrl: '//api.pdgamedev.com',
//    projectId: '2',
//    API_URL_STAT: '/api/v11/statistics/track/',
//    API_URL_REG: '/api/v11/users',
//    API_URL_REG_Ulogin: '/api/v11/ulogin/'
//}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wl_shared = function () {
  function Wl_shared() {
    var _this = this;

    _classCallCheck(this, Wl_shared);

    this.stateUrl = window.location;
    this.REFCODE_NAME = 'ref';
    this.COOKIE_TRACKER = 'tracker';
    this.COOKIE_AUTH = 'Authorization';
    this.API_URL_SETTINGS = '/api/v11/settings';
    this.API_URL_HITS = '/api/v11/hits';

    this.init = function (config) {
      _this.config = config;
      _this.sendRef();
      _this.setCPA();
      _this.setLandingCodeCookie();
      _this.setGloboTunesParams();
      _this.createDMPScript();
      _this.createAnaliticsScripts();
      _this.postHits();
      _this.trackService().authorize();
    };

    this.sendRef = function () {
      if (!mwl_cookie.get(_this.COOKIE_AUTH)) {
        _this.sendRefCode();
      }
    };

    this.setCPA = function () {
      if (!mwl_cookie.get(_this.COOKIE_AUTH)) {
        _this.setCPACookies();
      }
    };
  }

  _createClass(Wl_shared, [{
    key: 'isArray',
    value: function isArray(arg) {
      return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]';
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(event, data) {
      var evt = $.Event(event);
      $(document).trigger(evt, { data: data });
    }
  }, {
    key: 'makeRandomStr',
    value: function makeRandomStr() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }return text;
    }
  }, {
    key: 'addError',
    value: function addError(message) {
      this.config.errorDestination.text(message);
      this.config.inputElement.addClass(this.config.errorClass);
      this.config.errorBlock.addClass(this.config.errorBlockClass);
    }
  }, {
    key: 'getParams',
    value: function getParams() {
      var queryParams = {},
          satelliteRefCode = mwl_cookie.get('aff'),
          refTag = mwl_cookie.get('utm_tags'),
          landingCode = mwl_cookie.get('landingCode');

      queryParams['projectId'] = wl_shared.config.projectId;

      if (satelliteRefCode) {
        queryParams['satelliteRefCode'] = satelliteRefCode;
      }

      if (landingCode) {
        queryParams['landingCode'] = landingCode;
      }

      if (refTag) {
        try {
          refTag = JSON.parse(refTag);
          for (var prop in refTag) {
            queryParams[prop] = refTag[prop];
          }
        } catch (e) {}
      }

      $.extend(queryParams, this.getGloboTunesParams());
      return $.param(queryParams);
    }
  }, {
    key: 'redirect',
    value: function redirect(state) {
      window.location.href = this.stateUrl.origin + '/' + state + '?' + this.getParams();
    }
  }, {
    key: 'getParameters',
    value: function getParameters(str) {
      return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
        return n = n.split("="), this[n[0]] = n[1], this;
      }.bind({}))[0];
    }
  }, {
    key: 'parseUrlParam',
    value: function parseUrlParam(param) {
      var result = void 0;

      location.search.substr(1).split('&').forEach(function (item) {
        var _item$split = item.split('='),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];

        if (key === param) result = decodeURIComponent(value);
      });
      return result;
    }
  }, {
    key: 'registerUser',
    value: function registerUser(email, plainPassword) {
      var _this2 = this;

      var username = this.makeRandomStr(),
          emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/,
          userData = { email: email, username: username, plainPassword: plainPassword };

      if (!email || !email.match(emailRegExp)) {
        this.addError('Введите Вашу почту. Верный формат: example@gmail.com');
        return false;
      }

      $.post(wl_shared.config.apiUrl + '/api/v11/users?' + wl_shared.getParams(), JSON.stringify(userData)).done(function (response) {
        _this2.trackService().track(response.data.token).then(function () {
          return _this2.triggerEvent('registration.done', response.data.token);
        });
      }).fail(function (error) {
        _this2.triggerEvent('registration.fail', error);
      });
    }
  }, {
    key: 'loginUser',
    value: function loginUser(login, password) {
      var _this3 = this;

      if (!login && !password) {
        this.addError('Введите e-mail и пароль');
        return false;
      }

      $.post(this.config.apiUrl + '/api/v11/login?' + this.getParams(), JSON.stringify({ login: login, password: password })).done(function (response) {
        _this3.trackService().track(response.data.token).then(function () {
          return _this3.triggerEvent('login.done', response.data.token);
        });
      }).fail(function (error) {
        _this3.triggerEvent('login.fail', error);
      });
    }
  }, {
    key: 'checkPromocode',
    value: function checkPromocode(code, token) {
      var _this4 = this;

      var obj = { code: code, token: token };

      if (!code) {
        this.addError('Введите промокод');
        return false;
      }

      $.ajaxSetup({ headers: { 'Auth-Token': token } });

      $.post(this.config.apiUrl + '/api/v11/gifts/promocode?' + this.getParams(), JSON.stringify(obj)).done(function (response) {
        _this4.triggerEvent('promocode.done', response);
      }).fail(function (error) {
        _this4.triggerEvent('promocode.fail', error);
      });
    }
  }, {
    key: 'postStat',
    value: function postStat(type, refcode) {
      var refObj = JSON.stringify({ refCode: refcode });
      return $.post('' + wl_shared.config.apiUrl + wl_shared.config.API_URL_STAT + type + '?projectId=' + wl_shared.config.projectId, refObj);
    }
  }, {
    key: 'postHits',
    value: function postHits() {
      var _this5 = this;

      var popup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var guestIDCookie = 'gstId';
      var data = JSON.stringify({
        url: window.location.href,
        utmTags: mwl_cookie.get('utm_tags') || null,
        refCode: mwl_cookie.get('aff') || null,
        popup: popup
      });
      this.publicSettings('track_domain').then(function (setting) {
        var url = location.protocol + '//' + setting.value + _this5.API_URL_HITS + '?projectId=' + wl_shared.config.projectId;
        return $.when($.ajax({
          type: 'POST',
          url: url,
          data: data,
          xhrFields: {
            withCredentials: true
          }
        }));
      }).then(function (response) {
        var guestID = response.data[guestIDCookie];
        if (guestID) {
          mwl_cookie.set(guestIDCookie, guestID, 365);
        }
      });
    }
  }, {
    key: 'getAnalitycTag',
    value: function getAnalitycTag() {
      var urlParams = this.getParameters(this.stateUrl.search),
          keys = Object.keys(urlParams),
          regexUtm = /^utm_.{1,}|^network/i;

      var utms = keys.reduce(function (result, key) {
        var matched = regexUtm.test(key),
            notEmpty = urlParams[key];

        if (notEmpty && matched) {
          result[key] = urlParams[key];
        }

        return result;
      }, {});

      return utms;
    }
  }, {
    key: 'setCPACookies',
    value: function setCPACookies() {
      var utms = this.getAnalitycTag(),
          utmsArr = Object.keys(utms);

      if (utmsArr.length) {
        mwl_cookie.remove('utm_tags');
        mwl_cookie.set('utm_tags', JSON.stringify(utms), 30);
      }

      return utms;
    }
  }, {
    key: 'getLuckyPartnersRefcode',
    value: function getLuckyPartnersRefcode() {
      /* refcode example: p11111p11111p002f&subid=123-53ead3d65249e,5000 */
      var refcodeRegExp = /p(\d+)p(\d+)p([\w\d]{4})([\w\d]+)?&(subid)=.*?(?=(&|$))/,
          refcode = location.search.match(refcodeRegExp);

      if (refcode) {
        location.search = location.search.replace(refcodeRegExp, '');
        return refcode[0];
      }
      return refcode;
    }
  }, {
    key: 'sendRefCode',
    value: function sendRefCode() {
      var aff = mwl_cookie.get('aff'),
          tracker = mwl_cookie.get(this.COOKIE_TRACKER),
          urlRefcode = this.parseUrlParam(this.REFCODE_NAME),
          luckyPartnersRefcode = this.getLuckyPartnersRefcode();

      if (luckyPartnersRefcode) {
        aff = luckyPartnersRefcode;
        mwl_cookie.set('aff', aff, 30);
        mwl_cookie.remove(this.COOKIE_TRACKER);
      }

      if (urlRefcode) {
        aff = urlRefcode;
        mwl_cookie.set('aff', aff, 30);
        this.clearUrlParam(this.REFCODE_NAME);
        mwl_cookie.remove(this.COOKIE_TRACKER);
      }

      if (!aff) {
        aff = 'organic';
        mwl_cookie.set('aff', aff, 30);
      }

      if (aff !== tracker) {
        mwl_cookie.set(this.COOKIE_TRACKER, aff, 30);
        this.postStat('host', aff); //Send host
      }

      // send hit
      this.postStat('hit', aff);
    }
  }, {
    key: 'getQueries',
    value: function getQueries() {
      var queryStr = window.location.search.substring(1),
          queries = queryStr.split('&');

      return queries.reduce(function (result, curr) {
        var pair = curr.split('=');

        var _pair = _slicedToArray(pair, 2),
            key = _pair[0],
            value = _pair[1];

        if (value) {
          //not empty
          result[key] = value;
        }

        return result;
      }, {});
    }
  }, {
    key: 'clearUrlParam',
    value: function clearUrlParam(params) {
      var queryObj = this.getQueries(),
          search = void 0;

      if (!params) {
        return;
      }

      history.replaceState({}, document.title, window.location.pathname); //clear all

      if (typeof params === 'string') {
        delete queryObj[params];
      }

      if (this.isArray(params)) {
        params.forEach(function (param) {
          delete queryObj[param];
        });
      }

      // Set
      Object.keys(queryObj).forEach(function (key) {
        var value = queryObj[key];
        if (search) {
          search += '&' + key + '=' + encodeURIComponent(value);
        } else {
          search = '?' + key + '=' + encodeURIComponent(value);
        }
      });

      if (search) {
        history.replaceState({ state: queryObj }, document.title, search);
      }
    }
  }, {
    key: 'setLandingCodeCookie',
    value: function setLandingCodeCookie() {

      // Create a cookie "landingCode"
      var cookieName = 'landingCode',
          landingCodeName = getLandingCode(),
          currentCookie = mwl_cookie.get(cookieName);

      if (currentCookie) {
        mwl_cookie.remove(cookieName);
      }

      mwl_cookie.set(cookieName, landingCodeName, 30);

      // Check pathname of our landing page,
      // split it be '/' and then get 2(second) element of array,
      // which is a title of landing (after /promos/)
      function getLandingCode() {

        var pathName = window.location.pathname,
            pathNameArr = pathName.split('/'),
            landingName = pathNameArr[2];

        return landingName;
      }
    }
  }, {
    key: 'setUserTokenCookie',
    value: function setUserTokenCookie(element) {
      var token = mwl_cookie.get("token") ? mwl_cookie.get("token") : mwl_cookie.set("token", element, 30);
    }
  }, {
    key: 'setGloboTunesParams',
    value: function setGloboTunesParams() {
      var GT_PROJECT_IDS = [17];
      if (GT_PROJECT_IDS.indexOf(this.config.projectId) < 0) return;

      var _getQueries = this.getQueries(),
          query_string = _getQueries.query_string,
          referer = _getQueries.referer;

      if (query_string) mwl_cookie.set("query_string", query_string, 30);
      if (referer) mwl_cookie.set("referer", referer, 30);
    }
  }, {
    key: 'getGloboTunesParams',
    value: function getGloboTunesParams() {
      var query_string = mwl_cookie.get("query_string");
      var referer = mwl_cookie.get("referer");
      var params = {};

      if (query_string) $.extend(params, { query_string: query_string });
      if (referer) $.extend(params, { referer: referer });
      return params;
    }
  }, {
    key: 'createDMPScript',
    value: function createDMPScript() {
      var DMP_PROJECT_IDS = [17];
      if (DMP_PROJECT_IDS.indexOf(this.config.projectId) < 0) return;

      window._ggcounter = window._ggcounter || [];
      window._ggcounterSettings = {};

      $.when(this.publicSettings('dmpjs_param_prod'), this.publicSettings('dmpjs_param_pc')).then(prod, function (pc) {
        _ggcounterSettings.prod = prod.value;
        _ggcounterSettings.pc = pc.value;

        if (_ggcounterSettings.prod && _ggcounterSettings.pc) {
          return function () {
            var tc = document.createElement('script');
            tc.type = 'text/javascript';
            tc.async = true;
            tc.src = '//cdn.dmpcounter.com/s/dmp.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(tc, s);
          }();
        }
      });
    }
  }, {
    key: 'createAnaliticsScripts',
    value: function createAnaliticsScripts() {
      var addScript = function addScript(src) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.async = true;
        e.src = src;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
        e.onload = callback;
      };

      var networkTag = this.getAnalitycTag();

      $.when(this.publicSettings('counter_google'), this.publicSettings('counter_yandex')).then(function (google, yandex) {

        var GA_ID = google.value,
            YM_ID = yandex.value;

        addScript('//www.google-analytics.com/analytics.js', initGA);

        addScript('//mc.yandex.ru/metrika/watch.js', initYM);

        function initGA() {
          window.ga = window.ga || function () {
            (ga.q = ga.q || []).push(arguments);
          };ga.l = +new Date();
          ga('create', GA_ID, 'auto');
          ga('require', 'GTM-MMM2WRZ');
          if (networkTag.network !== void 0) ga('set', 'dimension3', networkTag.network);
          ga('send', 'pageview');
        }

        function initYM() {
          try {
            window.yaCounterXXXXXX = new Ya.Metrika({
              id: YM_ID,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true
            });
          } catch (e) {}
        }
      });
    }
  }, {
    key: 'publicSettings',
    value: function publicSettings(alias) {
      var promise = $.when($.get('' + wl_shared.config.apiUrl + this.API_URL_SETTINGS + '?projectId=' + wl_shared.config.projectId));
      if (alias) {
        return promise.then(function (settings) {
          return settings.data.filter(function (item) {
            return item.alias === alias;
          })[0] || {};
        });
      }
      return promise;
    }
  }, {
    key: 'trackService',
    value: function trackService() {
      var redirect = this.redirect.bind(this);
      var publicSettings = this.publicSettings.bind(this);

      return { track: track, authorize: authorize };

      function authorize() {
        if (isSafari()) return;

        getTrackToken().then(function (token) {
          if (token) {
            mwl_cookie.set('Authorization', token, 30);
            redirect('');
          } else if (mwl_cookie.get('Authorization')) {
            mwl_cookie.remove('Authorization');
            track();
          }
        });
      }

      function track(token) {
        if (isSafari()) return $.when(null);

        return getTrackUrl().then(function (url) {
          var options = {
            url: url,
            type: 'POST',
            xhrFields: {
              withCredentials: true
            }
          };
          if (token) {
            $.extend(options, {
              headers: { "Auth-Token": token }
            });
          }
          return $.when($.ajax(options));
        });
      }

      function getTrackToken() {
        return getTrackUrl().then(function (url) {
          return $.when($.ajax({
            type: 'GET',
            url: url,
            xhrFields: {
              withCredentials: true
            }
          }));
        }).then(function (response) {
          return response.data.track_id;
        });
      }

      function getTrackUrl() {
        return publicSettings('track_domain').then(function (domain) {
          return window.location.protocol + '//' + domain.value + '/api/v11/track?projectId=' + wl_shared.config.projectId;
        });
      }

      function isSafari() {
        return (/constructor/i.test(window.HTMLElement) || function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
          }(!window['safari'] || typeof safari !== 'undefined' && safari.pushNotification) || !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
        );
      }
    }
  }]);

  return Wl_shared;
}();

var wl_shared = new Wl_shared();