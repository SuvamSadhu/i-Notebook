import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials,setCredentials] = useState({name:"",email:"",password:"",cpassword:""});
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password} = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/CreateUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name,email,password})
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
        //Save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/")
        props.showAlert("Account created successfully","success");
    }
    else{
      props.showAlert("Invalid credentials","danger");
    }
}

const onchange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value,[e.target.email]: e.target.value,[e.target.password]: e.target.value})
}
  return (
    <div className='container mt-3'>
      <h2 className='my-2'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="email">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onchange} aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={onchange} aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group mb-3 my-3">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onchange} placeholder="Password" minLength={5} required/>
        </div>
        <div className="form-group mb-3 my-3">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onchange} placeholder="Password" minLength={5} required/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
