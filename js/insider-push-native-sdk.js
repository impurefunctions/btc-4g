(function() {
    'use strict';

    var config = {
        storageName: "insdrSubsId",
        debug: false,
        swPath: spApi.nativeOptInSDKCustomPath ? spApi.nativeOptInSDKCustomPath : '/insider-sw-sdk.js',
        storageAuth: "insdrAuth",
        storageDH: "insdrDH",
        storagePayloadComplete: "insdrPayloadComplete",
        storageSubscriptionCreateDate: 'insdrSubsIdCreateDate',
        registeredWorkerPath: 'migratedSDK',
        pmTarget: false,
        cookies: {},
        Database: false,
        DBName: "INSIDER_WEB_PUSH_DB"
    };

    var pushAPI = pushAPI || {};

    /**
     * Initialize pushAPI
     * @constructor
     */
    pushAPI.initialize = function() {
        pm({
            target: sQuery('#spWorker')[0].contentWindow,
            type: 'initializePushStateCookies',
            success: function(data) {
                config.cookies = data;
                pushAPI.debugUtil.init();
                pushAPI.httpUtil.storeQueryStrings();
                pushAPI.configUtil.init();

                pushAPI.storageUtil.initializeIndexedDB(function() {
                    pushAPI.storageUtil.IDBObjectStore('settings', {
                        id: 1,
                        name: 'partnerName',
                        value: partnerName
                    });

                    pushAPI.storageUtil.IDBObjectStore('settings', {
                        id: 2,
                        name: 'spUID',
                        value: pushAPI.storageUtil.getUserId()
                    });
                });

                config.pmTarget = sQuery("#spWorker")[0].contentWindow;

                if (config.debug) console.log('initializing pushAPI..');

                if (config.debug) console.log(pushAPI.httpUtil.get);

                if (config.debug) console.log(pushAPI.configUtil.hasPush);

                if (pushAPI.configUtil.hasPush) {
                    pushAPI.storageUtil.saveImpressionLog();
                    pushAPI.serviceWorkerUtil.init();
                }
            }
        });
    };

    pushAPI.isBrowserSupportServiceWorker = 'serviceWorker' in navigator;

    /**
     * Service Worker Utils
     */
    pushAPI.serviceWorkerUtil = function() {
        /**
         * @constructor
         */
        return {
            /**
             * Request notification permission
             */
            grantPermission: function() {
                pushAPI.windowUtil.appendOverlay();
                Notification.requestPermission().then(pushAPI.serviceWorkerUtil.handlePermission);
            },

            /**
             * Handle notification request permission
             */
            handlePermission: function(permission) {
                // permission is resolved, we must remove overlay
                pushAPI.windowUtil.removeOverlay();

                // if permission is not granted, there is no need to register sw.
                if (permission !== 'granted') {
                    return;
                }

                pushAPI.serviceWorkerUtil.register();
            },

            /**
             * Register service worker
             */
            register: function() {
                navigator.serviceWorker.register(config.swPath)
                    .then(pushAPI.serviceWorkerUtil.handleWorkerState)
                    .catch(pushAPI.exceptionUtil.handleException);

                // Unregister the custom opt-in service worker if partner is using native opt-in
                spApi.worker.asyncPM('unregisterCustomOptInServiceWorker');
            },

            /**
             * Subscribe user on given worker
             * @param worker
             */
            subscribe: function(worker) {
                worker.pushManager.subscribe({
                        userVisibleOnly: true
                    })
                    .then(pushAPI.serviceWorkerUtil.saveSubscription)
                    .catch(function(error) {
                        spApi.logger('warning', error);

                        // When switching GCM => FCM project, SW can't generate token with new FCM key
                        if (error.message.indexOf('applicationServerKey') > -1 && pushAPI.isBrowserSupportServiceWorker) {
                            navigator.serviceWorker.getRegistration().then(function(registration) {
                                if (typeof registration !== 'undefined') {
                                    registration.unregister().then(function() {
                                        pushAPI.serviceWorkerUtil.register();
                                    });
                                }
                            });
                        }
                    });
            },
            /**
             * Subscribe user instantly
             * @param {object} worker
             */
            instantSubscribe: function(worker) {
                var serviceWorker;

                if (worker.installing) {
                    serviceWorker = worker.installing;
                } else if (worker.waiting) {
                    serviceWorker = worker.waiting;
                } else if (worker.active) {
                    serviceWorker = worker.active;
                }

                if (serviceWorker && serviceWorker.state === 'activated') {
                    pushAPI.serviceWorkerUtil.subscribe(worker);
                }
            },

            /**
             * Handle worker state
             */
            handleWorkerState: function(worker) {
                worker.addEventListener('updatefound', function() {
                    // capture state change event of service worker
                    var installingWorker = this.installing;
                    installingWorker.addEventListener('statechange', function() {
                        // if service worker registered & activated
                        if (installingWorker.state === 'activated') {
                            // subscribe user
                            pushAPI.serviceWorkerUtil.subscribe(worker);
                        }
                    });
                });
                // if update-found event does not fire, subscribe user anyway.
                pushAPI.serviceWorkerUtil.instantSubscribe(worker);
            },

            /**
             * Save Subscription
             */
            saveSubscription: function(subscription) {

                /**
                 * @type {string}
                 */
                var subscriptionId;

                /**
                 * in Chrome 44+ and other SW browsers, reg ID is part of endpoint
                 */
                if ('subscriptionId' in subscription) {
                    subscriptionId = subscription.subscriptionId;
                } else {
                    subscriptionId = pushAPI.serviceWorkerUtil.getSubscriptionId(subscription.endpoint);
                }

                var keys = JSON.parse(JSON.stringify(subscription)).keys || {};
                var auth = keys.auth || '';
                var p256dh = keys.p256dh || '';

                pushAPI.storageUtil.sendUserPermissionGranted({
                    insdrSubsId: subscriptionId,
                    pushRequestSent: true
                });

                if (pushAPI.serviceWorkerUtil.migrationNeeded() || spApi.webPushPermission.hasOptedInBefore) {
                    // migrate subscription.
                    pushAPI.storageUtil.saveSubscriptionId(subscriptionId, auth, p256dh, '1');
                } else {
                    // register new one
                    pushAPI.storageUtil.saveSubscriptionId(subscriptionId, auth, p256dh, '0');
                }
            },

            /**
             * Check if user needs to be migrated.
             */
            migrationNeeded: function() {
                var payloadIsSetToStorage = pushAPI.storageUtil.checkFromStorage(config.storagePayloadComplete, 'true');

                // token collected by sdk but partner has changed sdk path
                var sdkPathUpdated = spApi.nativeOptInSDKCustomPath && !sQuery.cookie('migratedSDK') && payloadIsSetToStorage;

                // payload not set to storage but token generated
                var payloadIsCorrupted = !payloadIsSetToStorage && pushAPI.storageUtil.getFromStorage(config.storageName);

                return sdkPathUpdated || payloadIsCorrupted;
            },

            /**
             * Get subscriptionId from endpoint
             * @param {string} endpoint
             * @returns {string}
             */
            getSubscriptionId: function(endpoint) {
                return endpoint.split('/').pop();
            },

            /**
             * Stores register request
             */
            storeRegisterRequest: function() {
                if (!pushAPI.storageUtil.checkFromStorage('push-request-sent', 'true')) {
                    var logData = {
                        t: 'storeLog',
                        type: 'webPush',
                        logType: 'push-request',
                        browser: spApi.getBrowser(),
                        isMobile: spApi.isMobileBrowser(),
                        userID: pushAPI.storageUtil.getUserId()
                    };

                    spApi.storeLog('webPushLogs', logData);
                }
            },

            /**
             * init all jobs
             */
            init: function() {
                this.storeRegisterRequest();
                this.grantPermission();
            }
        }
    }();

    /**
     * Config Utils for Configurable Objects
     */
    pushAPI.configUtil = function() {
        return {
            hasPush: false,
            hasNotification: false,
            supportsPush: false,
            init: function() {
                this.hasPush = ('PushManager' in window || 'push' in navigator);
                this.hasNotification = ('Notification' in window);
                this.supportsPush = (this.hasPush && this.hasNotification && pushAPI.isBrowserSupportServiceWorker);
            }
        }
    }();

    /**
     * Storage Utils for store data on DB,Cookie or localStorage
     */
    pushAPI.storageUtil = function() {

        /**
         * Set true if localStorage is enabled.
         * @type {boolean}
         */
        var localStorageEnabled = false;

        return {
            /**
             * Send storage data to same window via post message
             * @param storageData {object}
             */
            sendUserPermissionGranted: function(storageData) {
                pm({
                    target: window.top,
                    type: 'setUserPermissionGranted',
                    data: storageData
                });
            },

            /***
             * set cookie
             * @param name {string}
             * @param value {string}
             * @param expireDays {number}
             */
            setCookie: function(name, value, expireDays) {
                pm({
                    target: config.pmTarget,
                    type: 'setCookie',
                    data: {
                        name: name,
                        value: value,
                        options: {
                            path: '/',
                            expires: expireDays,
                            domain: partnerName + '.api.useinsider.com'
                        }
                    }
                });
            },

            /**
             * Returns spUID
             * @return {*}
             */
            getUserId: function() {
                return spApi.storageData('spUID');
            },

            /***
             * get cookie value
             * @param name {string}
             * @returns {*}
             */
            getCookie: function(name) {
                return config.cookies[name];
            },

            /**
             * Add data to storage
             * @param name {string}
             * @param value {string}
             * @param expireDays {number}
             */
            addToStorage: function(name, value, expireDays) {
                if (this.checkFromStorage(name, value)) {
                    this.deleteFromStorage(name);
                }

                if (localStorageEnabled) {
                    localStorage.setItem(name, value);
                } else {
                    this.setCookie(name, value, expireDays);
                }
            },

            /**
             * Get data from storage
             * @param name {string}
             */
            getFromStorage: function(name) {
                if (localStorageEnabled) {
                    localStorage.getItem(name)
                } else {
                    this.getCookie(name);
                }
            },

            /**
             * Delete data from storage
             * @param name {string}
             */
            deleteFromStorage: function(name) {
                if (localStorageEnabled) {
                    localStorage.removeItem(name);
                } else {
                    this.getCookie(name) && this.setCookie(name, '', -1);
                }
            },

            /**
             * Checks value from storage
             * @param name {string}
             * @param value {string|number}
             * @returns {boolean}
             */
            checkFromStorage: function(name, value) {
                return (localStorageEnabled ? localStorage.getItem(name) : this.getCookie(name)) == value;
            },

            /**
             * Add Impression Log
             */
            saveImpressionLog: function() {
                if (!pushAPI.storageUtil.checkFromStorage('native-permission-impression', 'true')) {
                    pushAPI.storageUtil.addToStorage('native-permission-impression', 'true', 360);
                    var logData = {
                        t: 'storeLog',
                        type: 'webPush',
                        logType: 'native-permission-impression',
                        browser: spApi.getBrowser(),
                        isMobile: spApi.isMobileBrowser(),
                        userID: pushAPI.storageUtil.getUserId()
                    };

                    spApi.storeLog('webPushLogs', logData);
                }
            },

            /**
             * Store subscriptionId
             * @param subscriptionId
             * @param auth
             * @param p256dh
             * @param update
             */
            saveSubscriptionId: function(subscriptionId, auth, p256dh, update) {
                pushAPI.httpUtil.ajax(
                    'https://' + partnerName + '.api.useinsider.com/ajax.php',
                    'POST', {
                        t: 'pushDeviceToken',
                        pushSubscriptionId: subscriptionId,
                        pushAuthToken: auth,
                        pushP256DH: p256dh,
                        lang: spApi.getLang(),
                        browser: spApi.getBrowser(),
                        isMobile: spApi.isMobileBrowser(),
                        pushUpdate: update,
                        spUID: pushAPI.storageUtil.getUserId(),
                        exSubscriptionId: spApi.getParameter('insiderSubsId'),
                        isNativeOptIn: 1
                    },
                    function() {
                        var expireDay = Number(nativeOptInCookieSettings.permissionAllowExpireDay);
                        pushAPI.storageUtil.addToStorage('push-request-sent', 'true', expireDay);
                        pushAPI.storageUtil.addToStorage(config.storagePayloadComplete, 'true', expireDay);
                        pushAPI.storageUtil.addToStorage(config.storageAuth, auth, expireDay);
                        pushAPI.storageUtil.addToStorage(config.storageDH, p256dh, expireDay);
                        pushAPI.storageUtil.addToStorage(config.storageName, subscriptionId, expireDay);
                        pushAPI.storageUtil.addToStorage(config.registeredWorkerPath, config.swPath, expireDay);
                        pushAPI.storageUtil.addToStorage(
                            config.storageSubscriptionCreateDate,
                            new Date().getTime(),
                            expireDay
                        );
                    }
                )
            },
            initializeIndexedDB: function(callback) {

                var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                var DBOpenRequest = indexedDB.open(config.DBName, 1);

                DBOpenRequest.onupgradeneeded = function(event) {
                    config.Database = event.target.result;
                    config.Transaction = event.target.transaction;

                    var store = config.Database.createObjectStore('settings', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('name', 'name', {
                        unique: true
                    });
                    store.createIndex('value', 'value', {
                        unique: true
                    });

                    callback();
                }

            },
            IDBObjectStore: function(table, data) {
                var WPObjectStore = config.Transaction.objectStore(table);
                WPObjectStore.add(data);
            }
        }
    }();

    /**
     * Debug Utils for debugging on production
     */
    pushAPI.debugUtil = function() {
        return {
            init: function() {
                /**
                 * Debug Control
                 * @type {*|boolean}
                 */
                config.debug = pushAPI.storageUtil.checkFromStorage('insider-push-debug', 'true');
            }
        }
    }();

    /**
     * Exception Utils for handling exception errors
     */
    pushAPI.exceptionUtil = function() {
        return {
            handleException: function(error) {

                var expireDay = Number(nativeOptInCookieSettings.permissionAbandonExpireDay);

                if (Notification.permission === 'denied') {
                    expireDay = Number(nativeOptInCookieSettings.permissionBlockExpireDay);
                }

                pushAPI.storageUtil.sendUserPermissionGranted({
                    pushRequestSent: true
                });

                pushAPI.storageUtil.addToStorage('push-request-sent', 'true', expireDay);

                if (config.debug) console.log(error);

                pushAPI.windowUtil.removeOverlay();
            }
        }
    }();

    /**
     * Window Utils for redirect,close and other actions.
     */
    pushAPI.windowUtil = function() {
        return {
            /**
             * Appends overlay to window by given overlay settings when service worker registered and activated
             */
            appendOverlay: function() {
                if (window.insiderOptInOverlayIsActive === true) {
                    // add overlay wrapper
                    var overlayWrapper = sQuery('<div/>', {
                        id: 'insider-opt-in-native-dialog'
                    });
                    // add overlay
                    sQuery('<div/>', {
                        'class': 'insider-opt-in-overlay'
                    }).appendTo(overlayWrapper);
                    // add overlay message
                    sQuery('<div/>', {
                        'class': 'insider-opt-in-overlay-message'
                    }).text(window.insiderOptInOverlayMessage).appendTo(overlayWrapper);
                    // append overlay elements to body
                    overlayWrapper.appendTo('body');
                    // set overlay close on click event
                    if (window.insiderOverlayCloseOnClick) {
                        sQuery(document).on('click', '.insider-opt-in-overlay', this.removeOverlay);
                    }
                }
            },

            /**
             * Removes overlay
             */
            removeOverlay: function() {
                sQuery('#insider-opt-in-native-dialog').remove();
            },

            /**
             * Redirect URL
             * @param {string} url
             */
            redirect: function(url) {

                if (config.debug) console.log('Redirect new location : ', url);

                window.location.href = url;
            },

            /**
             * Close window with timeout
             * @param {number} closeTimeOut
             */
            close: function(closeTimeOut) {

                if (config.debug) console.log('Closing window');

                setTimeout(function() {
                    window.close();
                }, closeTimeOut);
            }
        }
    }();


    /**
     * Http Utils for data send,get and ajax jobs.
     */
    pushAPI.httpUtil = function() {

        return {
            /**
             * Stores query strings as like object
             */
            get: {},

            /**
             * Get All Query String Parameters
             * @returns {pushAPI.httpUtil.get|{}}
             */
            storeQueryStrings: function() {

                if (config.debug) console.log('Store Query Strings');

                var query = window.location.search.substring(1);

                var vars = query.split("&");

                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    /**
                     * If first entry with this name
                     */
                    if (typeof this.get[pair[0]] === "undefined") {
                        this.get[pair[0]] = decodeURIComponent(pair[1]);
                        /**
                         * If second entry with this name
                         */
                    } else if (typeof this.get[pair[0]] === "string") {
                        this.get[pair[0]] = [this.get[pair[0]], decodeURIComponent(pair[1])];
                        /**
                         * If third or later entry with this name
                         */
                    } else {
                        this.get[pair[0]].push(decodeURIComponent(pair[1]));
                    }
                }
                return this.get;
            },

            /**
             * Get subdomain info from host
             * @returns {*}
             */
            getSub: function() {
                return window.location.host.split('.')[0];
            },

            /**
             *
             * @param {string} url
             * @param {object} params
             * @param {function} callback
             * @param {string} method
             */
            ajax: function(url, method, params, callback) {

                sQuery.ajax({
                    url: url,
                    type: method,
                    data: params,
                    async: false,
                    dataType: 'jsonp',
                    jsonpCallback: 'insiderPermissionLogCallback',
                    success: function() {
                        if (callback) {
                            callback();
                        }
                    },
                    error: function(xhr, error) {
                        if (config.debug) console.log(error);
                        pushAPI.exceptionUtil.handleException(error);
                    }
                });
            }
        }
    }();

    /**
     * Trigger for initializing pushAPI
     */
    sQuery(document).ready(function() {
        pushAPI.initialize();
    });

})();