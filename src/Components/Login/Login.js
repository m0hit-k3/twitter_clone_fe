import React from 'react';
import './Login.css';
import {useState} from 'react'
import { FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const [visible, SetVisible] = useState(false);
    const [error, setError] = useState("");
    const [data, SetData] = useState({
        email: "",
        password: "",
    });

    const handleChange = ({currentTarget: input}) => {
        SetData({...data, [input.name]: input.value});
    }

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const url = 'http://127.0.0.1:5000/user/login';
            const res = await axios.post(url, data);
            if(res.data.status === 200){
              localStorage.setItem('userData', JSON.stringify(res.data))
              navigate("/tweet")
            }else{
                setError(res.data.message);
                alert(res.data.message);
            };
        }catch(error){
            if(error.response){
                setError(error.response.data.message);
                alert(error.response.data.message);
            }

        }
    }; 

  return (
    <div className='wrapper'>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-box'>
                <input type='text' 
                placeholder='Email Id'
                name = 'email'
                onChange={handleChange}
                value = {data.email}
                required />
                <FaUser className='icon'/>
            </div>
            <div className='input-box'>
                <input type= {visible ? "text" : "password"}
                name = 'password'
                placeholder='Password'
                onChange={handleChange}
                value = {data.password}
                required />
                <FaEye className='visible' on onClick={()=> SetVisible(!visible)}>Show Password</FaEye>
            </div>
            <div className='remember-forgot'>
                <label><input type='checkbox' /> Remember Me </label> 
                <a href= "#">Forgot Password?</a>
            </div>
            {error && <div>{error}</div>}
            <button type='submit'> LOGIN </button>

            <div className='register-link'>
            <p>Don't have an account?<a href = '/signup'> SIGNUP </a></p>
            </div>
            
        </form>
    </div>
  )
}


export default Login