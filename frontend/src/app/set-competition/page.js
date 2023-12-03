import FinalistInput from "./components/FinalistInput";
import JudgesInput from "./components/JudgesInput";
import WeightageInput from "./components/WeightageInput";

export default function page() {
	return (
		<div className="flex flex-col gap-7  justify-center mt-36 mb-24 px-6 sm:px-16 ">
			<div className="flex flex-col gap-7 justify-center sm:flex-row">
				<div className="flex flex-col gap-y-7">
					<h3 className="-mb-3">Select Judges</h3>
					<JudgesInput />

					<h3 className="-mb-3">Select Finalists</h3>
					<FinalistInput />
				</div>
				<div class="flex flex-col gap-y-7">
					<h3 className="-mb-3">Select Weightages</h3>
					<WeightageInput />
				</div>
			</div>
			<button className="mx-auto p-2 rounded border border-primaryColor dark:bg-primaryColor/70 shadow-md ">
				Start Voting
			</button>
			<button className="mx-auto p-2 rounded border border-primaryColor dark:bg-primaryColor/70 shadow-md ">
				End Voting
			</button>
		</div>
	);
}
