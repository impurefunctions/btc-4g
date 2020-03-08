/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    return a.ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    return a.ui.plugin = {
        add: function(b, c, d) {
            var e, f = a.ui[b].prototype;
            for (e in d) f.plugins[e] = f.plugins[e] || [], f.plugins[e].push([c, d[e]])
        },
        call: function(a, b, c, d) {
            var e, f = a.plugins[b];
            if (f && (d || a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType))
                for (e = 0; e < f.length; e++) a.options[f[e][0]] && f[e][1].apply(a.element, c)
        }
    }
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    return a.ui.safeActiveElement = function(a) {
        var b;
        try {
            b = a.activeElement
        } catch (c) {
            b = a.body
        }
        return b || (b = a.body), b.nodeName || (b = a.body), b
    }
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    return a.ui.safeBlur = function(b) {
        b && "body" !== b.nodeName.toLowerCase() && a(b).trigger("blur")
    }
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    var b = 0,
        c = Array.prototype.slice;
    return a.cleanData = function(b) {
        return function(c) {
            var d, e, f;
            for (f = 0; null != (e = c[f]); f++) try {
                d = a._data(e, "events"), d && d.remove && a(e).triggerHandler("remove")
            } catch (g) {}
            b(c)
        }
    }(a.cleanData), a.widget = function(b, c, d) {
        var e, f, g, h = {},
            i = b.split(".")[0];
        b = b.split(".")[1];
        var j = i + "-" + b;
        return d || (d = c, c = a.Widget), a.isArray(d) && (d = a.extend.apply(null, [{}].concat(d))), a.expr[":"][j.toLowerCase()] = function(b) {
            return !!a.data(b, j)
        }, a[i] = a[i] || {}, e = a[i][b], f = a[i][b] = function(a, b) {
            return this._createWidget ? void(arguments.length && this._createWidget(a, b)) : new f(a, b)
        }, a.extend(f, e, {
            version: d.version,
            _proto: a.extend({}, d),
            _childConstructors: []
        }), g = new c, g.options = a.widget.extend({}, g.options), a.each(d, function(b, d) {
            return a.isFunction(d) ? void(h[b] = function() {
                function a() {
                    return c.prototype[b].apply(this, arguments)
                }

                function e(a) {
                    return c.prototype[b].apply(this, a)
                }
                return function() {
                    var b, c = this._super,
                        f = this._superApply;
                    return this._super = a, this._superApply = e, b = d.apply(this, arguments), this._super = c, this._superApply = f, b
                }
            }()) : void(h[b] = d)
        }), f.prototype = a.widget.extend(g, {
            widgetEventPrefix: e ? g.widgetEventPrefix || b : b
        }, h, {
            constructor: f,
            namespace: i,
            widgetName: b,
            widgetFullName: j
        }), e ? (a.each(e._childConstructors, function(b, c) {
            var d = c.prototype;
            a.widget(d.namespace + "." + d.widgetName, f, c._proto)
        }), delete e._childConstructors) : c._childConstructors.push(f), a.widget.bridge(b, f), f
    }, a.widget.extend = function(b) {
        for (var d, e, f = c.call(arguments, 1), g = 0, h = f.length; g < h; g++)
            for (d in f[g]) e = f[g][d], f[g].hasOwnProperty(d) && void 0 !== e && (a.isPlainObject(e) ? b[d] = a.isPlainObject(b[d]) ? a.widget.extend({}, b[d], e) : a.widget.extend({}, e) : b[d] = e);
        return b
    }, a.widget.bridge = function(b, d) {
        var e = d.prototype.widgetFullName || b;
        a.fn[b] = function(f) {
            var g = "string" == typeof f,
                h = c.call(arguments, 1),
                i = this;
            return g ? this.length || "instance" !== f ? this.each(function() {
                var c, d = a.data(this, e);
                return "instance" === f ? (i = d, !1) : d ? a.isFunction(d[f]) && "_" !== f.charAt(0) ? (c = d[f].apply(d, h), c !== d && void 0 !== c ? (i = c && c.jquery ? i.pushStack(c.get()) : c, !1) : void 0) : a.error("no such method '" + f + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'")
            }) : i = void 0 : (h.length && (f = a.widget.extend.apply(null, [f].concat(h))), this.each(function() {
                var b = a.data(this, e);
                b ? (b.option(f || {}), b._init && b._init()) : a.data(this, e, new d(f, this))
            })), i
        }
    }, a.Widget = function() {}, a.Widget._childConstructors = [], a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(c, d) {
            d = a(d || this.defaultElement || this)[0], this.element = a(d), this.uuid = b++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = a(), this.hoverable = a(), this.focusable = a(), this.classesElementLookup = {}, d !== this && (a.data(d, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(a) {
                    a.target === d && this.destroy()
                }
            }), this.document = a(d.style ? d.ownerDocument : d.document || d), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)), this.options = a.widget.extend({}, this.options, this._getCreateOptions(), c), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: a.noop,
        _create: a.noop,
        _init: a.noop,
        destroy: function() {
            var b = this;
            this._destroy(), a.each(this.classesElementLookup, function(a, c) {
                b._removeClass(c, a)
            }), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
        },
        _destroy: a.noop,
        widget: function() {
            return this.element
        },
        option: function(b, c) {
            var d, e, f, g = b;
            if (0 === arguments.length) return a.widget.extend({}, this.options);
            if ("string" == typeof b)
                if (g = {}, d = b.split("."), b = d.shift(), d.length) {
                    for (e = g[b] = a.widget.extend({}, this.options[b]), f = 0; f < d.length - 1; f++) e[d[f]] = e[d[f]] || {}, e = e[d[f]];
                    if (b = d.pop(), 1 === arguments.length) return void 0 === e[b] ? null : e[b];
                    e[b] = c
                } else {
                    if (1 === arguments.length) return void 0 === this.options[b] ? null : this.options[b];
                    g[b] = c
                }
            return this._setOptions(g), this
        },
        _setOptions: function(a) {
            var b;
            for (b in a) this._setOption(b, a[b]);
            return this
        },
        _setOption: function(a, b) {
            return "classes" === a && this._setOptionClasses(b), this.options[a] = b, "disabled" === a && this._setOptionDisabled(b), this
        },
        _setOptionClasses: function(b) {
            var c, d, e;
            for (c in b) e = this.classesElementLookup[c], b[c] !== this.options.classes[c] && e && e.length && (d = a(e.get()), this._removeClass(e, c), d.addClass(this._classes({
                element: d,
                keys: c,
                classes: b,
                add: !0
            })))
        },
        _setOptionDisabled: function(a) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!a), a && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(b) {
            function c(c, f) {
                var g, h;
                for (h = 0; h < c.length; h++) g = e.classesElementLookup[c[h]] || a(), g = a(b.add ? a.unique(g.get().concat(b.element.get())) : g.not(b.element).get()), e.classesElementLookup[c[h]] = g, d.push(c[h]), f && b.classes[c[h]] && d.push(b.classes[c[h]])
            }
            var d = [],
                e = this;
            return b = a.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, b), this._on(b.element, {
                remove: "_untrackClassesElement"
            }), b.keys && c(b.keys.match(/\S+/g) || [], !0), b.extra && c(b.extra.match(/\S+/g) || []), d.join(" ")
        },
        _untrackClassesElement: function(b) {
            var c = this;
            a.each(c.classesElementLookup, function(d, e) {
                a.inArray(b.target, e) !== -1 && (c.classesElementLookup[d] = a(e.not(b.target).get()))
            })
        },
        _removeClass: function(a, b, c) {
            return this._toggleClass(a, b, c, !1)
        },
        _addClass: function(a, b, c) {
            return this._toggleClass(a, b, c, !0)
        },
        _toggleClass: function(a, b, c, d) {
            d = "boolean" == typeof d ? d : c;
            var e = "string" == typeof a || null === a,
                f = {
                    extra: e ? b : c,
                    keys: e ? a : b,
                    element: e ? this.element : a,
                    add: d
                };
            return f.element.toggleClass(this._classes(f), d), this
        },
        _on: function(b, c, d) {
            var e, f = this;
            "boolean" != typeof b && (d = c, c = b, b = !1), d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()), a.each(d, function(d, g) {
                function h() {
                    if (b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled")) return ("string" == typeof g ? f[g] : g).apply(f, arguments)
                }
                "string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
                var i = d.match(/^([\w:-]*)\s*(.*)$/),
                    j = i[1] + f.eventNamespace,
                    k = i[2];
                k ? e.on(j, k, h) : c.on(j, h)
            })
        },
        _off: function(b, c) {
            c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, b.off(c).off(c), this.bindings = a(this.bindings.not(b).get()), this.focusable = a(this.focusable.not(b).get()), this.hoverable = a(this.hoverable.not(b).get())
        },
        _delay: function(a, b) {
            function c() {
                return ("string" == typeof a ? d[a] : a).apply(d, arguments)
            }
            var d = this;
            return setTimeout(c, b || 0)
        },
        _hoverable: function(b) {
            this.hoverable = this.hoverable.add(b), this._on(b, {
                mouseenter: function(b) {
                    this._addClass(a(b.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(b) {
                    this._removeClass(a(b.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(b) {
            this.focusable = this.focusable.add(b), this._on(b, {
                focusin: function(b) {
                    this._addClass(a(b.currentTarget), null, "ui-state-focus")
                },
                focusout: function(b) {
                    this._removeClass(a(b.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(b, c, d) {
            var e, f, g = this.options[b];
            if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
                for (e in f) e in c || (c[e] = f[e]);
            return this.element.trigger(c, d), !(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
        }
    }, a.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(b, c) {
        a.Widget.prototype["_" + b] = function(d, e, f) {
            "string" == typeof e && (e = {
                effect: e
            });
            var g, h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
            e = e || {}, "number" == typeof e && (e = {
                duration: e
            }), g = !a.isEmptyObject(e), e.complete = f, e.delay && d.delay(e.delay), g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function(c) {
                a(this)[b](), f && f.call(d[0]), c()
            })
        }
    }), a.widget
});;
/**
 * @file
 * JavaScript for simple autologout.
 */
jQuery(document).ready(function() {
    var time;
    var time_diff;
    var simpleautologout_session_time;
    var logout;

    var uid = drupalSettings.user.uid;
    var timeout = drupalSettings.simpleautologout.timeout;
    var timeout_refresh_rate = drupalSettings.simpleautologout.timeout_refresh_rate;
    var redirect_url = drupalSettings.simpleautologout.redirect_url;
    var simpleautologout_session_time = drupalSettings.simpleautologout.simpleautologout_session_time;

    localStorage.setItem('simpleautologout_session_time', simpleautologout_session_time);

    var checkTimeout = function(simpleautologout_session_time, timeout, redirect_url) {
        var sendData = {
            'uid': uid,
        };
        requestUrl = drupalSettings.path.baseUrl + 'get-last-active-time';

        jQuery.ajax({
            url: requestUrl,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: sendData,
            type: 'POST',
            success: function(response) {
                session_active = response.session_active;
                time = Math.floor(Date.now());
                time_diff = time - simpleautologout_session_time;

                if (time_diff > timeout && session_active == 'true') {
                    logOut(redirect_url);
                } else if (session_active == 'false') {
                    window.location.href = redirect_url;
                }
            },
            error: function(response) {
                window.location.href = redirect_url;
            }
        });
    };

    var logOut = function(redirect_url) {
        requestUrl = drupalSettings.path.baseUrl + 'simple-autologout';
        jQuery.ajax({
            url: requestUrl,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            type: 'GET',
            success: function(response) {
                logout = response.logout;
                if (logout == 'true') {
                    window.location.href = redirect_url;
                }
            },
            error: function(response) {
                console.log('Error:- Cannot logout user.');
            }
        });
    };

    // if user is loged check for inacitvity time
    window.setInterval(function() {
        if (uid > 0) {
            simpleautologout_session_time = localStorage.getItem('simpleautologout_session_time');
            checkTimeout(simpleautologout_session_time, timeout, redirect_url);
        }
    }, timeout_refresh_rate);

    // Bind mousemove events to prevent AutoLogout event.
    jQuery('body').bind('mousemove', function(event) {
        localStorage.setItem('simpleautologout_session_time', Math.floor(Date.now()));
    });

    // Bind keyup events to prevent AutoLogout event. So while typing aything in from fields user cannot be loged out.
    jQuery('body').bind('keyup', function(event) {
        localStorage.setItem('simpleautologout_session_time', Math.floor(Date.now()));
    });

    // Bind scroll events to preventAutoLogout event.
    jQuery(window).bind('scroll', function(event) {
        localStorage.setItem('simpleautologout_session_time', Math.floor(Date.now()));
    });

});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function($, Drupal) {
    Drupal.theme.progressBar = function(id) {
        return '<div id="' + id + '" class="progress" aria-live="polite">' + '<div class="progress__label">&nbsp;</div>' + '<div class="progress__track"><div class="progress__bar"></div></div>' + '<div class="progress__percentage"></div>' + '<div class="progress__description">&nbsp;</div>' + '</div>';
    };

    Drupal.ProgressBar = function(id, updateCallback, method, errorCallback) {
        this.id = id;
        this.method = method || 'GET';
        this.updateCallback = updateCallback;
        this.errorCallback = errorCallback;

        this.element = $(Drupal.theme('progressBar', id));
    };

    $.extend(Drupal.ProgressBar.prototype, {
        setProgress: function setProgress(percentage, message, label) {
            if (percentage >= 0 && percentage <= 100) {
                $(this.element).find('div.progress__bar').css('width', percentage + '%');
                $(this.element).find('div.progress__percentage').html(percentage + '%');
            }
            $('div.progress__description', this.element).html(message);
            $('div.progress__label', this.element).html(label);
            if (this.updateCallback) {
                this.updateCallback(percentage, message, this);
            }
        },
        startMonitoring: function startMonitoring(uri, delay) {
            this.delay = delay;
            this.uri = uri;
            this.sendPing();
        },
        stopMonitoring: function stopMonitoring() {
            clearTimeout(this.timer);

            this.uri = null;
        },
        sendPing: function sendPing() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.uri) {
                var pb = this;

                var uri = this.uri;
                if (uri.indexOf('?') === -1) {
                    uri += '?';
                } else {
                    uri += '&';
                }
                uri += '_format=json';
                $.ajax({
                    type: this.method,
                    url: uri,
                    data: '',
                    dataType: 'json',
                    success: function success(progress) {
                        if (progress.status === 0) {
                            pb.displayError(progress.data);
                            return;
                        }

                        pb.setProgress(progress.percentage, progress.message, progress.label);

                        pb.timer = setTimeout(function() {
                            pb.sendPing();
                        }, pb.delay);
                    },
                    error: function error(xmlhttp) {
                        var e = new Drupal.AjaxError(xmlhttp, pb.uri);
                        pb.displayError('<pre>' + e.message + '</pre>');
                    }
                });
            }
        },
        displayError: function displayError(string) {
            var error = $('<div class="messages messages--error"></div>').html(string);
            $(this.element).before(error).hide();

            if (this.errorCallback) {
                this.errorCallback(this);
            }
        }
    });
})(jQuery, Drupal);;
/**
 * @file
 * Extends methods from core/misc/progress.js.
 */

(function($, Drupal) {

    'use strict';

    /**
     * Theme function for the progress bar.
     *
     * @param {string} id
     *
     * @return {string}
     *   The HTML for the progress bar.
     */
    Drupal.theme.progressBar = function(id) {
        return '<div class="progress-wrapper" aria-live="polite">' +
            '<div class="message"></div>' +
            '<div id ="' + id + '" class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
            '<span class="percentage"></span>' +
            '</div>' +
            '</div>' +
            '<div class="progress-label"></div>' +
            '</div>';
    };

    $.extend(Drupal.ProgressBar.prototype, /** @lends Drupal.ProgressBar */ {

        /**
         * Set the percentage and status message for the progressbar.
         *
         * @param {number} percentage
         * @param {string} message
         * @param {string} label
         */
        setProgress: function(percentage, message, label) {
            if (percentage >= 0 && percentage <= 100) {
                $(this.element).find('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage);
                $(this.element).find('.percentage').html(percentage + '%');
            }
            if (message) {
                // Remove the unnecessary whitespace at the end of the message.
                message = message.replace(/<br\/>&nbsp;|\s*$/, '');

                $('.message', this.element).html(message);
            }
            if (label) {
                $('.progress-label', this.element).html(label);
            }
            if (this.updateCallback) {
                this.updateCallback(percentage, message, this);
            }
        },

        /**
         * Display errors on the page.
         *
         * @param {string} string
         */
        displayError: function(string) {
            var error = $('<div class="alert alert-block alert-error"><button class="close" data-dismiss="alert">&times;</button><h4>' + Drupal.t('Error message') + '</h4></div>').append(string);
            $(this.element).before(error).hide();

            if (this.errorCallback) {
                this.errorCallback(this);
            }
        }
    });

})(jQuery, Drupal);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function(Drupal) {
    Drupal.behaviors.responsiveImageAJAX = {
        attach: function attach() {
            if (window.picturefill) {
                window.picturefill();
            }
        }
    };
})(Drupal);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/
function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}

(function($, window, Drupal, drupalSettings) {
    Drupal.behaviors.AJAX = {
        attach: function attach(context, settings) {
            function loadAjaxBehavior(base) {
                var elementSettings = settings.ajax[base];
                if (typeof elementSettings.selector === 'undefined') {
                    elementSettings.selector = '#' + base;
                }
                $(elementSettings.selector).once('drupal-ajax').each(function() {
                    elementSettings.element = this;
                    elementSettings.base = base;
                    Drupal.ajax(elementSettings);
                });
            }

            Object.keys(settings.ajax || {}).forEach(function(base) {
                return loadAjaxBehavior(base);
            });

            Drupal.ajax.bindAjaxLinks(document.body);

            $('.use-ajax-submit').once('ajax').each(function() {
                var elementSettings = {};

                elementSettings.url = $(this.form).attr('action');

                elementSettings.setClick = true;

                elementSettings.event = 'click';

                elementSettings.progress = {
                    type: 'throbber'
                };
                elementSettings.base = $(this).attr('id');
                elementSettings.element = this;

                Drupal.ajax(elementSettings);
            });
        },
        detach: function detach(context, settings, trigger) {
            if (trigger === 'unload') {
                Drupal.ajax.expired().forEach(function(instance) {
                    Drupal.ajax.instances[instance.instanceIndex] = null;
                });
            }
        }
    };

    Drupal.AjaxError = function(xmlhttp, uri, customMessage) {
        var statusCode = void 0;
        var statusText = void 0;
        var responseText = void 0;
        if (xmlhttp.status) {
            statusCode = '\n' + Drupal.t('An AJAX HTTP error occurred.') + '\n' + Drupal.t('HTTP Result Code: !status', {
                '!status': xmlhttp.status
            });
        } else {
            statusCode = '\n' + Drupal.t('An AJAX HTTP request terminated abnormally.');
        }
        statusCode += '\n' + Drupal.t('Debugging information follows.');
        var pathText = '\n' + Drupal.t('Path: !uri', {
            '!uri': uri
        });
        statusText = '';

        try {
            statusText = '\n' + Drupal.t('StatusText: !statusText', {
                '!statusText': $.trim(xmlhttp.statusText)
            });
        } catch (e) {}

        responseText = '';

        try {
            responseText = '\n' + Drupal.t('ResponseText: !responseText', {
                '!responseText': $.trim(xmlhttp.responseText)
            });
        } catch (e) {}

        responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '');
        responseText = responseText.replace(/[\n]+\s+/g, '\n');

        var readyStateText = xmlhttp.status === 0 ? '\n' + Drupal.t('ReadyState: !readyState', {
            '!readyState': xmlhttp.readyState
        }) : '';

        customMessage = customMessage ? '\n' + Drupal.t('CustomMessage: !customMessage', {
            '!customMessage': customMessage
        }) : '';

        this.message = statusCode + pathText + statusText + customMessage + responseText + readyStateText;

        this.name = 'AjaxError';
    };

    Drupal.AjaxError.prototype = new Error();
    Drupal.AjaxError.prototype.constructor = Drupal.AjaxError;

    Drupal.ajax = function(settings) {
        if (arguments.length !== 1) {
            throw new Error('Drupal.ajax() function must be called with one configuration object only');
        }

        var base = settings.base || false;
        var element = settings.element || false;
        delete settings.base;
        delete settings.element;

        if (!settings.progress && !element) {
            settings.progress = false;
        }

        var ajax = new Drupal.Ajax(base, element, settings);
        ajax.instanceIndex = Drupal.ajax.instances.length;
        Drupal.ajax.instances.push(ajax);

        return ajax;
    };

    Drupal.ajax.instances = [];

    Drupal.ajax.expired = function() {
        return Drupal.ajax.instances.filter(function(instance) {
            return instance && instance.element !== false && !document.body.contains(instance.element);
        });
    };

    Drupal.ajax.bindAjaxLinks = function(element) {
        $(element).find('.use-ajax').once('ajax').each(function(i, ajaxLink) {
            var $linkElement = $(ajaxLink);

            var elementSettings = {
                progress: {
                    type: 'throbber'
                },
                dialogType: $linkElement.data('dialog-type'),
                dialog: $linkElement.data('dialog-options'),
                dialogRenderer: $linkElement.data('dialog-renderer'),
                base: $linkElement.attr('id'),
                element: ajaxLink
            };
            var href = $linkElement.attr('href');

            if (href) {
                elementSettings.url = href;
                elementSettings.event = 'click';
            }
            Drupal.ajax(elementSettings);
        });
    };

    Drupal.Ajax = function(base, element, elementSettings) {
        var defaults = {
            event: element ? 'mousedown' : null,
            keypress: true,
            selector: base ? '#' + base : null,
            effect: 'none',
            speed: 'none',
            method: 'replaceWith',
            progress: {
                type: 'throbber',
                message: Drupal.t('Please wait...')
            },
            submit: {
                js: true
            }
        };

        $.extend(this, defaults, elementSettings);

        this.commands = new Drupal.AjaxCommands();

        this.instanceIndex = false;

        if (this.wrapper) {
            this.wrapper = '#' + this.wrapper;
        }

        this.element = element;

        this.element_settings = elementSettings;

        this.elementSettings = elementSettings;

        if (this.element && this.element.form) {
            this.$form = $(this.element.form);
        }

        if (!this.url) {
            var $element = $(this.element);
            if ($element.is('a')) {
                this.url = $element.attr('href');
            } else if (this.element && element.form) {
                this.url = this.$form.attr('action');
            }
        }

        var originalUrl = this.url;

        this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, '/ajax$1');

        if (drupalSettings.ajaxTrustedUrl[originalUrl]) {
            drupalSettings.ajaxTrustedUrl[this.url] = true;
        }

        var ajax = this;

        ajax.options = {
            url: ajax.url,
            data: ajax.submit,
            beforeSerialize: function beforeSerialize(elementSettings, options) {
                return ajax.beforeSerialize(elementSettings, options);
            },
            beforeSubmit: function beforeSubmit(formValues, elementSettings, options) {
                ajax.ajaxing = true;
                return ajax.beforeSubmit(formValues, elementSettings, options);
            },
            beforeSend: function beforeSend(xmlhttprequest, options) {
                ajax.ajaxing = true;
                return ajax.beforeSend(xmlhttprequest, options);
            },
            success: function success(response, status, xmlhttprequest) {
                if (typeof response === 'string') {
                    response = $.parseJSON(response);
                }

                if (response !== null && !drupalSettings.ajaxTrustedUrl[ajax.url]) {
                    if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') {
                        var customMessage = Drupal.t('The response failed verification so will not be processed.');
                        return ajax.error(xmlhttprequest, ajax.url, customMessage);
                    }
                }

                return ajax.success(response, status);
            },
            complete: function complete(xmlhttprequest, status) {
                ajax.ajaxing = false;
                if (status === 'error' || status === 'parsererror') {
                    return ajax.error(xmlhttprequest, ajax.url);
                }
            },

            dataType: 'json',
            type: 'POST'
        };

        if (elementSettings.dialog) {
            ajax.options.data.dialogOptions = elementSettings.dialog;
        }

        if (ajax.options.url.indexOf('?') === -1) {
            ajax.options.url += '?';
        } else {
            ajax.options.url += '&';
        }

        var wrapper = 'drupal_' + (elementSettings.dialogType || 'ajax');
        if (elementSettings.dialogRenderer) {
            wrapper += '.' + elementSettings.dialogRenderer;
        }
        ajax.options.url += Drupal.ajax.WRAPPER_FORMAT + '=' + wrapper;

        $(ajax.element).on(elementSettings.event, function(event) {
            if (!drupalSettings.ajaxTrustedUrl[ajax.url] && !Drupal.url.isLocal(ajax.url)) {
                throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', {
                    '!url': ajax.url
                }));
            }
            return ajax.eventResponse(this, event);
        });

        if (elementSettings.keypress) {
            $(ajax.element).on('keypress', function(event) {
                return ajax.keypressResponse(this, event);
            });
        }

        if (elementSettings.prevent) {
            $(ajax.element).on(elementSettings.prevent, false);
        }
    };

    Drupal.ajax.WRAPPER_FORMAT = '_wrapper_format';

    Drupal.Ajax.AJAX_REQUEST_PARAMETER = '_drupal_ajax';

    Drupal.Ajax.prototype.execute = function() {
        if (this.ajaxing) {
            return;
        }

        try {
            this.beforeSerialize(this.element, this.options);

            return $.ajax(this.options);
        } catch (e) {
            this.ajaxing = false;
            window.alert('An error occurred while attempting to process ' + this.options.url + ': ' + e.message);

            return $.Deferred().reject();
        }
    };

    Drupal.Ajax.prototype.keypressResponse = function(element, event) {
        var ajax = this;

        if (event.which === 13 || event.which === 32 && element.type !== 'text' && element.type !== 'textarea' && element.type !== 'tel' && element.type !== 'number') {
            event.preventDefault();
            event.stopPropagation();
            $(element).trigger(ajax.elementSettings.event);
        }
    };

    Drupal.Ajax.prototype.eventResponse = function(element, event) {
        event.preventDefault();
        event.stopPropagation();

        var ajax = this;

        if (ajax.ajaxing) {
            return;
        }

        try {
            if (ajax.$form) {
                if (ajax.setClick) {
                    element.form.clk = element;
                }

                ajax.$form.ajaxSubmit(ajax.options);
            } else {
                ajax.beforeSerialize(ajax.element, ajax.options);
                $.ajax(ajax.options);
            }
        } catch (e) {
            ajax.ajaxing = false;
            window.alert('An error occurred while attempting to process ' + ajax.options.url + ': ' + e.message);
        }
    };

    Drupal.Ajax.prototype.beforeSerialize = function(element, options) {
        if (this.$form && document.body.contains(this.$form.get(0))) {
            var settings = this.settings || drupalSettings;
            Drupal.detachBehaviors(this.$form.get(0), settings, 'serialize');
        }

        options.data[Drupal.Ajax.AJAX_REQUEST_PARAMETER] = 1;

        var pageState = drupalSettings.ajaxPageState;
        options.data['ajax_page_state[theme]'] = pageState.theme;
        options.data['ajax_page_state[theme_token]'] = pageState.theme_token;
        options.data['ajax_page_state[libraries]'] = pageState.libraries;
    };

    Drupal.Ajax.prototype.beforeSubmit = function(formValues, element, options) {};

    Drupal.Ajax.prototype.beforeSend = function(xmlhttprequest, options) {
        if (this.$form) {
            options.extraData = options.extraData || {};

            options.extraData.ajax_iframe_upload = '1';

            var v = $.fieldValue(this.element);
            if (v !== null) {
                options.extraData[this.element.name] = v;
            }
        }

        $(this.element).prop('disabled', true);

        if (!this.progress || !this.progress.type) {
            return;
        }

        var progressIndicatorMethod = 'setProgressIndicator' + this.progress.type.slice(0, 1).toUpperCase() + this.progress.type.slice(1).toLowerCase();
        if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === 'function') {
            this[progressIndicatorMethod].call(this);
        }
    };

    Drupal.theme.ajaxProgressThrobber = function(message) {
        var messageMarkup = typeof message === 'string' ? Drupal.theme('ajaxProgressMessage', message) : '';
        var throbber = '<div class="throbber">&nbsp;</div>';

        return '<div class="ajax-progress ajax-progress-throbber">' + throbber + messageMarkup + '</div>';
    };

    Drupal.theme.ajaxProgressIndicatorFullscreen = function() {
        return '<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>';
    };

    Drupal.theme.ajaxProgressMessage = function(message) {
        return '<div class="message">' + message + '</div>';
    };

    Drupal.Ajax.prototype.setProgressIndicatorBar = function() {
        var progressBar = new Drupal.ProgressBar('ajax-progress-' + this.element.id, $.noop, this.progress.method, $.noop);
        if (this.progress.message) {
            progressBar.setProgress(-1, this.progress.message);
        }
        if (this.progress.url) {
            progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
        }
        this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
        this.progress.object = progressBar;
        $(this.element).after(this.progress.element);
    };

    Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
        this.progress.element = $(Drupal.theme('ajaxProgressThrobber', this.progress.message));
        $(this.element).after(this.progress.element);
    };

    Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function() {
        this.progress.element = $(Drupal.theme('ajaxProgressIndicatorFullscreen'));
        $('body').after(this.progress.element);
    };

    Drupal.Ajax.prototype.success = function(response, status) {
        var _this = this;

        if (this.progress.element) {
            $(this.progress.element).remove();
        }
        if (this.progress.object) {
            this.progress.object.stopMonitoring();
        }
        $(this.element).prop('disabled', false);

        var elementParents = $(this.element).parents('[data-drupal-selector]').addBack().toArray();

        var focusChanged = false;
        Object.keys(response || {}).forEach(function(i) {
            if (response[i].command && _this.commands[response[i].command]) {
                _this.commands[response[i].command](_this, response[i], status);
                if (response[i].command === 'invoke' && response[i].method === 'focus') {
                    focusChanged = true;
                }
            }
        });

        if (!focusChanged && this.element && !$(this.element).data('disable-refocus')) {
            var target = false;

            for (var n = elementParents.length - 1; !target && n >= 0; n--) {
                target = document.querySelector('[data-drupal-selector="' + elementParents[n].getAttribute('data-drupal-selector') + '"]');
            }

            if (target) {
                $(target).trigger('focus');
            }
        }

        if (this.$form && document.body.contains(this.$form.get(0))) {
            var settings = this.settings || drupalSettings;
            Drupal.attachBehaviors(this.$form.get(0), settings);
        }

        this.settings = null;
    };

    Drupal.Ajax.prototype.getEffect = function(response) {
        var type = response.effect || this.effect;
        var speed = response.speed || this.speed;

        var effect = {};
        if (type === 'none') {
            effect.showEffect = 'show';
            effect.hideEffect = 'hide';
            effect.showSpeed = '';
        } else if (type === 'fade') {
            effect.showEffect = 'fadeIn';
            effect.hideEffect = 'fadeOut';
            effect.showSpeed = speed;
        } else {
            effect.showEffect = type + 'Toggle';
            effect.hideEffect = type + 'Toggle';
            effect.showSpeed = speed;
        }

        return effect;
    };

    Drupal.Ajax.prototype.error = function(xmlhttprequest, uri, customMessage) {
        if (this.progress.element) {
            $(this.progress.element).remove();
        }
        if (this.progress.object) {
            this.progress.object.stopMonitoring();
        }

        $(this.wrapper).show();

        $(this.element).prop('disabled', false);

        if (this.$form && document.body.contains(this.$form.get(0))) {
            var settings = this.settings || drupalSettings;
            Drupal.attachBehaviors(this.$form.get(0), settings);
        }
        throw new Drupal.AjaxError(xmlhttprequest, uri, customMessage);
    };

    Drupal.theme.ajaxWrapperNewContent = function($newContent, ajax, response) {
        return (response.effect || ajax.effect) !== 'none' && $newContent.filter(function(i) {
            return !($newContent[i].nodeName === '#comment' || $newContent[i].nodeName === '#text' && /^(\s|\n|\r)*$/.test($newContent[i].textContent));
        }).length > 1 ? Drupal.theme('ajaxWrapperMultipleRootElements', $newContent) : $newContent;
    };

    Drupal.theme.ajaxWrapperMultipleRootElements = function($elements) {
        return $('<div></div>').append($elements);
    };

    Drupal.AjaxCommands = function() {};
    Drupal.AjaxCommands.prototype = {
        insert: function insert(ajax, response) {
            var $wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
            var method = response.method || ajax.method;
            var effect = ajax.getEffect(response);

            var settings = response.settings || ajax.settings || drupalSettings;

            var $newContent = $($.parseHTML(response.data, document, true));

            $newContent = Drupal.theme('ajaxWrapperNewContent', $newContent, ajax, response);

            switch (method) {
                case 'html':
                case 'replaceWith':
                case 'replaceAll':
                case 'empty':
                case 'remove':
                    Drupal.detachBehaviors($wrapper.get(0), settings);
                    break;
                default:
                    break;
            }

            $wrapper[method]($newContent);

            if (effect.showEffect !== 'show') {
                $newContent.hide();
            }

            var $ajaxNewContent = $newContent.find('.ajax-new-content');
            if ($ajaxNewContent.length) {
                $ajaxNewContent.hide();
                $newContent.show();
                $ajaxNewContent[effect.showEffect](effect.showSpeed);
            } else if (effect.showEffect !== 'show') {
                $newContent[effect.showEffect](effect.showSpeed);
            }

            if ($newContent.parents('html').length) {
                $newContent.each(function(index, element) {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        Drupal.attachBehaviors(element, settings);
                    }
                });
            }
        },
        remove: function remove(ajax, response, status) {
            var settings = response.settings || ajax.settings || drupalSettings;
            $(response.selector).each(function() {
                Drupal.detachBehaviors(this, settings);
            }).remove();
        },
        changed: function changed(ajax, response, status) {
            var $element = $(response.selector);
            if (!$element.hasClass('ajax-changed')) {
                $element.addClass('ajax-changed');
                if (response.asterisk) {
                    $element.find(response.asterisk).append(' <abbr class="ajax-changed" title="' + Drupal.t('Changed') + '">*</abbr> ');
                }
            }
        },
        alert: function alert(ajax, response, status) {
            window.alert(response.text, response.title);
        },
        announce: function announce(ajax, response) {
            if (response.priority) {
                Drupal.announce(response.text, response.priority);
            } else {
                Drupal.announce(response.text);
            }
        },
        redirect: function redirect(ajax, response, status) {
            window.location = response.url;
        },
        css: function css(ajax, response, status) {
            $(response.selector).css(response.argument);
        },
        settings: function settings(ajax, response, status) {
            var ajaxSettings = drupalSettings.ajax;

            if (ajaxSettings) {
                Drupal.ajax.expired().forEach(function(instance) {

                    if (instance.selector) {
                        var selector = instance.selector.replace('#', '');
                        if (selector in ajaxSettings) {
                            delete ajaxSettings[selector];
                        }
                    }
                });
            }

            if (response.merge) {
                $.extend(true, drupalSettings, response.settings);
            } else {
                ajax.settings = response.settings;
            }
        },
        data: function data(ajax, response, status) {
            $(response.selector).data(response.name, response.value);
        },
        invoke: function invoke(ajax, response, status) {
            var $element = $(response.selector);
            $element[response.method].apply($element, _toConsumableArray(response.args));
        },
        restripe: function restripe(ajax, response, status) {
            $(response.selector).find('> tbody > tr:visible, > tr:visible').removeClass('odd even').filter(':even').addClass('odd').end().filter(':odd').addClass('even');
        },
        update_build_id: function update_build_id(ajax, response, status) {
            $('input[name="form_build_id"][value="' + response.old + '"]').val(response.new);
        },
        add_css: function add_css(ajax, response, status) {
            $('head').prepend(response.data);

            var match = void 0;
            var importMatch = /^@import url\("(.*)"\);$/gim;
            if (document.styleSheets[0].addImport && importMatch.test(response.data)) {
                importMatch.lastIndex = 0;
                do {
                    match = importMatch.exec(response.data);
                    document.styleSheets[0].addImport(match[1]);
                } while (match);
            }
        }
    };
})(jQuery, window, Drupal, drupalSettings);;
/**
 * @file
 * Extends methods from core/misc/ajax.js.
 */

