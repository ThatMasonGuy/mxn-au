// @/stores/index.js
import { createStore } from 'vuex';
import { server } from './modules/serverStore';
import { main } from './modules/mainStore';

export default createStore({
  modules: {
    server,
    main,
  }
});