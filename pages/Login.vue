<template>
  <div class="login">
    <form @submit.prevent="login()">
      <div class="form-group">
        <label for="">Username</label>
        <input type="text" class="form-control" v-model="username" />
      </div>
      <div class="form-group">
        <label for="">Password</label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary">Login</button>
      </div>
    </form>
    <!-- <button @click="checkToken()">Check token</button> -->
    <nuxt-link to="/register">Register</nuxt-link>
    <!-- <button @click="logout()">LogOut</button>
    <nuxt-link to="/">index</nuxt-link> -->
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    logout() {
      let token = localStorage.getItem('token')
      this.$axios
        .$delete('/user/logout', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res)
        })
    },
    async login() {
      let token = null
      // đăng nhập lấy token
      await this.$store
        .dispatch('user/login', {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.data.status) {
            token = res.data.token
            Cookies.set('token', token)
            Cookies.set('token_exp', res.headers.token_exp)
          } else {
            this.$toast.error(res.data.message)
          }
        })
      // check info token
      if (token) {
        await this.$store
          .dispatch('user/auth', {
            token,
          })
          .then((res) => {
            if (res) {
              this.$router.push('/')
            }
          })
          .catch(() => {
            Cookies.remove('token')
          })
      }
    },
    checkToken() {
      let token = Cookies.get('token')
      this.$axios
        .$get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res)
        })
    },
  },
  async validate({ req, redirect, store }) {
    let token = null
    let token_exp = 0
    if (process.server && req.headers.cookie) {
      token = req.headers.cookie.split('token=')[1].split(';')[0]
      token_exp = req.headers.cookie.split('token_exp=')[1].split(';')[0]
    }
    let timeNow = new Date().getTime()
    if (!token || token_exp < timeNow) {
      return true
    } else if (token) {
      return await store
        .dispatch('user/auth', { token })
        .then(() => {
          redirect('/')
        })
        .catch(() => {
          return true
        })
      // return true
    } else {
      redirect('/')
    }
  },
  beforeCreate() {
    Cookies.remove('token')
    Cookies.remove('token_exp')
    this.$store.dispatch('user/logout')
  },
}
</script>

<style>
</style>
