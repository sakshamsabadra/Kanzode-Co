import * as dataService from "@/lib/data-service";
import TasksContent from "./tasks-content";

export default async function TasksPage() {
  let tasks: any[] = [];

  try {
    tasks = await dataService.getTasks();
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }

  return (
    <TasksContent 
      initialTasks={JSON.parse(JSON.stringify(tasks))} 
    />
  );
}
