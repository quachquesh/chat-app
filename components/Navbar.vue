<template>
  <nav>
    <div class="nav-left">
      <input
        type="text"
        class="search-box"
        placeholder="Tìm bạn bè"
        v-model="search"
        @keypress.enter="searchFriend(search)"
      />
      <ul
        class="list-friend"
        v-if="$store.state.friend.searchFriends.length > 0"
      >
        <li
          v-for="friend in $store.state.friend.searchFriends"
          :key="friend._id"
          @click="addFriend(friend)"
        >
          <img
            src="https://i.pinimg.com/564x/bd/f4/99/bdf49998f95f4a679356c2bfa8c72405.jpg"
          />
          <span>{{ friend.name }}</span>
        </li>
      </ul>
    </div>
    <div class="nav-right">
      <span>Xin chào,</span>
      <span class="name">{{ $store.state.user.user.name }}</span>
      <img
        src="https://i.pinimg.com/564x/bd/f4/99/bdf49998f95f4a679356c2bfa8c72405.jpg"
        alt="avatar"
        class="avatar"
      />
      <div class="btn-logout" @click="logout()">Đăng xuất</div>
    </div>
  </nav>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Navbar',
  data() {
    return {
      search: '',
    }
  },
  methods: {
    async logout() {
      await this.$emit('logOut')
      Cookies.remove('token')
      Cookies.remove('token_exp')
      this.$router.push('/login')
    },
    async searchFriend(search) {
      let token = Cookies.get('token')
      this.$store.dispatch('friend/searchFriends', {
        search,
        token,
      })
    },
    async addFriend(friend) {
      let token = Cookies.get('token')
      await this.$store.dispatch('friend/addFriend', {
        friendId: friend._id,
        token,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #0084ff;
  padding: 0 20px;
  z-index: 10;
  .nav-left {
    display: flex;
    align-items: center;
    position: relative;
    .search-box {
      width: 300px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0 10px;
      font-size: 14px;
      color: #666;
      outline: none;
      font-size: 18px;
    }
    .list-friend {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      min-width: 300px;
      width: max-content;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 5px #ccc;
      z-index: 10;
      li {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f5;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          border: 1px solid #ccc;
        }
        span {
          margin-left: 6px;
          font-size: 16px;
          color: #666;
        }
      }
    }
  }
  .nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #fff;
    font-size: 20px;
    flex: 1;
    .name {
      font-weight: 600;
      margin: 0 8px 0 6px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: 10px;
      object-fit: cover;
      object-position: center;
    }
    .btn-logout {
      margin-left: 16px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      border: 1px solid #ccc;
      transition: 0.3s;
      &:hover {
        background-color: #fff;
        color: #333;
      }
    }
  }
}
</style>>
