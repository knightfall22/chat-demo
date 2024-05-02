"use client"

import React from 'react'
import { Input } from './ui/input'
import { createClient } from '@/lib/supabase/browser'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/lib/store/user'
import { IMessage, useMessage } from '@/lib/store/messages'
import { publishMessage } from '@/hooks/useMessages'
import { useConversation } from '@/lib/store/conversation'

const ChatInput = () => {
    const user = useUser(state => state.user)
    const {addMessage, setOptimisticIds} = useMessage(state => state)
    {/*@ts-ignore */}
    const conversation = useConversation(state => state.conversation)
    console.log("look at me",conversation);

    const supabase = createClient()
    const handleMesssage = async (text: string) => {
        // if (!text.trim()) {
        //     return;
        // }
        // const newMessage = {
        //     id: uuidv4(),
        //     text: text,
        //     sent_by: user?.id,
        //     is_edit: false,
        //     created_at: new Date().toISOString(),
        //     users: {
        //         id: uuidv4(),
        //         full_name: user?.user_metadata.full_name,
        //         avatar_url: user?.user_metadata.avatar_url,
        //         created_at: new Date().toISOString(),
        //     }

        // }

        // addMessage(newMessage as IMessage)
        // setOptimisticIds(newMessage.id)


        

        const error = await publishMessage(conversation[0].id,text)

        if(error) {
            toast.message(error.message)
        }

    }
  return (
    <div className="p-5">
    <Input 
      placeholder='send message'
      onKeyDown={e => {
        if (e.key === "Enter") {
            handleMesssage(e.currentTarget.value)
            e.currentTarget.value = ""
        }
      }}
    />
  </div>
  )
}

export default ChatInput