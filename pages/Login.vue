<template>
  <div class="login form">
    <form @submit.prevent="login($event)">
      <div class="form-group">
        <label for="">Username</label>
        <input type="text" class="form-control" v-model="username" />
      </div>
      <div class="form-group">
        <label for="">Password</label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <div class="form-group btn-group">
        <button class="btn btn-primary" type="submit" id="btn-login">Đăng nhập</button>
      </div>
      <div class="form-group btn-group">
        <span>Chưa có tài khoản?</span>
        <nuxt-link to="/register">Đăng ký</nuxt-link>
      </div>
    </form>
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
    async login(e) {
      let btn = e.submitter;
      btn.setAttribute('disabled', '');
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
            Cookies.set('token_exp', res.data.token_exp)
          } else {
            this.$toast.error(res.data.message)
            btn.removeAttribute('disabled');
          }
        })
        .catch(() => {
          btn.removeAttribute('disabled');
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
  },
  async validate({ req, redirect, store }) {
    // return true
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

<style lang="scss" scoped>
*,
html,
body {
  margin: 0;
  padding: 0;
}
body {
  background: #f5f5f5;
}
.form {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10%;
  form {
    width: 400px;
    .form-group {
      margin-bottom: 10px;
      label {
        display: block;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 10px;
        font-size: 14px;
        box-sizing: border-box;
        &:focus {
          outline: none;
          border-color: #2196f3;
        }
      }
    }
    .btn-group {
      margin-top: 12px;
      button[type="submit"] {
        &[disabled] {
          background: #44a4f1;
          &:hover {
            background: #44a4f1;
          }
        }
      }
      button,
      a {
        width: 100%;
        border: none;
        border-radius: 3px;
        padding: 10px;
        font-size: 14px;
        background: #2196f3;
        color: #fff;
        text-decoration: none;
        &:hover {
          background: #0d47a1;
        }
      }
      a {
        background: #1a8854;
        color: #fff;
        text-decoration: none;
        &:hover {
          background: #14b106;
        }
      }
    }
  }
}
</style>
