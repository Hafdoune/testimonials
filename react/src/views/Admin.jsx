import { Navigate } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import axiosClient from "../axios"
import { useEffect, useState, useRef } from "react"
import Testimonial from "../components/Testimonial"
import Modal from "../components/Modal"
import {DndContext, closestCenter} from '@dnd-kit/core';
import {SortableContext, rectSortingStrategy, arrayMove} from '@dnd-kit/sortable';
import Error from "../components/error"


function Admin() {
    const {token, setToken} = useStateContext()
    const [testimonials, setTestimonials] = useState();
    const [open, setOpen] = useState(false);
    const [testimonial, setTestimonial] = useState({
        id: null,
        title: '',
        image: '',
        message: '',
        status: '',
    })
    const [formErrors, setformErrors] = useState('')


    useEffect(() => {
        axiosClient.get('/testimonials')
          .then(({data}) => {
            setTestimonials(data.data)
          }).catch((err) => {
            console.log(err);
          });
    },[])

    if(!token){
        return <Navigate to="/"/>
    }

    const handleLogout = async (e) => {
        e.preventDefault();

        setToken(null)
        await axiosClient.post('/logout')
    }

    const handleEditBtn = async (id) => {
        setOpen(true)

        axiosClient.get('/get-testimonial', {
            params:{
                id: id
            }
        })
        .then(({data}) => {
          setTestimonial(data)
          setformErrors('')
        }).catch((err) => {
          console.log(err);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {image, ...rest} = testimonial
        let payload = testimonial
        if (!(testimonial.image instanceof File)) {
            payload = rest
        }

        await axiosClient.post('/update-testimonial', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(({data}) => {
              const updatedTestimonials = [...testimonials]
              const index = updatedTestimonials.findIndex(item => item.id === data.id)

              if (index !== -1) {
                updatedTestimonials[index] = data
                setTestimonials(updatedTestimonials)
                handleClose()
              }
            }).catch((err) => {
              setformErrors(err.response.data.errors)
            });
    }
    

    const handleDragEnd = (event) => {
        const {active, over} = event

        if (active.id !== over.id) {
            setTestimonials((testimonials) => {
                const oldIndex = testimonials.findIndex((item) => item.id === active.id);
                const newIndex = testimonials.findIndex((item) => item.id === over.id);
    
                const updated = arrayMove(testimonials, oldIndex, newIndex);

                axiosClient.post('/update-order', updated)
                .then(({data}) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });

                return updated
            });            
        }

        
    }
    
    const handleClose = () => {
        setOpen(false)
        document.getElementById('updateForm').reset();
    }

    return (
        <div className="flex flex-col items-center h-screen m-8">
            <button className="self-center px-5 py-2 mb-8 font-bold text-orange-500 bg-white border-2 border-orange-500" onClick={handleLogout}>LOG OUT</button>
            <h1 className='mb-8 text-xl font-bold'>Testimonials</h1>
            <div className='grid grid-cols-4 gap-20'>
            {testimonials ? 
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={testimonials} strategy={rectSortingStrategy}>
                        {testimonials.map((testimonial, index) => (
                            <Testimonial testimonial={testimonial} key={testimonial.id}>
                            <button onClick={e => handleEditBtn(testimonial.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                            </button>
                            </Testimonial>
                            ))
                        }
                    </SortableContext>
                </DndContext>
                : ''
            }
            {testimonial &&
                <Modal open={open} onClose={handleClose}>
                    <form className="flex flex-col justify-start p-8" onSubmit={handleSubmit} id='updateForm'>
                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-bold" htmlFor="title">TITRE</label>
                            <input id="title" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" type="text" value={testimonial.title} onChange={e => setTestimonial({...testimonial, title: e.target.value})}/>
                            {formErrors.title ? <Error msg={formErrors.title}/> : ''}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-bold" htmlFor="image">IMAGE</label>
                            <img src={`http://127.0.0.1:8000/storage/${testimonial.image}`} className="m-auto max-h-36" alt="" />
                            <input id="image" className="w-full outline-none focus:shadow-outline" type="file" onChange={e => setTestimonial({...testimonial, image: e.target.files[0]})}/>
                            {formErrors.image ? <Error msg={formErrors.image}/> : ''}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-bold" htmlFor="message">MESSAGE</label>
                            <textarea id="message" rows="4" className="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow-outline bg-slate-100 border-slate-300" value={testimonial.message} onChange={e => setTestimonial({...testimonial, message: e.target.value})}></textarea>
                            {formErrors.message ? <Error msg={formErrors.message}/> : ''}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-bold" htmlFor="status">STATUS</label>                            
                            <select id="status" value={testimonial.status} onChange={e => setTestimonial({...testimonial, status: e.target.value})}>
                                <option value="1">Approuvé</option>
                                <option value="0">Rejeté</option>
                                <option value="2">En attente</option>
                            </select>
                            {formErrors.status ? <Error msg={formErrors.status}/> : ''}
                        </div>
                        <button className="self-center px-5 py-2 font-bold text-orange-500 border-2 border-orange-500" type="submit">SAVE</button>
                    </form>
                </Modal>
            }
            
            </div>
        </div>
    )
}

export default Admin