import Cookies from 'js-cookie'
export default async function ({ store, req, redirect }) {
  let token = null
  let token_exp = 0
  if (process.client) {
    token = Cookies.get('token')
    token_exp = Cookies.get('token_exp')
  } else if (process.server && req.headers.cookie) {
    token = req.headers.cookie.split('token=')[1].split(';')[0]
    token_exp = req.headers.cookie.split('token_exp=')[1].split(';')[0]
  }
  if (token && token_exp) {
    let timeNow = new Date().getTime()
    if (token_exp > timeNow) {
      return await store
        .dispatch('user/auth', { token })
        .then(() => true)
        .catch(() => redirect('/login'))
    }
  }
  redirect('/login')
}
