<template>
  <div>
    <Navbar @logOut="logOut()" />
    <nuxt-child :socket="socket" :key="$route.params.id" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
const { io } = require('socket.io-client')

export default {
  name: 'IndexPage',
  middleware: 'auth',
  data() {
    return {
      socket: null,
      token: Cookies.get('token'),
    }
  },
  async mounted() {
    await this.$store.dispatch('friend/getFriends', this.token)
    this.socket = await io.connect(process.env.URL_SOCKET || 'localhost:3001', {
      extraHeaders: {
        Authorization: 'Bearer ' + this.token,
      },
    })
    this.socket.emit('user-online', {})
    this.socket.on('user-online', (user) => {
      this.$store.commit('friend/SET_ONLINE', user)
      let userMsg = this.$store.getters['message/getUser']
      console.log(userMsg._id, user._id)
      if (userMsg._id == user._id) {
        this.$store.commit('message/SET_USER', user)
      }
    })
    this.socket.on('user-offline', (user) => {
      this.$store.commit('friend/SET_OFFLINE', user)
      let userMsg = this.$store.getters['message/getUser']
      if (userMsg._id == user._id) {
        this.$store.commit('message/SET_USER', user)
      }
    })

    // Nhận tin nhắn từ người khác
    await this.socket.on('receiver-message', (message) => {
      this.$store.commit('message/ADD_MESSAGE', message)
      this.$store.commit('friend/NEW_LAST_MESSAGE', {
        friendId: message.user,
        message,
      })
    })
  },
  methods: {
    logOut() {
      console.log('socket close')
      this.socket.close()
      this.$store.commit('message/CLEAR_MESSAGES')
    },
  },
}
</script>

<style>
*,
html,
body {
  margin: 0;
  padding: 0;
}
</style>