(function($, window, Drupal, drupalSettings) {

    /**
     * Attempts to find the closest glyphicon progress indicator.
     *
     * @param {jQuery|Element} element
     *   A DOM element.
     *
     * @returns {jQuery}
     *   A jQuery object.
     */
    Drupal.Ajax.prototype.findGlyphicon = function(element) {
        return $(element).closest('.form-item').find('.ajax-progress.glyphicon')
    };

    /**
     * Starts the spinning of the glyphicon progress indicator.
     *
     * @param {jQuery|Element} element
     *   A DOM element.
     * @param {string} [message]
     *   An optional message to display (tooltip) for the progress.
     *
     * @returns {jQuery}
     *   A jQuery object.
     */
    Drupal.Ajax.prototype.glyphiconStart = function(element, message) {
        var $glyphicon = this.findGlyphicon(element);
        if ($glyphicon[0]) {
            $glyphicon.addClass('glyphicon-spin');

            // Add any message as a tooltip to the glyphicon.
            if ($.fn.tooltip && drupalSettings.bootstrap.tooltip_enabled) {
                $glyphicon
                    .removeAttr('data-toggle')
                    .removeAttr('data-original-title')
                    .removeAttr('title')
                    .tooltip('destroy');

                if (message) {
                    $glyphicon.attr('data-toggle', 'tooltip').attr('title', message).tooltip();
                }
            }

            // Append a message for screen readers.
            if (message) {
                $glyphicon.parent().append('<div class="sr-only message">' + message + '</div>');
            }
        }
        return $glyphicon;
    };

    /**
     * Stop the spinning of a glyphicon progress indicator.
     *
     * @param {jQuery|Element} element
     *   A DOM element.
     */
    Drupal.Ajax.prototype.glyphiconStop = function(element) {
        var $glyphicon = this.findGlyphicon(element);
        if ($glyphicon[0]) {
            $glyphicon.removeClass('glyphicon-spin');
            if ($.fn.tooltip && drupalSettings.bootstrap.tooltip_enabled) {
                $glyphicon
                    .removeAttr('data-toggle')
                    .removeAttr('data-original-title')
                    .removeAttr('title')
                    .tooltip('destroy');
            }
        }
    };

    /**
     * Sets the throbber progress indicator.
     */
    Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
        var $element = $(this.element);

        // Find an existing glyphicon progress indicator.
        var $glyphicon = this.glyphiconStart($element, this.progress.message);
        if ($glyphicon[0]) {
            this.progress.element = $glyphicon.parent();
            this.progress.glyphicon = true;
            return;
        }

        // Otherwise, add a glyphicon throbber after the element.
        if (!this.progress.element) {
            this.progress.element = $(Drupal.theme('ajaxThrobber'));
        }
        if (this.progress.message) {
            this.progress.element.after('<div class="message">' + this.progress.message + '</div>');
        }

        // If element is an input DOM element type (not :input), append after.
        if ($element.is('input')) {
            $element.after(this.progress.element);
        }
        // Otherwise append the throbber inside the element.
        else {
            $element.append(this.progress.element);
        }
    };


    /**
     * Handler for the form redirection completion.
     *
     * @param {Array.<Drupal.AjaxCommands~commandDefinition>} response
     * @param {number} status
     */
    Drupal.Ajax.prototype.success = function(response, status) {
        if (this.progress.element) {

            // Stop a glyphicon throbber.
            if (this.progress.glyphicon) {
                this.glyphiconStop(this.progress.element);
            }
            // Remove the progress element.
            else {
                this.progress.element.remove();
            }

            // Remove any message set.
            this.progress.element.parent().find('.message').remove();
        }

        // --------------------------------------------------------
        // Everything below is from core/misc/ajax.js.
        // --------------------------------------------------------

        if (this.progress.object) {
            this.progress.object.stopMonitoring();
        }
        $(this.element).prop('disabled', false);

        // Save element's ancestors tree so if the element is removed from the dom
        // we can try to refocus one of its parents. Using addBack reverse the
        // result array, meaning that index 0 is the highest parent in the hierarchy
        // in this situation it is usually a <form> element.
        var elementParents = $(this.element).parents('[data-drupal-selector]').addBack().toArray();

        // Track if any command is altering the focus so we can avoid changing the
        // focus set by the Ajax command.
        var focusChanged = false;
        for (var i in response) {
            if (response.hasOwnProperty(i) && response[i].command && this.commands[response[i].command]) {
                this.commands[response[i].command](this, response[i], status);
                if (response[i].command === 'invoke' && response[i].method === 'focus') {
                    focusChanged = true;
                }
            }
        }

        // If the focus hasn't be changed by the ajax commands, try to refocus the
        // triggering element or one of its parents if that element does not exist
        // anymore.
        if (!focusChanged && this.element && !$(this.element).data('disable-refocus')) {
            var target = false;

            for (var n = elementParents.length - 1; !target && n > 0; n--) {
                target = document.querySelector('[data-drupal-selector="' + elementParents[n].getAttribute('data-drupal-selector') + '"]');
            }

            if (target) {
                $(target).trigger('focus');
            }
        }

        // Reattach behaviors, if they were detached in beforeSerialize(). The
        // attachBehaviors() called on the new content from processing the response
        // commands is not sufficient, because behaviors from the entire form need
        // to be reattached.
        if (this.$form) {
            var settings = this.settings || drupalSettings;
            Drupal.attachBehaviors(this.$form.get(0), settings);
        }

        // Remove any response-specific settings so they don't get used on the next
        // call by mistake.
        this.settings = null;
    };

})(jQuery, this, Drupal, drupalSettings);;
(function($, window, Drupal, drupalSettings) {

    'use strict';
    /**
     * Prepare the Ajax request before it is sent.
     *
     * @param {XMLHttpRequest} xmlhttprequest
     * @param {object} options
     * @param {object} options.extraData
     */
    Drupal.Ajax.prototype.beforeSend = function(xmlhttprequest, options) {
        // For forms without file inputs, the jQuery Form plugin serializes the
        // form values, and then calls jQuery's $.ajax() function, which invokes
        // this handler. In this circumstance, options.extraData is never used. For
        // forms with file inputs, the jQuery Form plugin uses the browser's normal
        // form submission mechanism, but captures the response in a hidden IFRAME.
        // In this circumstance, it calls this handler first, and then appends
        // hidden fields to the form to submit the values in options.extraData.
        // There is no simple way to know which submission mechanism will be used,
        // so we add to extraData regardless, and allow it to be ignored in the
        // former case.
        if (this.$form) {
            options.extraData = options.extraData || {};

            // Let the server know when the IFRAME submission mechanism is used. The
            // server can use this information to wrap the JSON response in a
            // TEXTAREA, as per http://jquery.malsup.com/form/#file-upload.
            options.extraData.ajax_iframe_upload = '1';

            // The triggering element is about to be disabled (see below), but if it
            // contains a value (e.g., a checkbox, textfield, select, etc.), ensure
            // that value is included in the submission. As per above, submissions
            // that use $.ajax() are already serialized prior to the element being
            // disabled, so this is only needed for IFRAME submissions.
            var v = $.fieldValue(this.element);
            if (v !== null) {
                options.extraData[this.element.name] = v;
            }
        }

        // Disable the element that received the change to prevent user interface
        // interaction while the Ajax request is in progress. ajax.ajaxing prevents
        // the element from triggering a new request, but does not prevent the user
        // from changing its value.
        $(this.element).prop('disabled', true);

        if (!this.progress || !this.progress.type) {
            return;
        }

        // Insert progress indicator.
        if (this.progress.type == 'throbber' && drupalSettings.ajaxLoader.alwaysFullscreen) {
            // Always show throbber as fullscreen overlay.
            this.progress.type = 'fullscreen';
        }
        var progressIndicatorMethod = 'setProgressIndicator' + this.progress.type.slice(0, 1).toUpperCase() + this.progress.type.slice(1).toLowerCase();
        if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === 'function') {
            this[progressIndicatorMethod].call(this);
        }
    };

    /**
     * Overrides the throbber progress indicator.
     */
    Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
        this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="ajax-loader">' + drupalSettings.ajaxLoader.markup + '</div></div>');
        if (this.progress.message && !drupalSettings.ajaxLoader.hideAjaxMessage) {
            this.progress.element.find('.ajax-loader').after('<div class="message">' + this.progress.message + '</div>');
        }
        $(this.element).after(this.progress.element);
    };

    /**
     * Sets the fullscreen progress indicator.
     */
    Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function() {
        this.progress.element = $('<div class="ajax-progress ajax-progress-fullscreen">' + drupalSettings.ajaxLoader.markup + '</div>');
        $(drupalSettings.ajaxLoader.throbberPosition).after(this.progress.element);
    };

})(jQuery, this, Drupal, drupalSettings);;

