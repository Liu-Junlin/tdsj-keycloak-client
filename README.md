# tdsj-keycloak-client

> keycloak js client for vue,auto refresh access_token(use refresh token)

## Build Setup
``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# pack for production
npm pack

# publish
npm publish

# build for production and view the bundle analyzer report
npm run build --report
```
## Example
```
import KeycloakUtil from "tdsj-keycloak-client";
import Keycloak from "keycloak-js";
let keycloak = Keycloak({
    "url": "http://192.168.80.190:5080/auth",
    "realm": "tdsj-dev", 
    "clientId": "gsff-dual-front"
});
keycloak.init(KeycloakUtil.defaultInitOptions).then((authenticated) => {
    if (authenticated) {
        Vue.prototype.axios.defaults.headers.common['Authorization'] = "Bearer " + keycloak.token;
            window.vm = new Vue({
                el: '#app',
                router,
                config: {
                    productionTip: false
                },
                components: {App},
                template: '<App/>',
                created() {
                    KeycloakUtil.autoRefreshToken(keycloak, () => {
                        //if success refresh token,set to global header
                        Vue.prototype.axios.defaults.headers.common['Authorization'] = "Bearer " + keycloak.token;
                    }, () => {
                        window.location.reload();
                    });
                }
            });
    } else {
        alert('failed to authenticated');
        keycloak.logout();
    }
}).catch(function () {
    alert('failed to initialize');
    keycloak.logout();
});
Vue.prototype.$keycloak = KeycloakClient;
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
## Changelog
### 1.1.7 move to github