import {useRef, useState} from 'react';
import axiosClient from '../axios';
import Error from "../components/error";

function Form({setTestimonials, testimonials}) {
  const titleRef = useRef();
  const msgRef = useRef();
  const imgRef = useRef();

  const [formErrors, setformErrors] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      title : titleRef.current.value,
      message : msgRef.current.value,
      image : imgRef.current.files[0],
    }

    await axiosClient.post('/add-testimonial', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    })
      .then(({data}) => {
        // console.log(data);
        // setTestimonials([...testimonials, data])
      }).catch((err) => {
        setformErrors(err.response.data.errors)
      });
  }

  return (
    <form className="flex flex-col justify-start w-1/2 p-12 mb-8 bg-white" onSubmit={handleSubmit}>
        <div className="mb-6">
            <label className="block mb-1 text-sm font-bold" htmlFor="title">TITRE *</label>
            <input id="title" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" type="text" ref={titleRef}/>
            {formErrors.title ? <Error msg={formErrors.title}/> : ''}
        </div>
        <div className="mb-6">
            <label className="block mb-1 text-sm font-bold" htmlFor="image">IMAGE</label>
            <input id="image" className="w-full outline-none focus:shadow-outline" type="file" ref={imgRef}/>
            {formErrors.image ? <Error msg={formErrors.image}/> : ''}
        </div>

        <div className="mb-6">
            <label className="block mb-1 text-sm font-bold" htmlFor="message">MESSAGE *</label>
            <textarea id="message" rows="4" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" ref={msgRef}></textarea>
            {formErrors.message ? <Error msg={formErrors.message}/> : ''}
        </div>

        <button className="self-center px-5 py-2 font-bold text-orange-500 border-2 border-orange-500" type="submit">ADD NEW TESTIMONIAL</button>
    </form>
  )
}

export default Form