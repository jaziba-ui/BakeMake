import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
  email: "", password: ""
})

let Navigate = useNavigate();

const handleSubmit = async (err) => {
  err.preventDefault();
  console.log(JSON.stringify({
    email: credentials.email,
    password: credentials.password
  }))
  const response = await fetch("http://localhost:5000/api/loginuser",{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    })
  }) ;
    const json = await response.json();
    console.log(json);

  if(!json.success){
    alert("VALID EMAIL OR PASSWORD PLEASE!")
  }

  if(json.success){
    localStorage.setItem("userEmail", credentials.email)
    localStorage.setItem("authToken",json.authToken)
    Navigate('/')
    console.log(localStorage.getItem("userEmail"))
    console.log("authToken",json.authToken)
  }
}

const onChange = (event) => {
  setCredentials({
    ...credentials,[event.target.name] :
    event.target.value
  })
}
  return (
    <div className='container' >
    <form onSubmit={handleSubmit}>   
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={credentials.email} onChange={onChange}/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onChange}/>
  </div>
  <button type="submit" className="btn btn-warning ">Submit</button>
  <Link to='/createuser' className='m-3 btn btn-success'>New user</Link>
</form>
</div>
  )
}
