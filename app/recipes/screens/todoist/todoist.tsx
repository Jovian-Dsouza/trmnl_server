import React from "react";
import { PreSatori } from "@/utils/pre-satori";
import { TodoistTask } from "./getData";

interface TodoistProps {
	tasks?: TodoistTask[];
	error?: string;
}

function PriorityIcon({ priority }: { priority: number }) {
	if (priority === 4) {
		return <div className="w-[14px] h-[14px] bg-black shrink-0" />;
	}
	if (priority === 3) {
		return (
			<div
				className="w-[14px] h-[14px] border-2 border-black shrink-0"
				style={{ borderRadius: 2 }}
			/>
		);
	}
	if (priority === 2) {
		return (
			<div
				className="w-[14px] h-[14px] border border-black shrink-0"
				style={{ borderRadius: 2 }}
			/>
		);
	}
	return <div className="w-[14px] h-[14px] shrink-0" />;
}

export default function Todoist({ tasks = [], error }: TodoistProps) {
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<PreSatori>
			{(transform) => (
				<>
					{transform(
						<div className="flex flex-col w-[800px] h-[480px] bg-white text-black">
							{/* Header - solid background to avoid dither/text glitches */}
							<div className="flex-none px-6 py-4 border-b-2 border-black flex justify-between items-center bg-white shrink-0">
								<h1 className="text-[40px] m-0 leading-none font-bold shrink-0">
									Todoist
								</h1>
								<div className="text-[32px] leading-none font-bold shrink-0">
									{currentDate}
								</div>
							</div>

							{/* Content */}
							<div
								className="flex-1 overflow-hidden px-8 py-6 flex flex-col"
								style={{ gap: "24px" }}
							>
								{error ? (
									<div className="flex-1 flex items-center justify-center font-bold text-[36px] text-center px-8">
										Error: {error}
									</div>
								) : tasks && tasks.length > 0 ? (
									<div
										className="flex flex-col flex-1 min-h-0 overflow-hidden"
										style={{ gap: "20px" }}
									>
										{tasks.map((task, idx) => (
											<div
												key={task.id || idx}
												className="flex items-center shrink-0"
												style={{ gap: "18px" }}
											>
												<div className="w-[36px] h-[36px] border-2 border-black shrink-0" />
												<PriorityIcon priority={task.priority} />
												<div className="text-[48px] leading-tight flex-1 min-w-0 overflow-hidden font-bold">
													{task.content}
												</div>
											</div>
										))}
									</div>
								) : (
									<div
										className="flex-1 flex flex-col items-center justify-center border-2 border-black rounded-lg"
										style={{ gap: "24px", padding: "48px" }}
									>
										<div className="text-[64px] leading-none font-bold">
											All Done!
										</div>
										<div className="text-[40px] text-center px-8 leading-tight">
											No tasks left for today. Enjoy your free time.
										</div>
									</div>
								)}
							</div>
						</div>,
					)}
				</>
			)}
		</PreSatori>
	);
}
