"use client"

import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"

  import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

  import {Users} from "lucide-react"
  import Image from 'next/image'
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/browser';
import { useUser } from '@/lib/store/user';
import { createConversation } from '@/hooks/useConversations';
import { useRouter } from 'next/navigation';

const UsersList = ({list}: {list: User[]}) => {

    return (
		<>
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Users 					
					onClick={() => {
						document.getElementById("trigger-users-list")?.click();
					}}/>
			</DropdownMenuTrigger>
			{/* <DropdownMenuContent>
				<DropdownMenuLabel>Action</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						document.getElementById("trigger-edit")?.click();
					}}
				>
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						document.getElementById("trigger-delete")?.click();
					}}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent> */}
		</DropdownMenu>

		<ListOfUsers list={list} key={Math.random()*44444}/>
		</>
	);
}

export const ListOfUsers = ({list}: {list: User[]}) => {
	const router = useRouter()
	const currentUser = useUser((state) => state.user);

	const handler = (user: User) => {
		createConversation(currentUser?.id!, user.id)
		document.getElementById("trigger-users-list")?.click();
		router.refresh()
	}
		return (
			<Dialog>
				<DialogTrigger asChild>
					<button id="trigger-users-list"></button>
				</DialogTrigger>
				<DialogContent className="w-full">
					<DialogHeader>
						<DialogTitle>List of users </DialogTitle>
					</DialogHeader>
					
					{list.map((user) => (
									<div className='flex gap-2 items-center w-full p-2 px-6 border-b-2 border-t-2'>
									{/* @ts-ignore */}
									<Image src={user.avatar_url} alt="Profile" className="rounded-full w-10 h-10 mr-2" width={40} height={40} />
									<div className='cursor-pointer'>
									{/* @ts-ignore */}
										<a className="text-purple-500 hover:underline text-sm" onClick={() => handler(user)}>{user.full_name}</a>
									</div>
								</div>
					))}
					{/* <DialogFooter>
						<Button type="submit" onClick={handleEdit}>
							Save changes
						</Button>
					</DialogFooter> */}
				</DialogContent>
			</Dialog>
		);
	
}

// export const SingleUser = ({user}: {user:User}) => {
// 		const currentUser = useUser((state) => state.user);
		
// 	    return (
// 			<div className='flex gap-2 items-center w-full p-2 px-6 border-b-2 border-t-2'>
// 			{/* @ts-ignore */}
//             <Image src={user.avatar_url} alt="Profile" className="rounded-full w-10 h-10 mr-2" width={40} height={40} />
//             <div className='cursor-pointer'>
// 			{/* @ts-ignore */}
//                 <a className="text-purple-500 hover:underline text-sm" onClick={() => createConversation(currentUser?.id, user.id)}>{user.full_name}</a>
//             </div>
//         </div>
//     );
// }

export default UsersList