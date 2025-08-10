import { createStore } from 'vuex'
import { userKey } from '../global'

export default createStore({
    state() { 
        return {
            isMenuVisible: true,
            user: JSON.parse(localStorage.getItem(userKey)) || null
        };
    }, 
    mutations: {
        toggleMenu(state, isVisible) {
            if(isVisible === undefined){
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }
        },
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
          state.user = null
        }
    }
})