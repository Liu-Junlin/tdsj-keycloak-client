const KeycloakUtil = {
    defaultInitOptions: {
        onLoad: 'login-required',
        checkLoginIframe: window.location.protocol === "https",
        enableLogging: true
    },
    _refreshInterval: 60,
    autoRefreshToken(keycloakInstance, callback) {
        let this_ = this;
        this._refreshTokenHandler(keycloakInstance, callback);
        setInterval(this._refreshTokenHandler, this._refreshInterval * 1000, keycloakInstance, callback);
        try {
            if (window) {
                if (window.addEventListener) {
                    window.addEventListener("focus", function () {
                        this_._refreshTokenHandler(keycloakInstance, callback);
                    }, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onfocus", function () {
                        this_._refreshTokenHandler(keycloakInstance, callback);
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    },
    _refreshTokenHandler(keycloakInstance, successCallback, failCallback) {
        keycloakInstance.updateToken(this._refreshInterval * 2 + 10)
            .then((refreshed) => {
                if (refreshed) {
                    if (successCallback) {
                        successCallback()
                    } else {
                        console.debug('token refreshed.')
                    }
                } else {
                    console.debug('Token is still valid. Exp:' + new Date(keycloakInstance.tokenParsed.exp * 1000));
                }
            }).catch(function () {
            console.error('Failed to refresh the token, or the session has expired');
            if (failCallback) {
                failCallback();
            }
        });
    },
    getUserDisplayName(keycloakProfile) {
        let name = '';
        if (keycloakProfile.lastName) {
            name += keycloakProfile.lastName;
        }
        if (keycloakProfile.firstName) {
            name += keycloakProfile.firstName;
        }
        if (!name) {
            name = keycloakProfile.username;
        }
        return name;
    }
}
export default KeycloakUtil;