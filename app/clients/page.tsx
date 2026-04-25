import * as dataService from "@/lib/data-service";
import ClientsContent from "./clients-content";

export default async function ClientsPage() {
  let clients: any[] = [];
  let parties: any[] = [];

  try {
    clients = await dataService.getClients();
    parties = await dataService.getParties();
  } catch (error) {
    console.error("Failed to load clients/parties:", error);
  }

  return (
    <ClientsContent 
      initialClients={JSON.parse(JSON.stringify(clients))} 
      initialParties={JSON.parse(JSON.stringify(parties))} 
    />
  );
}
