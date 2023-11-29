"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ToggleMode() {
	const { setTheme } = useTheme();

	return (
		<div className="absolute bottom-10 right-6 sm:right-16 sm:text-reg">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="p-5 rounded text-sm bg-primaryColor dark:bg-primaryColor/70 shadow-md ">
						<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:hidden" />
						<MoonIcon className="h-[1.2rem] w-[1.2rem] hidden transition-all dark:block dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
