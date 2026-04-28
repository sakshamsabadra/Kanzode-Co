import * as dataService from "@/lib/data-service";
import ServicesContent from "./services-content";

export default async function ServicesPage() {
  const services = await dataService.getServiceCatalog().catch((error) => {
    console.error("Failed to load services:", error);
    return [];
  });

  return (
    <ServicesContent 
      initialServices={JSON.parse(JSON.stringify(services))} 
    />
  );
}
