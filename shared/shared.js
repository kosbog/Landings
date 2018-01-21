'use strict';

// config example
//{
//    apiUrl: '//api.pdgamedev.com',
//    projectId: '2',
//    API_URL_STAT: '/api/v11/statistics/track/',
//    API_URL_REG: '/api/v11/users',
//    API_URL_REG_Ulogin: '/api/v11/ulogin/'
//}

class Wl_shared {
  constructor() {
    this.stateUrl = window.location;
    this.REFCODE_NAME = 'ref';
    this.COOKIE_TRACKER = 'tracker';
    this.COOKIE_AUTH = 'Authorization';
    this.API_URL_SETTINGS = '/api/v11/settings';
    this.API_URL_HITS = '/api/v11/hits';

    this.init = (config) => {
      this.config = config;
      this.sendRef();
      this.setCPA();
      this.setLandingCodeCookie();
      this.setGloboTunesParams();
      this.createDMPScript();
      this.createAnaliticsScripts();
      this.postHits();
      this.trackService().authorize();
    };

    this.sendRef = () => {
      if (!mwl_cookie.get(this.COOKIE_AUTH)) {
        this.sendRefCode();
      }
    };

    this.setCPA = () => {
      if (!mwl_cookie.get(this.COOKIE_AUTH)) {
        this.setCPACookies();
      }
    };
  }

  isArray(arg) {
    return Array.isArray ? Array.isArray(arg) :
      Object.prototype.toString.call(arg) === '[object Array]';
  }

  triggerEvent(event, data) {
    const evt = $.Event(event);
    $(document).trigger(evt, { data: data });
  }

  makeRandomStr() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  addError(message) {
    this.config.errorDestination.text(message);
    this.config.inputElement.addClass(this.config.errorClass);
    this.config.errorBlock.addClass(this.config.errorBlockClass);
  }

