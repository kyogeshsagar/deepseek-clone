'use client';
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PromptBox from "./components/PromptBox";
import Message from "./components/Message";
import { useAppContext } from "./context/AppContext";

export default function Home() {
const [expand,setExpand] = useState(false);
const { activeChat, isLoading, sendPrompt } = useAppContext();

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={()=>(expand ? setExpand(false) : setExpand(true))} className="rotate-180" src={assets.menu_icon} alt="" />
            <Image className="opacity-70" src={assets.chat_icon} alt="" />
          </div>
          
          {!activeChat || activeChat.messages.length === 0 ? (
            <>
            <div className="flex items-center gap-3">
              <Image src={assets.logo_icon} alt="" className="h-16" />
              <p className="text-2xl font-medium">Hi, I&apos;m DeepSeek</p>
            </div>
            <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ):(
        <div className="w-full overflow-y-auto px-2 py-6">
          {activeChat.messages.map((message, index) => (
            <Message key={`${activeChat.id}-${index}`} role={message.role} content={message.content} />
          ))}
        </div>)
        }
        <PromptBox isLoading={isLoading} onSendPrompt={sendPrompt} />
        <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
