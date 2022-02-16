export const state = () => ({
  user: null,
  LoggedIn: false,
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOGGEDIN(state, loggedIn) {
    state.LoggedIn = loggedIn
  },
}

export const actions = {
  async login({}, dataLogin) {
    const axios = await this.$axios.post('/user/login', dataLogin)
    return axios
  },
  async auth({ commit }, { token }) {
    const data = await this.$axios.$get('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (data) {
      commit('SET_USER', data)
      commit('SET_LOGGEDIN', true)
      return data
    } else {
      return false
    }
  },
  async logout({ commit }) {
    commit('SET_USER', null)
    commit('SET_LOGGEDIN', false)
    return true
  },
}

export const getters = {}
