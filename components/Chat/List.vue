<template>
  <div id="chat-list">
    <div class="top">
      <input type="text" placeholder="Tìm kiếm user" v-model="search" />
    </div>
    <ul class="list-items">
      <li
        class="item"
        v-for="friend in listFriend()"
        :class="{
          active: message.user && message.user._id == userInfo(friend)._id,
        }"
        :key="friend._id"
        @click="showMessage(userInfo(friend)._id)"
      >
        <div class="item-box">
          <div class="avatar">
            <img
              src="https://i.pinimg.com/564x/bd/f4/99/bdf49998f95f4a679356c2bfa8c72405.jpg"
            />
            <span
              class="status"
              :class="{ online: userInfo(friend).isOnline }"
            ></span>
          </div>
          <div class="info">
            <div class="name">{{ userInfo(friend).name }}</div>
            <div class="last-message">
              <span class="message-content">
                {{ lastMessage(friend.messages).content }}
              </span>
              <span class="time">
                {{ formatDate(lastMessage(friend.messages).createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      search: '',
    }
  },
  methods: {
    userInfo(friend) {
      if (friend.user._id === this.user._id) {
        return friend.friend
      } else {
        return friend.user
      }
    },
    showMessage(id) {
      this.$router.push(`/${id}`)
    },
    formatDate(date) {
      if (!date) return ''
      let timeNow = new Date().getTime()
      let time = new Date(date).getTime()
      let diff = timeNow - time
      let minutes = Math.floor(diff / 60000)
      let hours = Math.floor(minutes / 60)
      let day = Math.floor(hours / 24)
      if (day > 0) {
        return day + ' ngày'
      } else if (hours > 0) {
        return hours + ' giờ'
      } else if (minutes < 1) {
        return 'Vừa xong'
      } else {
        return minutes + ' phút'
      }
    },
    lastMessage(messages) {
      if (messages.length > 0) {
        return messages[messages.length - 1]
      } else {
        return {
          content: '',
          user: '',
          messages: '',
          readed: '',
          createdAt: '',
        }
      }
    },
    listFriend() {
      if (this.search) {
        return this.friends.filter((friend) => {
          if (friend.user._id == this.user._id) {
            return (
              friend.friend.name
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) !== -1
            )
          } else {
            return (
              friend.user.name
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) !== -1
            )
          }
        })
      } else {
        return this.friends
      }
    },
  },
  computed: {
    ...mapState({
      friends: (state) => state.friend.friends,
      user: (state) => state.user.user,
      message: (state) => state.message,
    }),
  },
}
</script>

<style lang="scss" scoped>
#chat-list {
  width: 23%;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 12px 0;
    input {
      padding: 10px 18px;
      font-size: 16px;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 20px;
      width: 90%;
      box-sizing: border-box;
    }
  }
  .list-items {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    flex: 1;
    transition: 0.3s;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      // box-shadow: inset 0 0 5px grey;
    }
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    .item {
      padding: 12px 0;
      margin: 4px 12px;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      transition: 0.3s;
      &:hover {
        background-color: #f2f2f2;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      }
      &:active {
        background-color: #d2d2d2;
      }
      &.active {
        background-color: #f6f6f6;
      }
      .item-box {
        width: 100%;
        display: flex;
        align-items: center;
        .avatar {
          display: flex;
          align-items: center;
          margin-right: 12px;
          position: relative;
          img {
            width: 50px;
            height: 50px;
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
        .info {
          flex: 1;
          width: calc(100% - 52px);
          .name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 6px;
          }
          .last-message {
            display: flex;
            align-items: center;
            width: 100%;
            padding-right: 12px;
            box-sizing: border-box;
            .message-content {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              flex: 1;
            }
            .time {
              font-size: 12px;
              color: #888;
              margin-left: 12px;
              width: max-content;
            }
          }
        }
      }
    }
  }
}
</style>
