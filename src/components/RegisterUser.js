import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {userPostFetch} from '../actions/loginAction';

class RegisterUser extends React.Component{
    constructor(props){
        super(props)
        this.handelSubmit=this.handelSubmit.bind(this)
        this.handleChange=this.handleChange.bind(this)
        this.state={
            name:'',
            lastname:'',
            email:'',
            birthday:'',
            photo:'',
            photopath:'',
            login:'',
            password:''
        }
    }
  
    handelSubmit(event){
      event.preventDefault()
      this.props.userPostFetch(this.state)
    }
  
    handleChange(event){
      const{name,value}=event.target
      this.setState({
        [name]: value
      })
    }

    render() {
        return (
            <>
                <div className="container">
                <form id="login-box"  onSubmit={this.handelSubmit}>
                    <div className="logo">
                    <img src="http://lorempixel.com/output/people-q-c-100-100-1.jpg" alt="logo" className="img img-responsive img-circle center-block"/>
                    <h1 className="logo-caption"><span className="tweak">R</span>egistration</h1>
                    </div>
                    <div className="controls">
                        <input  type="text" 
                                name="name" 
                                placeholder="Name" 
                                value={this.state.name} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="lastname" 
                                placeholder="Lastname" 
                                value={this.state.lastname} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="email" 
                                placeholder="Email" 
                                value={this.state.email} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="birthday" 
                                placeholder="Birthday" 
                                value={this.state.birthday} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="phone" 
                                placeholder="Phone" 
                                value={this.state.phone} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="photopath" 
                                placeholder="Photopath" 
                                value={this.state.photopath} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="text" 
                                name="login" 
                                placeholder="Login" 
                                value={this.state.login} 
                                className="form-control"
                                onChange={this.handleChange}/>
                        <input  type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={this.state.password} 
                                className="form-control"
                                onChange={this.handleChange} />
                        <button type="submit" className="btn btn-default btn-block btn-custom">Register</button>
                        <div style={{textAlign:'right'}} >
                          <Link to="/login" className="text-info">To login</Link>
                        </div>
                    </div>
                </form>
                </div>
            </>
        )
    }
}
const mapDispatchToProps = dispatch => ({
    userPostFetch: userInfo => dispatch(userPostFetch(userInfo))
  })
  
  export default connect(null, mapDispatchToProps)(RegisterUser);