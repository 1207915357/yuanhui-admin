import { logout } from '@/api/user'
import user from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userId: '',
  userType: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_USERTYPE: (state, userType) => {
    state.userType = userType
  },
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user.login({ userName:username, password }).then(response => {
        const {data}  = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.getUserInfo().then(response => {
        const {data} = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { userName, avatar , userId, type} = data
        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', userId)
        commit('SET_USERTYPE', type)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

