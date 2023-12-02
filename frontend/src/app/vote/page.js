import React from "react";
import FinalistCard from "./components/FinalistCard";

export default function page() {
	return (
		<div className="flex items-center justify-center mt-36 mb-24">
			<div className="flex flex-col gap-5 items-center">
				<h4 className="text-lg">The Finalists Are...</h4>
				<div className="flex flex-wrap w-full justify-center mx-auto px-6 gap-4 sm:px-0">
					<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
					<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
					<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
					<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
					<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
				</div>
			</div>
		</div>
	);
}
