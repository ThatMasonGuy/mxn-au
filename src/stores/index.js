// @/stores/index.js
import { createStore } from 'vuex';
import { server } from './server/serverStore';
import { main } from './mainStore';

export default createStore({
  modules: {
    server,
    main,
  }
});