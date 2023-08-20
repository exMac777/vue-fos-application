import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    primaryMenu: [],
  },
  mutations: {
    setPrimaryMenu(state, payload) {
      state.primaryMenu = payload;
    },
  },
  actions: {
    async getPrimaryMenu({ commit }) {
      try {
        const response = await axios('src/server/response.json');
        console.log(response);
        // debugger;
        commit('setPrimaryMenu', response.data);
      } catch (error) {
        console.error('An error occurred ', error);
      }
    },
  },
  getters: {
    primaryMenu(state) {
      return state.primaryMenu;
    },
  },
});

export default store;
