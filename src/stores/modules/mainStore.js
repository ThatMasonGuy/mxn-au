// @/stores/mainStore.js
export const main = {
    state: () => ({
        user: null,
        token: null,
        rememberMe: false
    }),
    mutations: {
        setUser(state, { user, token, rememberMe }) {
            console.log('[Vuex setUser] user:', user, 'token:', token, 'rememberMe:', rememberMe);
            state.user = user;
            state.token = token;
            state.rememberMe = rememberMe;
        },
        clearAuth(state) {
            console.log('[Vuex clearAuth] Clearing auth from store...');
            state.user = null;
            state.token = null;
            state.rememberMe = false;
        }
    },
    actions: {
        restoreAuthFromStorage({ commit }) {
            let token = localStorage.getItem('token');
            let userJson = localStorage.getItem('user');

            if (!token) {
                token = sessionStorage.getItem('token');
                userJson = sessionStorage.getItem('user');
            }

            if (token && userJson) {
                const userObj = JSON.parse(userJson);
                commit('setUser', {
                    user: userObj,
                    token,
                    rememberMe: !!localStorage.getItem('token')
                });
            } else {

            }
        }
    }
};
