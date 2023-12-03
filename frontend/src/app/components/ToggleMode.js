"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function ToggleMode() {
	const { setTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed   bottom-10 right-6 p-5 rounded text-sm bg-primaryColor dark:bg-primaryColor/70 shadow-md transition-transform sm:right-16 sm:text-reg"
		>
			{isOpen ? (
				<div className="p-1">
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex  gap-x-3 "
					>
						<button
							onClick={() => {
								setTheme("light");
								setIsOpen(!isOpen);
							}}
							className="bg-secondaryColor dark:bg-primaryColor/20 p-2 rounded transition-all active:scale-125"
						>
							Light
						</button>
						<button
							onClick={() => {
								setTheme("dark");
								setIsOpen(!isOpen);
							}}
							className="bg-secondaryColor dark:bg-primaryColor/20 p-2 rounded transition-all active:scale-125"
						>
							Dark
						</button>
						<button
							onClick={() => {
								setTheme("system");
								setIsOpen(!isOpen);
							}}
							className="bg-secondaryColor dark:bg-primaryColor/20 p-2 rounded transition-all active:scale-125"
						>
							System
						</button>
					</motion.div>
				</div>
			) : (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
					>
						<SunIcon
							className="cursor-pointer rotate-0 scale-100 transition-all dark:hidden"
							onClick={() => {
								setIsOpen(!isOpen);
							}}
						/>
						<MoonIcon
							className=" cursor-pointer hidden transition-all dark:block dark:rotate-0 dark:scale-100"
							onClick={() => {
								setIsOpen(!isOpen);
							}}
						/>
					</motion.div>
				</AnimatePresence>
			)}
		</motion.div>
	);
}
