import React from "react";
import { Button } from "@/components/ui/button";
import ChatHeader from "@/components/ChatHeader";
import { createClient } from "@/lib/supabase/server";
import InitUser from "@/lib/store/initUser";
import { Input } from "@/components/ui/input";
import ChatInput from "@/components/ChatInput";
import ListMessages from "@/components/ListMessages";
import ChatMessages from "@/components/ChatMessages";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import ChatAbout from "@/components/ChatAbout";
import { useUser } from "@/lib/store/user";

const page = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let usersList;

  const user = data.user;

  if (user !== null) {
    const {data: asData} = await supabase
    .from("users")
    .select("*")

    console.log("this is data",asData);
    

    usersList = asData
  }

  return (
    <>
    
      <div className="max-w-5xl mx-auto md:py-10 h-screen flex">
        {user ? (
          <Sidebar user={user} />
        ) : (
          <div className="w-1/4 flex flex-col items-center rounded-md py-5 border-l border-t border-b"></div>
        )}
        <div className=" h-full border rounded-md flex flex-col relative flex-1">
          {/* @ts-ignore */}
          <ChatHeader user={user} list={usersList}/>
          {user ? (
            <>
            <ChatMessages />

            <ChatInput />
          </>
          ): <ChatAbout/>}
        </div>
      </div>

      <InitUser user={user!} />
    </>
  );
};

export default page;
