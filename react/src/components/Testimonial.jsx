// import React from 'react'

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

function Testimonial({testimonial, children}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: testimonial.id})

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const getExtension = (filename) => {
    return filename.split('.').pop()
  }

  if (testimonial.status == 0) {
    testimonial.status = 'rejeté'
  }else if (testimonial.status == 1) {
    testimonial.status = 'approuvé'
  }else if (testimonial.status == 2) {
    testimonial.status = 'en attente'
  }

  return (
    <div 
    className="flex flex-col items-center justify-center mx-auto text-sm" 
    ref={setNodeRef}
    style={style}
    > 
    <div 
    {...attributes}
    {...listeners}
    className="flex flex-col items-center justify-center"
    >
      {((getExtension(testimonial.image).toLowerCase() === 'png' ) || (getExtension(testimonial.image).toLowerCase() === 'jpeg' ) || (getExtension(testimonial.image).toLowerCase() === 'jpg' ))
        ? <img src={`http://127.0.0.1:8000/storage/${testimonial.image}`} className="mb-8 h-36 " alt="" />
        : <img src='./word.png' className="mb-8 h-36 " alt="" />
      }
      <h3 className="mx-auto text-xl">{testimonial.title}</h3>
      <p className="mx-auto text-base">{testimonial.message}</p>
      <p className="mx-auto text-sm">Status: {testimonial.status}</p>
      <p className="mx-auto text-xs">Date: {testimonial.created_at}</p>
    </div>
      {children}
    </div>
  )
}

export default Testimonial