(function($, Drupal, drupalSettings) {
    "use strict";
    Drupal.behaviors.contentBehavior = {
        attach: function(context, settings) {
            var hash, addonslide, $bundleProducts, bundleProductsSlider, scrollTop, headerH, talktimeslide, pageURL = window.location.href,
                tncActiveClass;


            addonslide = {
                dots: false,
                arrows: false,
                infinite: true,
                slidesToShow: 3,
                speed: 1000,
                cssEase: "ease-in-out",
                centerMode: true,
                responsive: [{
                        breakpoint: 769,
                        settings: {
                            arrow: false,
                            slidesToShow: 3,
                            centerMode: true

                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            arrow: false,
                            slidesToShow: 1,
                            centerMode: true
                        }
                    }
                ]
            };
            talktimeslide = {
                dots: false,
                arrows: false,
                infinite: true,
                slidesToShow: 4,
                speed: 1000,
                cssEase: "ease-in-out",
                responsive: [{
                        breakpoint: 769,
                        settings: {
                            arrow: false,
                            slidesToShow: 3,
                            centerMode: true

                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            arrow: false,
                            slidesToShow: 1,
                            centerMode: true
                        }
                    }
                ]
            };
            $(".internet-addons .view-prepaid-talktime-addons .views-row").not(".slick-initialized").slick(addonslide);
            $(".block-talk-time-services .view-prepaid-talktime-addons .views-row").not(".slick-initialized").slick(talktimeslide);


            $bundleProducts = $(".recommend-products .field--name-field-phone-bundles");
            bundleProductsSlider = {
                dots: false,
                arrows: true,
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                centerMode: false,
                focusOnSelect: false,
                variableWidth: false,
                speed: 1000,
                cssEase: "ease-in-out",
                responsive: [{
                        breakpoint: 769,
                        settings: {
                            arrow: false,
                            slidesToShow: 2,
                            centerMode: true,
                            variableWidth: true
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            arrow: false,
                            slidesToShow: 1,
                            centerMode: true,
                            variableWidth: true
                        }
                    }
                ]
            };
            $bundleProducts.not(".slick-initialized").slick(bundleProductsSlider);


            var $selectBankBlock = $(".page-node-type-static-pages .select-wrapper"),
                $announcementsOuterWrapper = $(".page-node-type-static-pages .announcements-outer-wrapper"),
                $announcementsDetailsOuterWrapper = $announcementsOuterWrapper.find(".announcements-details-outer-wrapper");

            $('.page-node-type-static-pages .talktime-tab').click(function() {
                var tab_id = $(this).attr('data-tab');
                $('.page-node-type-static-pages .talktime-tab').removeClass('active');
                $('.page-node-type-static-pages .talktime-content').removeClass('active');
                $(this).addClass('active');
                $("#" + tab_id).addClass('active');
            });

            $('.page-node-type-static-pages .transfer-option-a').click(function() {
                var tab_id = $(this).attr('data-tab');
                $('.page-node-type-static-pages .transfer-option-a').removeClass('active');
                $('.page-node-type-static-pages .options-tab-wrapper').removeClass('active');
                $(this).addClass('active');
                $("#" + tab_id).addClass('active');
            });


            $('.page-node-type-static-pages .talktime-content-a').click(function() {
                var tab_id = $(this).attr('data-tab');
                $('.page-node-type-static-pages .talktime-content-a').removeClass('active');
                $('.page-node-type-static-pages .talktime-step-option').removeClass('active');
                $(this).addClass('active');
                $("#" + tab_id).addClass('active');
            });



            $(".page-node-type-static-pages .talktime-content-a").click(function() {
                var tab_id = $(this).attr('data-tab');
                $('.page-node-type-static-pages .talktime-content-a').removeClass('active');
                $('.page-node-type-static-pages .talktime-step-option').removeClass('active');
                $(this).addClass('active');
                $("#" + tab_id).addClass('active');
            });

            /* Slick needs no get Reinitialized on window Resize after it was destroyed */
            $(window).on("load resize orientationchange", function() {
                $(".page-node-type-static-pages .talktime-tab-nav, .page-node-type-static-pages .internet-tab-nav,.page-node-type-static-pages .passes:not(.no-slick)").each(function() {
                    var $carousel = $(this);
                    /* Initializes a slick carousel only on mobile screens */
                    // slick on mobile
                    var slidetoShow = 0,
                        windowWidth = 0;
                    if ($(".page-node-type-static-pages .passes:not(.no-slick)").length > 0) {
                        slidetoShow = 1;
                        windowWidth = 767;
                    } else {
                        slidetoShow = 2;
                        windowWidth = 768;
                    }
                    if ($(window).width() > windowWidth) {
                        if ($carousel.hasClass('slick-initialized')) {
                            $carousel.slick('unslick');
                        }
                    } else {
                        if (!$carousel.hasClass('slick-initialized')) {
                            $carousel.slick({
                                dots: false,
                                arrows: false,
                                slidesToShow: slidetoShow,
                                infinite: true,
                                slidesToScroll: 1,
                                centerMode: false,
                                focusOnSelect: false,
                                speed: 1000,
                                variableWidth: true,
                                cssEase: "ease-in-out"
                            });
                        }
                    }
                });

            });
            $(".page-node-type-static-pages .full-width-section .subscribe-option").once().on("click", function() {
                $(this).parent().next().toggleClass("hidden");
                $(this).toggleClass("open");
            });

            if (window.innerWidth <= 768) {

                $(".page-node-type-static-pages .four-grid-layout").not(".slick-initialized").slick({
                    dots: false,
                    arrows: false,
                    slidesToShow: 1,
                    infinite: true,
                    slidesToScroll: 1,
                    centerMode: false,
                    focusOnSelect: false,
                    speed: 1000,
                    variableWidth: true,
                    cssEase: "ease-in-out"
                });
            }

            if ($(".global_video_parent#video").length) {
                $(".global_video_parent#video").once().simplePlayer();
            }
            /* tnc pages */
            $(".page-node-type-static-pages  .full-width-section .quick-links .faq").on("click", function() {
                $(".page-node-type-static-pages  .label-links").toggleClass("hidden");
                var tabslinks = $(".label-links");
                if ($(window).width() <= 768) {
                    $(".tnc").before(tabslinks);
                }
                if (!$(".page-node-type-static-pages  .label-links").hasClass("hidden")) {
                    $(this).addClass("active");
                    $(this).next(".views-field-field-quick-links-icon").addClass("active");
                } else {
                    $(this).removeClass("active");
                    $(this).next(".views-field-field-quick-links-icon").removeClass("active");
                }
            });
            // add remove all active circles active class to tnc circle if url has # para
            if (window.location.href.indexOf("tnc") > -1 && window.location.hash.substr(1).length > -1) {
                $('.tnc-item-wrapper').removeClass('active');
                tncActiveClass = window.location.hash.substr(1);
                $("." + tncActiveClass).addClass('active');
            }

            $(".page-node-type-static-pages .country-title").once().on("click", function() {
                $(this).toggleClass("open");
                $(".country-list").toggleClass("hidden-xs hidden-sm");
            });

            $selectBankBlock.find(".myselect").select2({
                enableSearch: false
            });
            $('.page-node-type-static-pages .fourth a').click(function() {
                $(this).parents(".flip-container").toggleClass('active');
            });




            /*on load if url has country then set dropdown, and chage dynamic values*/

            function getValuesFromUrl() {
                // Construct URL object using current browser URL
                var url = new URL(document.location);
                var params = url.searchParams;
                var planType = params.get("plan-type");
                var country = params.get("country");
                var $dropdownsCat = $("#category-change");
                var $dropdownsCountry = $(".rates-country").not('.hidden');


                if ($dropdownsCat.val() !== planType) {
                    $dropdownsCat.find('option').each(function() {
                        if ($(this).val() === planType) {
                            $("#category-change").val(planType);
                            setTimeout(function() {
                                $dropdownsCat.select2().trigger('change');
                            }, 1000);
                        }
                    });
                }

                if ($dropdownsCountry.val() !== country) {
                    $dropdownsCountry.find('option').each(function() {
                        if ($(this).val() === country) {
                            $dropdownsCountry.val(country);
                            $dropdownsCountry.select2().trigger('change');
                        }
                    });
                }
            }

            $(function() {


                /* /shop/roaming-idd/roaming/rates*/
                $("#block-roaming-rates #category-change").once().change(function() {
                    var $selectedCategory = $('option:selected', this).val();
                    $('.roaming-data-hidden').removeClass('active');
                    $('.' + $selectedCategory).addClass('active');
                    $('.page-node-type-static-pages .rates-country').parent().addClass('hidden');
                    $('.page-node-type-static-pages .rates-country').removeClass('activeDropdown');
                    $('.page-node-type-static-pages .rates-country.' + $selectedCategory).parent().removeClass('hidden');
                    $('.page-node-type-static-pages .rates-country.' + $selectedCategory).addClass('activeDropdown');

                    $(".page-node-type-static-pages .rates-country.activeDropdown").val($(".page-node-type-static-pages .rates-country option:first").val());
                    $(".page-node-type-static-pages .rates-country.activeDropdown").select2("destroy").select2();

                    $(".page-node-type-static-pages .rates-country.activeDropdown").trigger("change", [true]);

                });

                $("#block-roaming-rates  .rates-country").once().change(function(e, triggerdatalayer) {

                    var $countryClass = $('option:selected', this).text();
                    var $countryClassImg = $('option:selected', this).text().toLowerCase();
                    $countryClassImg = $countryClassImg.split(' ').join('-');
                    var $countryClassStrim = $countryClass.replace(/[^A-Z0-9]/ig, "");
                    var $this = $('body').find(".active [data-class=" + $countryClassStrim + "]");
                    var imgSrc = "/themes/born/images/countries/" + $countryClassImg + ".png";
                    var categoryDataValue = $('option:selected', $(".page-node-type-static-pages #category-change")).val();
                    imgSrc = imgSrc.replace(" ", "-");

                    $('.page-node-type-static-pages .value-budget111_malesia').text($this.find('.budget111_malesia').text());
                    $('.page-node-type-static-pages .value-budget111_others').text($this.find('.budget111_others').text());
                    $('.value-directDial_malesia').text(($this.find('.directDial_malesia:first').text() === "") ? "NA" : $this.find('.directDial_malesia:first').text());
                    $('.value-directDial_others').text(($this.find('.directDial_others:first').text() === "") ? "NA" : $this.find('.directDial_others:first').text());
                    $('.value-category_text').text($('.roaming-data-hidden.active').find('h2').text());
                    $('.page-node-type-static-pages .value-receivingCall').text(($this.find('.receivingCall').text() === "") ? "NA" : $this.find('.receivingCall').text());
                    $('.value-callerId').text(($this.find('.callerID').text() === "") ? "N/A" : $this.find('.callerID').text());
                    $('.page-node-type-static-pages .value-sms').text(($this.find('.sms').text() === "") ? "N/A" : $this.find('.sms').text());
                    $('.page-node-type-static-pages .value-operator').text(($this.find('.directOperators').text() === "") ? "N/A" : $this.find('.directOperators').text());

                    /*internet3*/
                    $('.page-node-type-static-pages .value-internetlogo').text(($this.find('.internetlogo').text() === "") ? "N/A" : $this.find('.internetlogo').text());
                    $('.page-node-type-static-pages .value-internetheading').text(($this.find('.internetheading').text() === "") ? "N/A" : $this.find('.internetheading').text());
                    $('.page-node-type-static-pages .value-internetheadingsub').text(($this.find('.internetheadingsub').text() === "") ? "N/A" : $this.find('.internetheadingsub').text());
                    $('.page-node-type-static-pages .value-internetprice').text(($this.find('.internetprice').text() === "") ? "N/A" : $this.find('.internetprice').text());
                    $('.page-node-type-static-pages .value-internetstorage').text(($this.find('.internetstorage').text() === "") ? "N/A" : $this.find('.internetstorage').text());
                    $('.page-node-type-static-pages .value-internetunit').text(($this.find('.internetunit').text() === "") ? "N/A" : $this.find('.internetunit').text());
                    $('.page-node-type-static-pages .value-internetoperator').text(($this.find('.internetoperator').text() === "") ? "N/A" : $this.find('.internetoperator').text());
                    $('.page-node-type-static-pages .value-internetanyoperator').text(($this.find('.internetanyoperator').text() === "") ? "N/A" : $this.find('.internetanyoperator').text());
                    $('.page-node-type-static-pages .value-internetdigicel').text(($this.find('.internetdigicel').text() === "") ? "N/A" : $this.find('.internetdigicel').text());
                    $('.page-node-type-static-pages .value-internetlte').text(($this.find('.internetlte').text() === "") ? "N/A" : $this.find('.internetlte').text());


                    $('.page-node-type-static-pages .value-firstHeading').text(($this.find('.firstHeading').text() === "") ? "N/A" : $this.find('.firstHeading').text());
                    $('.page-node-type-static-pages .value-firstDesc').text(($this.find('.firstDesc').text() === "") ? "N/A" : $this.find('.firstDesc').text());
                    $('.page-node-type-static-pages .value-firstPrice').text(($this.find('.firstPrice').text() === "") ? "N/A" : $this.find('.firstPrice').text());
                    $('.page-node-type-static-pages .value-firstTime').text(($this.find('.firstTime').text() === "") ? "N/A" : $this.find('.firstTime').text());
                    $('.page-node-type-static-pages .value-secondHeading').text(($this.find('.secondHeading').text() === "") ? "N/A" : $this.find('.secondHeading').text());
                    $('.page-node-type-static-pages .value-secondDesc').text(($this.find('.secondDesc').text() === "") ? "N/A" : $this.find('.secondDesc').text());
                    $('.page-node-type-static-pages .value-secondPrice').text(($this.find('.secondPrice').text() === "") ? "N/A" : $this.find('.secondPrice').text());
                    $('.page-node-type-static-pages .value-secondTime').text(($this.find('.secondTime').text() === "") ? "N/A" : $this.find('.secondTime').text());
                    $('.page-node-type-static-pages .value-networkBlock').text(($this.find('.networkBlock').text() === "") ? "N/A" : $this.find('.networkBlock').text());

                    if ($this.find('.secondHeading').text() === "") {
                        $('.second-pass').hide()
                    } else {
                        $('.second-pass').show()
                    }
                    if ($this.find('.firstHeading').text() === "") {
                        $('.first-pass').hide()
                    } else {
                        $('.first-pass').show()
                    }
                    if ($this.find('.networkBlock').text() === "") {
                        $('.networkBlock-parent').hide()
                    } else {
                        $('.networkBlock-parent').show()
                    }


                    $('.page-node-type-static-pages .value-destination').text($countryClass);
                    $('.page-node-type-static-pages .country-destination').attr('src', imgSrc);
                    if (!triggerdatalayer && $(".page-node-type-static-pages .rates-country option:first").val() != $countryClass) {
                        dataLayer.push({
                            "event": "customEvent",
                            "category": "shop",
                            "action": "roaming rate", // example values can be "roaming rate, IDD, IDD prepaid, IDD postpaid"
                            "label": $("#block-roaming-rates #category-change option:selected").text().toLowerCase() + " + " + $countryClass.toLowerCase() // example values can be "digi postpaid + india"
                        });
                    }
                });

            });

            $(function() {
                /* /shop/roaming-idd/idd/rates */
                if ($(".rates-country-idd")) {
                    $(".rates-country-idd").change();
                }


                $(".page-node-type-static-pages #category-change").once().change(function(e) {
                    $(".page-node-type-static-pages .rates-country-idd").val($(".page-node-type-static-pages .rates-country-idd option:first").val());

                    $(".page-node-type-static-pages .rates-country-idd").select2("destroy").select2();
                    $(".page-node-type-static-pages .rates-country-idd").trigger("change", [true]);
                });

                $(".page-node-type-static-pages .rates-country-idd").once().change(function(e, triggerdatalayer) {
                    var $countryClass = $('option:selected', this).text();
                    if ($('option:selected', this).attr('data-sms') === "") {
                        var dataSms = " No Available";
                    } else {
                        var dataSms = $('option:selected', this).attr('data-sms');
                    }
                    var $countryClassImg = $('option:selected', this).text().toLowerCase();
                    $countryClassImg = $countryClassImg.split(' ').join('-');

                    var $countryClassStrim = $countryClass.replace(/[^A-Z0-9]/ig, "");
                    var $this = $('body').find(".active [data-class=" + $countryClassStrim + "]");
                    var imgSrc = "/themes/born/images/countries/" + $countryClassImg + ".png";
                    var categoryValue = $('option:selected', $(".page-node-type-static-pages #category-change")).val();
                    var categoryDataValue = $('option:selected', $(".page-node-type-static-pages #category-change")).attr('data-value');


                    imgSrc = imgSrc.replace(" ", "-");

                    $('.page-node-type-static-pages .value-destination').text($countryClass);
                    $('.page-node-type-static-pages .country-destination').attr('src', imgSrc);



                    if (categoryValue === "postpaid") {
                        $('.page-node-type-static-pages .value-FixedLine').text(($this.find('.postpaidFixedLine').text() === "" || $this.find('.postpaidFixedLine').text() === "0.00") ? "N/A" : $this.find('.postpaidFixedLine').text());
                        $('.page-node-type-static-pages .value-Mobile').text(($this.find('.postpaidMobile').text() === "" || $this.find('.postpaidMobile').text() === "0.00") ? "N/A" : $this.find('.postpaidMobile').text());
                        $('.page-node-type-static-pages .value-ChargeBlock').text(($this.find('.postpaidChargeBlock').text() === "" || $this.find('.postpaidChargeBlock').text() === "0.00") ? "N/A" : $this.find('.postpaidChargeBlock').text());
                        $('.page-node-type-static-pages .value-mms').text(($this.find('.postpaidMms').text() === "" || $this.find('.postpaidMms').text() === "0.00") ? "N/A" : $this.find('.postpaidMms').text());

                        /* postpaidIDD133Mobile, postpaidIDD133FixedLine*/

                        $('.page-node-type-static-pages .value-IDD133Mobile').text(($this.find('.postpaidIDD133Mobile').text() === "" || $this.find('.postpaidIDD133Mobile').text() === "0.00") ? "N/A" : $this.find('.postpaidIDD133Mobile').text());
                        $('.page-node-type-static-pages .value-133FixedLine').text(($this.find('.postpaidIDD133FixedLine').text() === "" || $this.find('.postpaidIDD133FixedLine').text() === "0.00") ? "N/A" : $this.find('.postpaidIDD133FixedLine').text());


                        $('.page-node-type-static-pages .value-dgCallHomeMobile').text(($this.find('.dgCallHomeMobile').text() === "" || $this.find('.dgCallHomeMobile').text() === "0.00") ? "N/A" : $this.find('.dgCallHomeMobile').text());
                        $('.page-node-type-static-pages .value-dgCallHomeFixedLine').text(($this.find('.dgCallHomeFixedLine').text() === "" || $this.find('.dgCallHomeFixedLine').text() === "0.00") ? "N/A" : $this.find('.dgCallHomeFixedLine').text());

                    } else {
                        /* prepaidBestIDD133Mobile, prepaidBestIDD133FixedLine */

                        $('.page-node-type-static-pages .value-IDD133Mobile').text(($this.find('.prepaidBestIDD133Mobile').text() === "" || $this.find('.prepaidBestIDD133Mobile').text() === "0.00") ? "N/A" : $this.find('.prepaidBestIDD133Mobile').text());
                        $('.page-node-type-static-pages .value-133FixedLine').text(($this.find('.prepaidBestIDD133FixedLine').text() === "" || $this.find('.prepaidBestIDD133FixedLine').text() === "0.00") ? "N/A" : $this.find('.prepaidBestIDD133FixedLine').text());
                    }




                    if (categoryValue === "livePrepaid2016") {
                        $('.page-node-type-static-pages .value-FixedLine').text(($this.find('.livePrepaid2016FixedLine').text() === "0.00" || $this.find('.livePrepaid2016FixedLine').text() === "") ? $this.find('.prepaidFixedLine').text() : $this.find('.livePrepaid2016FixedLine').text());
                        $('.page-node-type-static-pages .value-Mobile').text(($this.find('.livePrepaid2016Mobile').text() === "0.00" || $this.find('.livePrepaid2016Mobile').text() === "") ? $this.find('.prepaidMobile').text() : $this.find('.livePrepaid2016Mobile').text());
                        $('.page-node-type-static-pages .value-ChargeBlock').text(($this.find('.livePrepaid2016ChargeBlock').text() === "0.00" || $this.find('.livePrepaid2016ChargeBlock').text() === "") ? $this.find('.prepaidChargeBlock').text() : $this.find('.livePrepaid2016ChargeBlock').text());
                        $('.page-node-type-static-pages .value-mms').text(($this.find('.livePrepaid2016mms').text() === "0.00" || $this.find('.livePrepaid2016mms').text() === "") ? $this.find('.prepaidMms').text() : $this.find('.livePrepaid2016mms').text());
                    }

                    if (categoryValue === "bestPrepaid2016") {
                        $('.page-node-type-static-pages .value-FixedLine').text(($this.find('.bestPrepaid2016FixedLine').text() === "0.00" || $this.find('.bestPrepaid2016FixedLine').text() === "") ? $this.find('.prepaidFixedLine').text() : $this.find('.bestPrepaid2016FixedLine').text());
                        $('.page-node-type-static-pages .value-Mobile').text(($this.find('.bestPrepaid2016Mobile').text() === "0.00" || $this.find('.bestPrepaid2016Mobile').text() === "") ? $this.find('.prepaidMobile').text() : $this.find('.bestPrepaid2016Mobile').text());
                        $('.page-node-type-static-pages .value-ChargeBlock').text(($this.find('.bestPrepaid2016ChargeBlock').text() === "0.00" || $this.find('.bestPrepaid2016ChargeBlock').text() === "") ? $this.find('.prepaidChargeBlock').text() : $this.find('.bestPrepaid2016ChargeBlock').text());
                        $('.page-node-type-static-pages .value-mms').text(($this.find('.bestPrepaid2016mms').text() === "0.00" || $this.find('.bestPrepaid2016mms').text() === "") ? $this.find('.prepaidMms').text() : $this.find('.bestPrepaid2016mms').text());
                    }


                    if (categoryValue === "bestPrepaid2017") {
                        $('.page-node-type-static-pages .value-FixedLine').text(($this.find('.bestPrepaid2017FixedLine').text() === "0.00" || $this.find('.bestPrepaid2017FixedLine').text() === "") ? $this.find('.prepaidFixedLine').text() : $this.find('.bestPrepaid2017FixedLine').text());
                        $('.page-node-type-static-pages .value-Mobile').text(($this.find('.bestPrepaid2017Mobile').text() === "0.00" || $this.find('.bestPrepaid2017Mobile').text() === "") ? $this.find('.prepaidMobile').text() : $this.find('.bestPrepaid2017Mobile').text());
                        $('.page-node-type-static-pages .value-ChargeBlock').text(($this.find('.bestPrepaid2017ChargeBlock').text() === "0.00" || $this.find('.bestPrepaid2017ChargeBlock').text() === "") ? $this.find('.prepaidChargeBlock').text() : $this.find('.bestPrepaid2017ChargeBlock').text());
                        $('.page-node-type-static-pages .value-mms').text(($this.find('.bestPrepaid2017mms').text() === "0.00" || $this.find('.bestPrepaid2017mms').text() === "") ? $this.find('.prepaidMms').text() : $this.find('.bestPrepaid2017mms').text());
                    }

                    if ($('.page-node-type-static-pages .value-IDD133Mobile').text() === "N/A" || $('.page-node-type-static-pages .value-IDD133Mobile').text() === "") {
                        $('.value-IDD133Mobile_display').hide();
                    } else {
                        $('.value-IDD133Mobile_display').show();
                    }
                    if ($('.page-node-type-static-pages .value-dgCallHomeMobile').text() === "N/A" || $('.page-node-type-static-pages .value-dgCallHomeMobile').text() === "") {
                        $('.value-dgCallHomeMobile_display').hide();
                    } else {
                        $('.value-dgCallHomeMobile_display').show();
                    }



                    /*value-idd133_fixedLine, value-idd133_mobile,  value-dg_fixedLine, value-dg_mobile*/

                    /*value-FixedLine_video, value-Mobile_video,value-ChargeBlock_video,value-video_operators_video*/

                    if (categoryValue === "prepaid") {
                        $('.page-node-type-static-pages .value-FixedLine').text(($this.find('.prepaidFixedLine').text() === "" || $this.find('.prepaidFixedLine').text() === "0.00") ? "N/A" : $this.find('.prepaidFixedLine').text());
                        $('.page-node-type-static-pages .value-Mobile').text(($this.find('.prepaidMobile').text() === "" || $this.find('.prepaidMobile').text() === "0.00") ? "N/A" : $this.find('.prepaidMobile').text());
                        $('.page-node-type-static-pages .value-ChargeBlock').text(($this.find('.prepaidChargeBlock').text() === "" || $this.find('.prepaidChargeBlock').text() === "0.00") ? "N/A" : $this.find('.prepaidChargeBlock').text());
                        $('.page-node-type-static-pages .value-mms').text(($this.find('.prepaidMms').text() === "" || $this.find('.prepaidMms').text() === "0.00") ? "N/A" : $this.find('.prepaidMms').text());

                    }


                    $('.page-node-type-static-pages .value-video_mobile').text(($this.find('.videoMobile').text() === "" || $this.find('.videoMobile').text() === "0.00") ? "N/A" : $this.find('.videoMobile').text());
                    $('.page-node-type-static-pages .value-video_chargeBlock').text(($this.find('.videoChargeBlock').text() === "" || $this.find('.videoChargeBlock').text() === "0.00") ? "N/A" : $this.find('.videoChargeBlock').text());
                    $('.page-node-type-static-pages .value-video_operators').text(($this.find('.videoOperators').text() === "" || $this.find('.videoOperators').text() === "0.00") ? "N/A" : $this.find('.videoOperators').text());



                    $('.page-node-type-static-pages .value-sms').text(dataSms);
                    $('.page-node-type-static-pages .value-sms').text(($this.find('.sms').text() === "" || $this.find('.sms').text() === "0.00") ? "N/A" : $this.find('.sms').text());

                    $('.page-node-type-static-pages .value-countryCode').text(($this.find('.countryCode').text() === "" || $this.find('.countryCode').text() === "0.00") ? "N/A" : $this.find('.countryCode').text());
                    $('.page-node-type-static-pages .value-sms_operators').text(($this.find('.sms_operators').text() === "" || $this.find('.sms_operators').text() === "0.00") ? "N/A" : $this.find('.sms_operators').text());

                    $('.page-node-type-static-pages .value-country-name').text($countryClass);
                    $('.page-node-type-static-pages .not-available').text(" N/A");

                    if (!triggerdatalayer) {
                        if ($(".rates-country-idd option:first").val() != $countryClass) {
                            dataLayer.push({
                                "event": "customEvent",
                                "category": "shop",
                                "action": "IDD", // example values can be "roaming rate, IDD, IDD prepaid, IDD postpaid"
                                "label": $(".block-roaming-rates-idd-block #category-change option:selected").text().toLowerCase() + " + " + $countryClass.toLowerCase() // example values can be "digi postpaid + india"
                            });
                        }
                    }

                });
            });
            /*idd 133 postpaid and prepaid
             * */
            $(".page-node-type-static-pages #idd133-country-change").once().change(function(e, triggerdatalayer) {
                var $countryClass = $('option:selected', this).text();
                $countryClass = $countryClass.replace(/\s/g, "");
                var $this = $('body').find(".country-content-hidden [data-class=" + $countryClass + "]");

                var $countryClassImg = $('option:selected', this).text().toLowerCase();
                var imgSrc = "/themes/born/images/countries/" + $countryClassImg + ".png";

                imgSrc = imgSrc.split(' ').join('-');

                $('.page-node-type-static-pages .value-country-flag img').attr('src', imgSrc);



                $('.page-node-type-static-pages .value-country-name').text($this.find('.country-name').text());
                $('.page-node-type-static-pages .value-country-code').text($this.find('.country-code').text());
                $('.page-node-type-static-pages .value-fixed-line').text($this.find('.fixed-line').text());
                $('.page-node-type-static-pages .value-mobile-rate').text($this.find('.mobile').text());
                var actiontag = "IDD prepaid";
                if (window.location.pathname.indexOf("idd-133-digi-postpaid") >= 0) {
                    actiontag = "IDD postpaid";
                }
                if (!triggerdatalayer) {
                    dataLayer.push({
                        "event": "customEvent",
                        "category": "shop",
                        "action": actiontag, // example values can be "roaming rate, IDD, IDD prepaid, IDD postpaid"
                        "label": $('option:selected', this).text().toLowerCase() // example values can be "digi postpaid + india"
                    });
                }
            });
            $(".page-node-type-static-pages #idd133-country-change").trigger("change", [true]);

            $(function() {


                $(".content-pages .chatz-country-change").once().change(function() {

                    if ($('option:selected', this).attr('data-country-code') == "N/A") {
                        var dataCountryCode = "N/A";
                    } else {
                        var dataCountryCode = $('option:selected', this).attr('data-country-code');
                    }
                    if ($('option:selected', this).attr('data-fixed-line') == "N/A") {
                        var dataFixedLine = "N/A";
                    } else {
                        var dataFixedLine = $('option:selected', this).attr('data-fixed-line') + " Min";
                    }
                    if ($('option:selected', this).attr('data-mobile') == "N/A") {
                        var dataMobile = "N/A"
                    } else {
                        var dataMobile = $('option:selected', this).attr('data-mobile') + " Min";
                    }

                    $('.Page-chatz-landing .value-country-code').text(dataCountryCode);
                    $('.Page-chatz-landing .value-fixed-line').text(dataFixedLine);
                    $('.Page-chatz-landing .value-mobile').text(dataMobile);
                });
                $(".content-pages .chatz-country-change").once().change();
            });

            $(".field--name-field-timing-title").once().on("click", function() {
                if ($(window).width() < 769) {
                    $(this).toggleClass("active");
                    $(this).next().toggleClass("show-hide");
                }
            });


            /*
             * to make any element sticky at top
             * */
            if ($('.category-tabs-wrapper-js').length > 0) {
                if (window.innerWidth <= 768 && $('.category-tabs-wrapper-js').attr('data-offsetMobile') != null) {
                    var offsetForAll = $('.category-tabs-wrapper-js').attr('data-offsetMobile');
                    $('.category-tabs-wrapper-js').affix({
                        offset: {
                            top: offsetForAll
                        }
                    });
                } else if ($('.category-tabs-wrapper-js').attr('data-offsetDesktop') != null) {
                    var offsetForAll = $('.category-tabs-wrapper-js').attr('data-offsetDesktop');
                    $('.category-tabs-wrapper-js').affix({
                        offset: {
                            top: offsetForAll
                        }
                    });
                }
            }

            window.addEventListener("hashchange", ChangePos);

            function ChangePos() {
                scrollTop = $(window).scrollTop();
                headerH = $(".navbar-fixed-wrapper").height();
                setTimeout(function() {
                    $(window).scrollTop(scrollTop - headerH);
                }, 50);
            }
            $(".quick-links-para-wrapper .quick-links-link").click(function() {
                window.location.hash = "";
            });
            /*phone freedom 365 js*/
            /*
             * on load check if #url is present
             * if present get that url activate the category-tab-item and show tab with same id */
            let url = location.href.replace(/\/$/, "");
            if (location.hash && $('.tab-scroll-js').length) {

                const urlsplit = url.split("#");
                const hash = urlsplit[1];

                $('.tab-scroll-js .discover-tab').hide().removeClass('active');
                $(".tab-scroll-js  #" + hash).addClass('active').show();
                $('.tab-scroll-js .category-tab-item').removeClass('active-category-tab');
                $('.tab-scroll-js a[data-id=' + hash + ']').addClass('active-category-tab');


                url = location.href.replace(/\/#/, "#");
                history.replaceState(null, null, url);
                setTimeout(function() {
                    $(window).scrollTop(0);
                }, 40);
                if (window.screen.width < 768) {
                    $('html, body').animate({
                        scrollTop: $(".tab-scroll-js .tabscrollto-mobile").offset().top
                    }, 500);
                } else {
                    $('html, body').animate({
                        scrollTop: $(".tab-scroll-js .tabscrollto-desktop").offset().top - 141
                    }, 500);
                }
            }


            $('.tab-scroll-js a[data-toggle="tab"]').on("click", function(event) {
                event.preventDefault();
                let newUrl;
                const hash = $(this).attr("href");
                newUrl = url.split("#")[0] + hash;

                $('.tab-scroll-js .tab-pane').hide().removeClass('active');
                $('.tab-scroll-js .category-tab-item ').removeClass('active-category-tab');
                $(this).addClass('active-category-tab');
                $(hash).addClass('active').show();

                newUrl += "";
                history.replaceState(null, null, newUrl);

                if (window.screen.width < 768) {
                    $('html, body').animate({
                        scrollTop: $(".tab-scroll-js .tabscrollto-mobile").offset().top
                    }, 500);
                } else {
                    $('html, body').animate({
                        scrollTop: $(".tab-scroll-js .tabscrollto-desktop").offset().top - 110
                    }, 50);
                }
            });


        }
    };
})(jQuery, Drupal, drupalSettings);;
/**
 * @file
 * Custom JQuery file for youtube video customisation.
 *
 * @category JQuery
 * @package born
 * @link http://digi.com.my/
 */
var YTdeferred = jQuery.Deferred();

window.onYouTubeIframeAPIReady = function() {
    YTdeferred.resolve(window.YT);
};

(function($) {

    $.ajaxSetup({
        cache: true
    });

    $.getScript("https://www.youtube.com/iframe_api")
        .done(function(script, textStatus) {});

    $.fn.simplePlayer = function() {

        var video = $(this);

        var play = $('<div />', {
            id: 'play'
        }).hide();

        var defaults = {
            autoplay: 1,
            autohide: 1,
            border: 0,
            wmode: 'opaque',
            enablejsapi: 1,
            modestbranding: 1,
            version: 3,
            hl: 'en_US',
            rel: 0,
            showinfo: 0,
            hd: 1,
            iv_load_policy: 3 // add origin
        };

        // onYouTubeIframeAPIReady

        YTdeferred.done(function(YT) {
            play.appendTo(video).fadeIn('slow');
        });

        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.ENDED) {
                play.fadeIn(500);
            }
        }

        function onPlayerReady(event) {
            var replay = document.getElementById('play');
            replay.addEventListener('click', function() {
                player.playVideo();
            });
        }

        play.bind('click', function() {

            if (!$('#player').length) {

                $('<iframe />', {
                        id: 'player',
                        src: 'https://www.youtube.com/embed/' + video.data('video') + '?' + $.param(defaults)
                    })
                    .attr({
                        width: video.width(),
                        height: video.height(),
                        seamless: 'seamless'
                    })
                    .css('border', 'none')
                    .appendTo(video);

                video.children('img').hide();
                video.children('h3').hide();

                $(this).css({
                    'background-image': 'url(/themes/born/images/icons/play.svg), url(' + video.children().attr('src') + ')',
                    'background-size': '70px 70px,97% auto'
                }).hide();
                if (window.innerWidth < 992) {
                    $(this).css({
                        'background-size': '60px 60px,91% auto'
                    });
                }
                player = new YT.Player('player', {
                    events: {
                        'onStateChange': onPlayerStateChange,
                        'onReady': onPlayerReady
                    }
                });
            }

            $(this).hide();
        });

        return this;
    };
}(jQuery));;
"function" === typeof importScripts && importScripts("https://api.useinsider.com/sw.js");;
(function($, Drupal, drupalSettings) {
    "use-strict";
    Drupal.behaviors.phonefreedom365Behaviour = {
        attach: function(context, settings) {}
    };
})(jQuery, Drupal, drupalSettings);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

