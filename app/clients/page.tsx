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
    console.error("Error details:", JSON.stringify(error, null, 2));
  }

  try {
    return (
      <ClientsContent 
        initialClients={JSON.parse(JSON.stringify(clients))} 
        initialParties={JSON.parse(JSON.stringify(parties))} 
      />
    );
  } catch (error) {
    console.error("Failed to serialize data:", error);
    return (
      <ClientsContent 
        initialClients={[]} 
        initialParties={[]} 
      />
    );
  }
}
