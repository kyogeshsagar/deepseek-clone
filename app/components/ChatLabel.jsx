import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'

const ChatLabel = ({ chat, isActive, openMenu, setOpenMenu, onSelect, onRename, onDelete }) => {
  const [renameValue, setRenameValue] = useState(chat.title)

  const handleRename = () => {
    onRename(renameValue)
    setOpenMenu({ id: 0, open: false })
  }

  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-2 text-sm group cursor-pointer rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10'}`}
    >
      <p className='group-hover:max-w-5/6 truncate'>{chat.title}</p>
      <div className='group relative flex items-center justify-center h-6 w-6 
      aspect-square hover:bg-black/80 rounded-lg'>
        <Image
          onClick={(event) => {
            event.stopPropagation()
            setOpenMenu({ id: chat.id, open: !openMenu.open || openMenu.id !== chat.id })
          }}
          src={assets.three_dots}
          alt=''
          className={`w-4 ${openMenu.open && openMenu.id === chat.id ? '' : 'hidden'} group-hover:block`}
        />
        <div className={`absolute ${openMenu.open && openMenu.id === chat.id ? 'block' : 'hidden'} -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}>
            <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                <Image src={assets.pencil_icon} alt='' className='w-4' />
                <button type='button' onClick={handleRename}>Rename</button>
            </div>
             <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                <Image src={assets.delete_icon} alt='' className='w-4' />
                <button type='button' onClick={onDelete}>Delete</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLabel
