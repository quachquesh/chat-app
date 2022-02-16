<template>
  <div id="chat-content">
    <div class="top" v-if="friend">
      <div class="avatar">
        <img
          src="https://i.pinimg.com/564x/bd/f4/99/bdf49998f95f4a679356c2bfa8c72405.jpg"
          alt=""
        />
        <span class="status" :class="{ online: friend.isOnline }"></span>
      </div>
      <div class="name">
        <span class="name-text">{{ friend.name }}</span>
        <span class="status-text" v-if="friend.isOnline">Đang hoạt động</span>
        <span class="status-text" v-else
          >Hoạt động {{ formatDate(friend.updatedAt) }}</span
        >
      </div>
    </div>
    <div class="content">
      <div
        class="message"
        v-for="(msg, index) in messages"
        :class="[
          {
            'my-message': msg.user == user._id,
          },
          styleBorder(msg, index),
        ]"
        :key="msg._id"
      >
        <img
          src="https://i.pinimg.com/564x/bd/f4/99/bdf49998f95f4a679356c2bfa8c72405.jpg"
          alt=""
          class="avatar"
          v-if="
            styleBorder(msg, index) == 'last' || styleBorder(msg, index) == ''
          "
        />
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="chat-input" v-if="friend">
      <div class="input-box">
        <div
          class="input"
          contenteditable="true"
          @input="inputMsg"
          @keypress.enter.exact.prevent="sendMessage()"
          id="chat-input"
        ></div>
        <span class="placeholder" :class="{ none: message }"
          >Nội dung chat</span
        >
      </div>
      <span class="send-chat" @click="sendMessage()">Send</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      message: '',
    }
  },
  methods: {
    styleBorder(msg, index) {
      if (index >= this.messages.length - 1) {
        if (this.messages[index - 1].user == msg.user) {
          return 'last'
        }
      } else {
        if (index == 0) {
          if (this.messages[index + 1].user == msg.user) {
            return 'first'
          }
        } else {
          if (this.messages[index - 1].user != msg.user) {
            if (this.messages[index + 1].user == msg.user) {
              return 'first'
            }
          } else if (this.messages[index + 1].user != msg.user) {
            return 'last'
          } else if (
            this.messages[index - 1].user == this.messages[index + 1].user
          ) {
            return 'mid'
          }
        }
      }
      return ''
    },
    sendMessage() {
      this.$emit('sendMessage', this.message)
      this.$set(this, 'message', '')
      document.getElementById('chat-input').innerText = ''
    },
    inputMsg(e) {
      this.$set(this, 'message', e.target.innerText)
    },
    formatDate(date) {
      let timeNow = new Date().getTime()
      let time = new Date(date).getTime()
      let diff = timeNow - time
      let minutes = Math.floor(diff / 60000)
      let hours = Math.floor(minutes / 60)
      let day = Math.floor(hours / 24)
      if (day > 0) {
        return day + ' ngày trước'
      } else if (hours > 0) {
        return hours + ' giờ trước'
      } else {
        return minutes + ' phút trước'
      }
    },
  },
  computed: {
    ...mapState({
      messages: (state) => state.message.messages,
      friend: (state) => state.message.user,
      user: (state) => state.user.user,
    }),
    friendInfo() {
      if (this.friend) {
        return this.friend
      } else {
        return {
          name: '',
          isOnline: false,
          updatedAt: '',
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#chat-content {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    display: flex;
    align-items: center;
    padding: 8px 18px;
    border-bottom: 1px solid #ccc;
    .avatar {
      position: relative;
      margin-right: 8px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
      .status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ccc;
        border: 2px solid #fff;
        box-shadow: 0px 0px 2px #000;
        position: absolute;
        bottom: 0;
        right: 0;
        &.online {
          background-color: #00b300;
        }
      }
    }
    .name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .name-text {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
      }
      .status-text {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .content {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-y: auto;
    .message {
      display: flex;
      align-items: center;
      margin: 1.5px 0;
      &.my-message {
        flex-direction: row-reverse;
        .avatar {
          margin-left: 12px;
          margin-right: 0;
          display: none;
        }
        .message-content {
          background-color: #0084ff;
          color: #fff;
          margin-left: 0 !important;
        }
        &.first {
          .message-content {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 0;
          }
        }
        &.mid {
          .message-content {
            border-top-left-radius: 20px;
            border-top-right-radius: 0;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 0;
          }
        }
        &.last {
          .message-content {
            border-top-left-radius: 20px;
            border-top-right-radius: 0;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
          }
        }
      }
      &.first {
        .avatar {
          display: none;
        }
        .message-content {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 0;
          margin-left: 44px;
        }
      }
      &.mid {
        .avatar {
          display: none;
        }
        .message-content {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin-left: 44px;
        }
      }
      &.last {
        .message-content {
          border-top-left-radius: 0;
          border-bottom-left-radius: 20px;
        }
      }
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #ccc;
        margin-right: 12px;
      }
      .message-content {
        background-color: #e4e6eb;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 18px;
        white-space: pre-wrap;
      }
    }
  }
  .chat-input {
    height: auto;
    background-color: #fff;
    border-top: 1px solid #ccc;
    font-size: 14px;
    color: #666;
    outline: none;
    font-size: 18px;
    padding: 16px 8px;
    display: flex;
    align-items: center;
    .input-box {
      flex: 1;
      position: relative;
      .input {
        max-height: 150px;
        overflow-y: auto;
        outline: none;
        border: 1px solid #ccc;
        border-radius: 20px;
        padding: 8px 16px;
        background-color: #f3f3f3;
      }
      .placeholder {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        user-select: none;
        pointer-events: none;
        color: #65676b;
        &.none {
          display: none;
        }
      }
    }
    .send-chat {
      margin: 0 6px 0 12px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
