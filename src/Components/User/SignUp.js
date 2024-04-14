import React from 'react';
import '../Login/Login.css';
import {useState} from 'react'
import { FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';





const SignUp = () => {
    const [visible1, SetVisible1] = useState(false);
    const [error, setError] = useState("");

    const [data, SetData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();


    const handleChange = ({currentTarget: input}) => {
        SetData({...data, [input.name]: input.value});
    }

    const handleSubmit = async(e) => {

        e.preventDefault();
         try{
            const url = 'http://127.0.0.1:5000/user/create_user';
            const {data: res} = await axios.post(url, data);
            navigate("/login")
        }catch(error){
            if(error.response){
                setError(error.response.data.message);
                alert(error.response.data.message)
            }

        }
    }; 



  return (
   <div className='wrapper'>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-box'>
                <input type='text'
                placeholder='Full Name'
                name = 'name'
                onChange={handleChange}
                value={data.name}
                required />
                <FaUser className='icon'/>
            </div>
            <div className='input-box'>
                <input type='text' 
                placeholder='Email Id'
                name= 'email'
                onChange={handleChange}
                value={data.email}
                required />
                <FaUser className='icon'/>
            </div>
            <div className='input-box'>
                <input type= {visible1 ? "text" : "password"}
                placeholder='Password'
                onChange={handleChange}
                name = 'password'
                value={data.password}
                required />
                <FaEye className='visible' on onClick={()=> SetVisible1(!visible1)}>Show Password</FaEye>

            </div>
            <button type='submit'> SUBMIT </button>

            <div className='register-link'>
            <p>Already have an account?<a href = '/login'> LOGIN</a></p>
            </div>
        </form>
    </div>
  )
}

export default SignUp