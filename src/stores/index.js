// @/stores/index.js
import { createStore } from 'vuex';
import { server } from './modules/serverStore';
import { main } from './modules/mainStore';
import { topheroes } from './modules/topheroesStore';

export default createStore({
  modules: {
    server,
    main,
    topheroes,
  }
});