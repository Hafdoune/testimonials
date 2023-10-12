import {useEffect, useState, useRef} from 'react';
import axiosClient from '../axios';
import Form from '../components/form';
import Testimonial from '../components/Testimonial';
import Modal from '../components/Modal';
import Error from '../components/error';
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { Navigate } from 'react-router-dom';

function Testimonials() {
  const [testimonials, setTestimonials] = useState();
  const [open, setOpen] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const { setToken, token } = useStateContext()
  const emailRef = useRef()
  const passwordRef = useRef()

  useEffect(() => {
    axiosClient.get('/testimonials')
      .then(({data}) => {
        setTestimonials(data.data)
      }).catch((err) => {
        console.log(err);
      });
  },[])
  
  if (token) {
    return <Navigate to="/Admin"/>
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    await axiosClient.post('/login', payload)
    .then(({data}) => {
      setToken(data.access_token);
    }).catch((err) => {
      setLoginError(err.response.data.error)
    });
  }
  
  

  return (
    <div className='flex flex-col items-center h-screen m-8'>
        <button className="self-center px-5 py-2 mb-8 font-bold text-orange-500 bg-white border-2 border-orange-500" onClick={() => setOpen(true)}>LOGIN</button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <form className='flex flex-col justify-start p-8' onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block mb-1 text-sm font-bold" htmlFor="email">EMAIL *</label>
              <input id="email" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" type="text" ref={emailRef}/>
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-sm font-bold" htmlFor="password">PASWWORD *</label>
              <input id="password" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" type="password" ref={passwordRef}/>
              {loginError ? <Error msg={loginError}/> : ''}
            </div>
            <button className="self-center px-5 py-2 font-bold text-orange-500 border-2 border-orange-500" type="submit">LOGIN</button>
          </form>
        </Modal>

        <Form setTestimonials={setTestimonials} testimonials={testimonials}/>
        <h1 className='mb-8 text-xl font-bold'>Testimonials</h1>
        <div className='grid w-full grid-cols-4 gap-12'>
          {testimonials        
            ? testimonials.map((testimonial, index) => (
              <Testimonial testimonial={testimonial} key={index} />
            ))
            : ''
          }
        </div>
    </div>
  )
}

export default Testimonials