Drupal.debounce = function(func, wait, immediate) {
    var timeout = void 0;
    var result = void 0;
    return function() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var context = this;
        var later = function later() {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
        }
        return result;
    };
};;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function($, Drupal, debounce) {
    var offsets = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    function getRawOffset(el, edge) {
        var $el = $(el);
        var documentElement = document.documentElement;
        var displacement = 0;
        var horizontal = edge === 'left' || edge === 'right';

        var placement = $el.offset()[horizontal ? 'left' : 'top'];

        placement -= window['scroll' + (horizontal ? 'X' : 'Y')] || document.documentElement['scroll' + (horizontal ? 'Left' : 'Top')] || 0;

        switch (edge) {
            case 'top':
                displacement = placement + $el.outerHeight();
                break;

            case 'left':
                displacement = placement + $el.outerWidth();
                break;

            case 'bottom':
                displacement = documentElement.clientHeight - placement;
                break;

            case 'right':
                displacement = documentElement.clientWidth - placement;
                break;

            default:
                displacement = 0;
        }
        return displacement;
    }

    function calculateOffset(edge) {
        var edgeOffset = 0;
        var displacingElements = document.querySelectorAll('[data-offset-' + edge + ']');
        var n = displacingElements.length;
        for (var i = 0; i < n; i++) {
            var el = displacingElements[i];

            if (el.style.display === 'none') {
                continue;
            }

            var displacement = parseInt(el.getAttribute('data-offset-' + edge), 10);

            if (isNaN(displacement)) {
                displacement = getRawOffset(el, edge);
            }

            edgeOffset = Math.max(edgeOffset, displacement);
        }

        return edgeOffset;
    }

    function calculateOffsets() {
        return {
            top: calculateOffset('top'),
            right: calculateOffset('right'),
            bottom: calculateOffset('bottom'),
            left: calculateOffset('left')
        };
    }

    function displace(broadcast) {
        offsets = calculateOffsets();
        Drupal.displace.offsets = offsets;
        if (typeof broadcast === 'undefined' || broadcast) {
            $(document).trigger('drupalViewportOffsetChange', offsets);
        }
        return offsets;
    }

    Drupal.behaviors.drupalDisplace = {
        attach: function attach() {
            if (this.displaceProcessed) {
                return;
            }
            this.displaceProcessed = true;

            $(window).on('resize.drupalDisplace', debounce(displace, 200));
        }
    };

    Drupal.displace = displace;
    $.extend(Drupal.displace, {
        offsets: offsets,

        calculateOffset: calculateOffset
    });
})(jQuery, Drupal, Drupal.debounce);;
/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.VERSION = '3.3.7'

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }

    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && scrollTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
    }

    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(':visible')) return

        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')

            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')

            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.affix

    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function() {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null) data.offset.top = data.offsetTop

            Plugin.call($spy, data)
        })
    })

}(jQuery);;