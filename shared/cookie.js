'use strict';

class mwl_cookie {

    static set(key, val, exp) {
        const date = new Date(),
            hostname = window.location.hostname,
            domain = hostname.replace(/(www\.|ww\d\.|m\.)/ig, ''),
            dateString = new Date(date.getTime() + 86400000 * exp);

        document.cookie = `${key}=${val}; domain=.${domain} ;path=/; expires=${dateString.toGMTString()};`;
    }

    static get(name) {
        let matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') }=([^;]*)`));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static remove(key) {
        this.set(key, null, -1);
    }
}