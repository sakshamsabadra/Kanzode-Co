import * as dataService from "@/lib/data-service";
import TasksContent from "./tasks-content";

export default async function TasksPage() {
  const tasks = await dataService.getTasks();

  return (
    <TasksContent 
      initialTasks={JSON.parse(JSON.stringify(tasks))} 
    />
  );
}
