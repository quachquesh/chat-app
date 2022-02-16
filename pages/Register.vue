<template>
  <div class="login">
    <form @submit.prevent="register()">
      <div class="form-group">
        <label for="">Name</label>
        <input type="text" class="form-control" v-model="name" />
      </div>
      <div class="form-group">
        <label for="">Username</label>
        <input type="text" class="form-control" v-model="username" />
      </div>
      <div class="form-group">
        <label for="">Password</label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary">Đăng ký</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      username: '',
      password: '',
    }
  },
  methods: {
    register() {
      this.$axios
        .$post('/user/register', {
          name: this.name,
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.status) {
            this.$router.push('/login')
          } else {
            this.$toast.error(res.message)
          }
        })
    },
  },
}
</script>

<style>
</style>
