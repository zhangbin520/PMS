import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import global from './global'
import downloadGlobal from "@/store/downloadGlobal";
import bannerGlobal from '@/store/bannerGlobal'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings
  },
  downloadGlobal,
  getters,
  global,
  bannerGlobal,
})




export default store
