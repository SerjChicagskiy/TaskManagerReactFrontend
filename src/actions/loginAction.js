
import history from '../creators/creatorsHisrory';

export const userLoginFetch = user => {
    return  dispatch => {
        return fetch("https://localhost:5001/api/auth", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
            body:JSON.stringify({
              login:user.login,
              password:user.password
            })
        }).then(resp => resp.json())
        .then(data => {
          if (data.message) {
            
          } else {
            localStorage.setItem("token", data.token)
            dispatch(loginUser(data.login)) 
            history.push('/task')
          }
        })
    }
}
export const userPostFetch = user => {

    return dispatch => {
      return fetch("https://localhost:5001/api/user", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({user})
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            //Тут прописываем логику
          } else {
            localStorage.setItem("token", data.jwt)
            dispatch(loginUser(data.user))
          }
        })
    }
}

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    payload: userObj
})

export const logoutUser = () => ({
    type: 'LOGOUT_USER'
  })