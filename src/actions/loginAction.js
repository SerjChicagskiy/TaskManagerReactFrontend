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
            console.log(data.message)
          } else {
            localStorage.setItem("token", data.token)
            dispatch(loginUser(data)) 
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
        body: JSON.stringify({
          name:user.name,
          lastname:user.lastname,
          photopath:user.photopath,
          birthday:user.birthday,
          email:user.email,
          phone:user.phone,
          login:user.login,
          password:user.password
        })
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            console.log("mes--------"+data.message)
          } else {
            dispatch(loginUser(user))
            history.push('/login')
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