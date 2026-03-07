import { TodoistApi } from "@doist/todoist-api-typescript";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

export interface TodoistTask {
	id: string;
	content: string;
	description: string;
	isCompleted: boolean;
	due: {
		string: string;
		date: string;
		isRecurring: boolean;
		datetime: string;
		timezone: string;
	} | null;
	priority: number;
	labels: string[];
}

interface TodoistData {
	tasks: TodoistTask[];
	error?: string;
}

async function getTodoistData(): Promise<TodoistData | null> {
	try {
		const apiKey = process.env.TODOIST_API_KEY;
		if (!apiKey) {
			console.error("TODOIST_API_KEY is not set in environment variables");
			return { tasks: [], error: "Missing API Key" };
		}

		const api = new TodoistApi(apiKey);
		const response = await api.getTasksByFilter({ query: "today" });
		const results = response.results ?? [];

		const tasks = results.slice(0, 3).map((t) => ({
			id: t.id,
			content: t.content,
			description: t.description ?? "",
			isCompleted: t.checked ?? false,
			due: t.due
				? {
						string: t.due.string,
						date: t.due.date,
						isRecurring: t.due.isRecurring ?? false,
						datetime: t.due.datetime ?? "",
						timezone: t.due.timezone ?? "",
					}
				: null,
			priority: t.priority ?? 1,
			labels: Array.isArray(t.labels) ? t.labels : [],
		}));

		return { tasks };
	} catch (error) {
		console.error("Error fetching Todoist data:", error);
		return null;
	}
}

async function fetchTodoistDataNoCache(): Promise<TodoistData> {
	const data = await getTodoistData();
	if (!data) {
		return { tasks: [], error: "Failed to load" };
	}
	return data;
}

const getCachedTodoistData = unstable_cache(
	async (): Promise<TodoistData> => {
		const data = await getTodoistData();
		if (!data) {
			throw new Error("Empty or invalid data - skip caching");
		}
		return data;
	},
	["todoist-data"],
	{
		tags: ["todoist", "productivity"],
		revalidate: 5,
	},
);

export default async function getData(): Promise<TodoistData> {
	try {
		return await getCachedTodoistData();
	} catch (error) {
		console.log("Todoist cache skipped or error:", error);
		return fetchTodoistDataNoCache();
	}
}
