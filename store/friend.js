import Vue from 'vue'

export const state = () => ({
  friends: [],
  searchFriends: [],
})

export const mutations = {
  SET_FRIENDS(state, friends) {
    state.friends = friends
  },
  ADD_FRIEND(state, friend) {
    state.friends.push(friend)
  },
  SET_SEARCHFRIENDS(state, searchFriends) {
    state.searchFriends = searchFriends
  },
  SET_ONLINE(state, friend) {
    for (const i in state.friends) {
      const f = state.friends[i]
      if (f.user._id == friend._id) {
        Vue.set(state.friends[i].user, 'isOnline', true)
        return true
      } else if (f.friend._id == friend._id) {
        Vue.set(state.friends[i].friend, 'isOnline', true)
        return true
      }
    }
  },
  SET_OFFLINE(state, friend) {
    for (const i in state.friends) {
      const f = state.friends[i]
      if (f.user._id == friend._id) {
        Vue.set(state.friends[i].user, 'isOnline', false)
        return true
      } else if (f.friend._id == friend._id) {
        Vue.set(state.friends[i].friend, 'isOnline', false)
        return true
      }
    }
  },
  NEW_LAST_MESSAGE(state, { friendId, message }) {
    for (const i in state.friends) {
      const f = state.friends[i]
      if (f.user._id == friendId || f.friend._id == friendId) {
        state.friends[i].messages.push(message)
        break
      }
    }
  },
}

export const actions = {
  async getFriends({ commit }, token) {
    await this.$axios
      .$get('/friends', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((friends) => {
        commit('SET_FRIENDS', friends)
      })
  },
  async searchFriends({ commit }, { search, token }) {
    if (search.length > 0) {
      const searchFriends = await this.$axios.$get(
        `/friends?search=${search}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      commit('SET_SEARCHFRIENDS', searchFriends)
    } else {
      commit('SET_SEARCHFRIENDS', [])
    }
  },
  async addFriend({ commit }, { friendId, token }) {
    const res = await this.$axios.$post(
      `/friends`,
      { friendId },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    if (res.message) {
      this.$toast.error(res.message)
    } else {
      this.$toast.success('Thêm bạn bè thành công')
      commit('ADD_FRIEND', res)
    }
  },
}

export const getters = {}
