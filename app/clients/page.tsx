import * as dataService from "@/lib/data-service";
import ClientsContent from "./clients-content";

export default async function ClientsPage() {
  const clients = await dataService.getClients().catch((error) => {
    console.error("Failed to load clients:", error);
    return [];
  });

  const parties = await dataService.getParties().catch((error) => {
    console.error("Failed to load parties:", error);
    return [];
  });

  return (
    <ClientsContent
      initialClients={JSON.parse(JSON.stringify(clients))}
      initialParties={JSON.parse(JSON.stringify(parties))}
    />
  );
}
