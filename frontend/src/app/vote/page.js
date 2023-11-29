import React from "react";
import FinalistCard from "./components/FinalistCard";

export default function page() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col gap-5 items-center">
				<h4 className="text-lg">The Finalists Are...</h4>
				<FinalistCard img="https://avatars.githubusercontent.com/u/52407573?v=4" />
			</div>
		</div>
	);
}
