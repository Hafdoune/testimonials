// import { Children } from "react"

function Modal({open, onClose, children}) {

    return (
        <div className={`${open ? 'visible bg-black/20' : 'invisible'} fixed inset-0 flex items-center justify-center transition-colors`} onClick={onClose}>
            <div className={`${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}p-6 transition-all bg-white shadow`} onClick={(e) => e.stopPropagation()}>
                <button className='absolute text-gray-400 top-6 right-6' onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    )
}

export default Modal