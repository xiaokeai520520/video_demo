import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      currentTabIndex: 0
    }
  },
  mutations: {
    setTabIndex(state, index) {
      state.currentTabIndex = index
    }
  }
})

export default store