  getParams() {
    let queryParams = {},
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
      } catch (e) { }
    }

    $.extend(queryParams, this.getGloboTunesParams());
    return $.param(queryParams);
  }

  redirect(state) {
    window.location.href = `${this.stateUrl.origin}/${state}?${this.getParams()}`;
  }

  getParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function(n) {
      return n = n.split("="), this[n[0]] = n[1], this
    }.bind({}))[0];
  }

  parseUrlParam(param) {
    let result;

    location.search
      .substr(1)
      .split('&')
      .forEach((item) => {
        let [key, value] = item.split('=');
        if (key === param) result = decodeURIComponent(value);
      });
    return result;
  }

  registerUser(email, plainPassword) {
    const username = this.makeRandomStr(),
      emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/,
      userData = { email, username, plainPassword };

    if (!email || !email.match(emailRegExp)) {
      this.addError('Введите Вашу почту. Верный формат: example@gmail.com');
      return false;
    }

    $.post(`${wl_shared.config.apiUrl}/api/v11/users?${wl_shared.getParams()}`, JSON.stringify(userData))
      .done((response) => {
        this.trackService()
          .track(response.data.token)
          .then(() => this.triggerEvent('registration.done', response.data.token))
      })
      .fail((error) => {
        this.triggerEvent('registration.fail', error)
      })
  }

  loginUser(login, password) {
    if (!login && !password) {
      this.addError('Введите e-mail и пароль');
      return false;
    }

    $.post(`${this.config.apiUrl}/api/v11/login?${this.getParams()}`, JSON.stringify({ login, password }))
      .done((response) => {
        this.trackService()
          .track(response.data.token)
          .then(() => this.triggerEvent('login.done', response.data.token))
      })
      .fail((error) => {
        this.triggerEvent('login.fail', error)
      })
  }

  checkPromocode(code, token) {
    const obj = { code, token };

    if (!code) {
      this.addError('Введите промокод');
      return false;
    }

    $.ajaxSetup({ headers: { 'Auth-Token': token } });

    $.post(`${this.config.apiUrl}/api/v11/gifts/promocode?${this.getParams()}`, JSON.stringify(obj))
      .done((response) => {
        this.triggerEvent('promocode.done', response)
      })
      .fail((error) => {
        this.triggerEvent('promocode.fail', error)
      })
  }

  postStat(type, refcode) {
    const refObj = JSON.stringify({ refCode: refcode })
    return $.post(`${wl_shared.config.apiUrl}${wl_shared.config.API_URL_STAT}${type}?projectId=${wl_shared.config.projectId}`, refObj);
  }

  postHits(popup = false) {
    const guestIDCookie = 'gstId';
    const data = JSON.stringify({
      url: window.location.href,
      utmTags: mwl_cookie.get('utm_tags') || null,
      refCode: mwl_cookie.get('aff') || null,
      popup
    });
    this.publicSettings('track_domain')
      .then(setting => {
        const url = `${location.protocol}//${setting.value}${this.API_URL_HITS}?projectId=${wl_shared.config.projectId}`
        return $.when($.ajax({
          type: 'POST',
          url,
          data,
          xhrFields: {
            withCredentials: true
          }
        }))
      })
      .then(response => {
        const guestID = response.data[guestIDCookie];
        if (guestID) {
          mwl_cookie.set(guestIDCookie, guestID, 365);
        }
      })
  }

  getAnalitycTag() {
      let urlParams = this.getParameters(this.stateUrl.search),
          keys = Object.keys(urlParams),
          regexUtm = /^utm_.{1,}|^network/i;

      let utms = keys.reduce((result, key) => {
          let matched = regexUtm.test(key),
              notEmpty = urlParams[key];

          if (notEmpty && matched) {
              result[key] = urlParams[key]
          }

          return result;
      }, {});

      return utms;
  }

  setCPACookies() {
    let utms = this.getAnalitycTag(),
      utmsArr = Object.keys(utms);

      if (utmsArr.length) {
      mwl_cookie.remove('utm_tags');
      mwl_cookie.set('utm_tags', JSON.stringify(utms), 30);
    }

    return utms;
  }

  getLuckyPartnersRefcode() {
    /* refcode example: p11111p11111p002f&subid=123-53ead3d65249e,5000 */
    const
      refcodeRegExp = /p(\d+)p(\d+)p([\w\d]{4})([\w\d]+)?&(subid)=.*?(?=(&|$))/,
      refcode = location.search.match(refcodeRegExp);

    if (refcode) {
      location.search = location.search.replace(refcodeRegExp, '');
      return refcode[0];
    }
    return refcode;
  }

  sendRefCode() {
    let aff = mwl_cookie.get('aff'),
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

  getQueries() {
    let queryStr = window.location.search.substring(1),
      queries = queryStr.split('&');

    return queries.reduce((result, curr) => {
      let pair = curr.split('=');
      let [key, value] = pair;

      if (value) { //not empty
        result[key] = value;
      }

      return result;
    }, {});
  }

  clearUrlParam(params) {
    let queryObj = this.getQueries(),
      search;

    if (!params) {
      return;
    }

    history.replaceState({}, document.title, window.location.pathname); //clear all

    if (typeof params === 'string') {
      delete queryObj[params];
    }

    if (this.isArray(params)) {
      params.forEach((param) => {
        delete queryObj[param];
      });
    }

    // Set
    Object.keys(queryObj).forEach((key) => {
      let value = queryObj[key];
      if (search) {
        search += `&${key}=${encodeURIComponent(value)}`;
      } else {
        search = `?${key}=${encodeURIComponent(value)}`;
      }
    });

    if (search) {
      history.replaceState({ state: queryObj }, document.title, search);
    }
  }

  setLandingCodeCookie() {

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

  setUserTokenCookie(element) {
    var token = mwl_cookie.get("token") ? mwl_cookie.get("token") : mwl_cookie.set("token", element, 30);
  }

  setGloboTunesParams() {
    const GT_PROJECT_IDS = [17];
    if (GT_PROJECT_IDS.indexOf(this.config.projectId) < 0) return;

    const { query_string, referer } = this.getQueries();
    if (query_string) mwl_cookie.set("query_string", query_string, 30);
    if (referer) mwl_cookie.set("referer", referer, 30);
  }

  getGloboTunesParams() {
    const query_string = mwl_cookie.get("query_string");
    const referer = mwl_cookie.get("referer");
    let params = {};

    if (query_string) $.extend(params, { query_string });
    if (referer) $.extend(params, { referer });
    return params;
  }

  createDMPScript() {
    const DMP_PROJECT_IDS = [17];
    if (DMP_PROJECT_IDS.indexOf(this.config.projectId) < 0) return;

    window._ggcounter = window._ggcounter || [];
    window._ggcounterSettings = {};

    $.when(
      this.publicSettings('dmpjs_param_prod'),
      this.publicSettings('dmpjs_param_pc')
    ).then(prod, pc => {
      _ggcounterSettings.prod = prod.value;
      _ggcounterSettings.pc = pc.value;

      if (_ggcounterSettings.prod && _ggcounterSettings.pc) {
        return (function() {
          const tc = document.createElement('script');
          tc.type = 'text/javascript';
          tc.async = true;
          tc.src = '//cdn.dmpcounter.com/s/dmp.js';
          const s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(tc, s);
        })();
      }
    })
  }

  createAnaliticsScripts() {
    const addScript = (src, callback = () => { }) => {
      const e = document.createElement('script');
      e.type = 'text/javascript';
      e.async = true;
      e.src = src;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(e, s);
      e.onload = callback
    };

    let networkTag = this.getAnalitycTag();

    $.when(
      this.publicSettings('counter_google'),
      this.publicSettings('counter_yandex')
    ).then((google, yandex) => {

      const GA_ID = google.value,
        YM_ID = yandex.value;

      addScript('//www.google-analytics.com/analytics.js', initGA);

      addScript('//mc.yandex.ru/metrika/watch.js', initYM);

      function initGA() {
        window.ga = window.ga || function() { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
        ga('create', GA_ID, 'auto');
        ga('require', 'GTM-MMM2WRZ');
        if(networkTag.network !== void 0) ga('set', 'dimension3', networkTag.network);
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
          } catch (e) { }
      }
    })
  }

  publicSettings(alias) {
    const promise = $.when($.get(`${wl_shared.config.apiUrl}${this.API_URL_SETTINGS}?projectId=${wl_shared.config.projectId}`));
    if (alias) {
      return promise.then(settings => {
        return settings.data.filter(item => item.alias === alias)[0] || {}
      })
    }
    return promise
  }

  trackService() {
    const redirect = this.redirect.bind(this);
    const publicSettings = this.publicSettings.bind(this);

    return { track, authorize }

    function authorize() {
      if (isSafari()) return;

      getTrackToken()
        .then(token => {
          if (token) {
            mwl_cookie.set('Authorization', token, 30);
            redirect('');
          }
          else if (mwl_cookie.get('Authorization')) {
            mwl_cookie.remove('Authorization');
            track();
          }
        })
    }

    function track(token) {
      if (isSafari()) return $.when(null);

      return getTrackUrl()
        .then(url => {
          let options = {
            url,
            type: 'POST',
            xhrFields: {
              withCredentials: true
            }
          };
          if (token) {
            $.extend(options, {
              headers: { "Auth-Token": token }
            })
          }
          return $.when($.ajax(options))
        })
    }

    function getTrackToken() {
      return getTrackUrl()
        .then(url =>
          $.when($.ajax({
            type: 'GET',
            url,
            xhrFields: {
              withCredentials: true
            }
          }))
        )
        .then(response => response.data.track_id)
    }

    function getTrackUrl() {
      return publicSettings('track_domain')
        .then(domain => `${window.location.protocol}//${domain.value}/api/v11/track?projectId=${wl_shared.config.projectId}`)
    }

    function isSafari() {
        return /constructor/i.test(window.HTMLElement)
            || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
            || !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    }
  }
}

const wl_shared = new Wl_shared();
