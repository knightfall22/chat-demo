"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IMessage, useMessage } from "@/lib/store/messages";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/browser";
import { deleteMessage, updateMessage } from "@/hooks/useMessages";

export function DeleteAlert() {
	const actionMessage = useMessage((state) => state.actionMessage);
	const optimisticDeleteMessage = useMessage(
		(state) => state.optimisticDeleteMessage
	);
	const handleDeleteMessage = async () => {
		const supabase = createClient();
		optimisticDeleteMessage(actionMessage?.id!);

		const error  = await deleteMessage(actionMessage?.id!)

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Successfully delete a message");
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button id="trigger-delete"></button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteMessage}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function EditAlert() {
	const actionMessage = useMessage((state) => state.actionMessage);
	const optimisticUpdateMessage = useMessage(
		(state) => state.optimisticUpdateMessage
	);

	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleEdit = async () => {
		const supabase = createClient();
		const text = inputRef.current.value.trim();
		if (text) {
			optimisticUpdateMessage({
				...actionMessage,
				text,
				is_edit: true,
			} as IMessage);
			const error = await updateMessage(actionMessage?.id!, text)
			if (error) {
				toast.error(error.message);
			} else {
				toast.success("Update Successfully");
			}
			document.getElementById("trigger-edit")?.click();
		} else {
			document.getElementById("trigger-edit")?.click();
			document.getElementById("trigger-delete")?.click();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button id="trigger-edit"></button>
			</DialogTrigger>
			<DialogContent className="w-full">
				<DialogHeader>
					<DialogTitle>Edit Message</DialogTitle>
				</DialogHeader>
				<Input defaultValue={actionMessage?.text} ref={inputRef} />
				<DialogFooter>
					<Button type="submit" onClick={handleEdit}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}