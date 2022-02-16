import Vue from 'vue'
export const state = () => ({
  messages: [],
  user: null,
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages
  },
  ADD_MESSAGE(state, message) {
    if (message.user == state.user._id || message.receiver == state.user._id) {
      state.messages.push(message)
    }
  },
  READ_MESSAGE(state, message) {
    for (const i in state.messages) {
      let msg = state.messages[i]
      if (msg._id == message._id) {
        Vue.set(state.messages[i], 'isRead', true)
        break
      }
    }
  },
  CLEAR_MESSAGES(state) {
    state.messages = []
    state.user = null
  },
}

export const actions = {
  async getMessages({ commit }, { friendId, token }) {
    console.log('getMessages')
    let data = await this.$axios.$get(`/messages/${friendId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    commit('SET_USER', data.user)
    commit('SET_MESSAGES', data.messages)
    return data
  },
}

export const getters = {
  getUser(state) {
    return state.user
  },
}
