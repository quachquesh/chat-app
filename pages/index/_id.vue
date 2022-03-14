<template>
  <div id="chat-main">
    <ChatList />
    <ChatContent @sendMessage="sendMessage" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'ChatMain',
  props: {
    socket: {
      type: Object,
    },
  },
  data() {
    return {
      id: this.$route.params.id,
    }
  },
  methods: {
    sendMessage(content) {
      this.socket.emit(
        'send-message',
        {
          content,
          receiver: this.$store.state.message.user._id,
        },
        (res) => {
          if (res.status) {
            this.$store.commit('message/ADD_MESSAGE', res.message)
            this.$store.commit('friend/NEW_LAST_MESSAGE', {
              friendId: res.message.receiver,
              message: res.message,
            })
          } else {
            this.$toast.error(res.message)
          }
        }
      )
    },
  },
  async mounted() {
    if (this.id) {
      await this.$store
        .dispatch('message/getMessages', {
          friendId: this.id,
          token: Cookies.get('token'),
        })
        .then(() => {
          let contentElement = document.querySelector('#chat-content .content')
          contentElement.scrollTop = contentElement.scrollHeight
        })
    }
  },
}
</script>

<style lang="scss" scoped>
#chat-main {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 60px);
}
</style>
