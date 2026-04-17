import * as dataService from "@/lib/data-service";
import ClientsContent from "./clients-content";

export default async function ClientsPage() {
  const clients = await dataService.getClients();
  const parties = await dataService.getParties();

  return (
    <ClientsContent 
      initialClients={JSON.parse(JSON.stringify(clients))} 
      initialParties={JSON.parse(JSON.stringify(parties))} 
    />
  );
}
