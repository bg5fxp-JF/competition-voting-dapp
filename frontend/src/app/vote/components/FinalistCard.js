"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FinalistCard({ img }) {
	return (
		<div className="relative rounded  shadow-md overflow-hidden">
			<Image
				src={img}
				alt=""
				width={300}
				height={500}
				className="object-cover "
			/>
			<motion.div
				variants={{
					intial: { y: -500 },
					show: { y: 0 },
				}}
				whileHover="inital"
				className="absolute flex justify-center items-center min-h-[50%]  bottom-0 w-full bg-white/50"
			>
				<p className="text-6xl font-bold">Vote</p>
			</motion.div>
		</div>
	);
}
