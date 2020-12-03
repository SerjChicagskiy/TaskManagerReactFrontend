import React from 'react';
import '../CSS/Login.css';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {userLoginFetch} from '../actions/loginAction';

class Login extends React.Component{
  constructor(props){
    super(props)
    this.handelSubmit=this.handelSubmit.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.state={
      login:'',
      password:''
    }
  }

  handelSubmit(event){
    event.preventDefault()
    this.props.userLoginFetch(this.state)
  }

  handleChange(event){
    const{name,value,cheked,type}=event.target
    this.setState({
      [name]: type==='checkbox'?cheked:value
    })
  }
  render() {
        return (
          <>
            <div className="container">
              <form id="login-box"  onSubmit={this.handelSubmit}>
                <div className="logo">
                  <img src="http://lorempixel.com/output/people-q-c-100-100-1.jpg" alt="logo" className="img img-responsive img-circle center-block"/>
                  <h1 className="logo-caption"><span className="tweak">L</span>ogin</h1>
                </div>
                <div className="controls">
                  <input type="text" 
                        name="login" 
                        placeholder="Login" 
                        value={this.state.login} 
                        className="form-control"
                        onChange={this.handleChange}/>
                  <input type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={this.state.password} 
                        className="form-control"
                        onChange={this.handleChange} />
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                      <div>
                        <label className="text-info">Remember me <input name="rememberMe" type="checkbox" onChange={this.handleChange} checked={this.state.rememberMe}/></label>
                      </div>
                      <div>
                          <Link to="/task" className="text-info">Register here</Link>
                      </div>
                    </div>
                  <button type="submit" className="btn btn-default btn-block btn-custom">Login</button>
                </div>
              </form>
            </div>
        </>
        );
      }
}

const mapDispatchToProps = dispatch => ({
  userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Login);