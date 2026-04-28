import * as dataService from "@/lib/data-service";
import TasksContent from "./tasks-content";

export default async function TasksPage() {
  const tasks = await dataService.getTasks().catch((error) => {
    console.error("Failed to load tasks:", error);
    return [];
  });

  return (
    <TasksContent 
      initialTasks={JSON.parse(JSON.stringify(tasks))} 
    />
  );
}
