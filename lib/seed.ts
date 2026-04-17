import dbConnect from "./dbConnect";
import Client from "../models/Client";
import Quotation from "../models/Quotation";
import Invoice from "../models/Invoice";
import Party from "../models/Party";
import ServiceCatalogItem from "../models/ServiceCatalogItem";
import Task from "../models/Task";
import ActivityLog from "../models/ActivityLog";
import SuggestedPackage from "../models/SuggestedPackage";
import {
  initialClients,
  initialParties,
  initialServiceCatalog,
  initialTasks,
  initialSuggestedPackages,
  initialQuotations,
  initialInvoices,
  initialActivityLogs
} from "../data/mock-data";

export async function seedDatabase() {
  await dbConnect();

  // Clear existing data
  await Promise.all([
    Client.deleteMany({}),
    Quotation.deleteMany({}),
    Invoice.deleteMany({}),
    Party.deleteMany({}),
    ServiceCatalogItem.deleteMany({}),
    Task.deleteMany({}),
    ActivityLog.deleteMany({}),
    SuggestedPackage.deleteMany({}),
  ]);

  console.log("Cleared existing database data.");

  // Seed Parties first (to get IDs)
  const partiesMap: Record<string, any> = {};
  for (const p of initialParties) {
    const { id, ...data } = p as any;
    const doc = await Party.create(data);
    partiesMap[id] = doc._id;
  }

  // Seed Clients
  const clientsMap: Record<string, any> = {};
  for (const c of initialClients) {
    const { id, ...data } = c as any;
    const doc = await Client.create(data);
    clientsMap[id] = doc._id;
  }

  // Seed Service Catalog
  const servicesMap: Record<string, any> = {};
  for (const s of initialServiceCatalog) {
    const { id, ...data } = s as any;
    const doc = await ServiceCatalogItem.create(data);
    servicesMap[id] = doc._id;
  }

  // Seed Tasks
  for (const t of initialTasks) {
    const { id, ...data } = t as any;
    await Task.create(data);
  }

  // Seed Suggested Packages
  for (const s of initialSuggestedPackages) {
    const { id, ...data } = s as any;
    await SuggestedPackage.create(data);
  }

  // Seed Quotations
  const quotationsMap: Record<string, any> = {};
  for (const q of initialQuotations) {
    const { id, clientId, partyId, ...data } = q as any;
    const doc = await Quotation.create({
      ...data,
      clientId: clientsMap[clientId],
      partyId: partyId ? partiesMap[partyId] : undefined
    });
    quotationsMap[id] = doc._id;
  }

  // Seed Invoices
  for (const i of initialInvoices) {
    const { id, clientId, quotationId, partyId, ...data } = i as any;
    await Invoice.create({
      ...data,
      clientId: clientsMap[clientId],
      quotationId: quotationId ? quotationsMap[quotationId] : undefined,
      partyId: partyId ? partiesMap[partyId] : undefined
    });
  }

  // Seed Activity Logs
  for (const l of initialActivityLogs) {
    const { id, clientId, entityId, ...data } = l as any;
    // Map entityId appropriately if needed, but for logs we can just use the old IDs or try to map
    // For simplicity in seeding, we'll try to map if it exists in our maps
    const mappedEntityId = quotationsMap[entityId] || entityId; // Fallback to old ID if not found
    await ActivityLog.create({
      ...data,
      clientId: clientsMap[clientId],
      entityId: mappedEntityId
    });
  }

  console.log("Database seeded successfully!");
}
