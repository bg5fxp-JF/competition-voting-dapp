"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FinalistCard({ img }) {
	return (
		<div className=" group relative rounded  shadow-md overflow-hidden">
			<Image
				src={img}
				alt=""
				width={300}
				height={500}
				className="object-cover "
			/>
			<div className="absolute flex justify-center   items-center min-h-[50%] transition-all translate-y-full bottom-0 w-full bg-white/50 dark:bg-slate-950/50 cursor-pointer group-hover:-translate-y-[0.5]">
				<p className="text-6xl font-bold group-active:text-white">Vote</p>
			</div>
		</div>
	);
}
