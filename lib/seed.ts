import mongoose from "mongoose";
import dbConnect from "./dbConnect";
import Client from "../models/Client";
import Quotation from "../models/Quotation";
import Invoice from "../models/Invoice";
import Party from "../models/Party";
import ServiceCatalogItem from "../models/ServiceCatalogItem";
import Task from "../models/Task";
import ActivityLog from "../models/ActivityLog";
import SuggestedPackage from "../models/SuggestedPackage";
import ClientInteraction from "../models/ClientInteraction";

const clients = [
  {
    name: "Saksham Sabadra",
    companyName: "Kanzode Advisory",
    email: "saksham@kanzode.co",
    whatsappNumber: "919000000001",
    clientType: "professional_firm",
    gstNumber: "27AAACK1234A1Z1",
    address: "Mumbai, Maharashtra",
    standardTerms: ["Payment due within 7 days", "All disputes subject to Mumbai jurisdiction"],
  },
  {
    name: "Rudra Singh",
    companyName: "Next Ignition",
    email: "rudra@nextignition.com",
    whatsappNumber: "919000000002",
    clientType: "startup",
    address: "Bangalore, Karnataka",
  }
];

const catalogItems = [
  {
    title: "GST Registration",
    category: "Compliance",
    description: "End-to-end GST registration for new businesses.",
    basePrice: 2500,
    unit: "application"
  },
  {
    title: "Monthly Bookkeeping",
    category: "Accounting",
    description: "Monthly maintenance of accounts and financial statements.",
    basePrice: 5000,
    unit: "month"
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await dbConnect();

    console.log("Cleaning up existing data...");
    await Client.deleteMany({});
    await Quotation.deleteMany({});
    await Invoice.deleteMany({});
    await Party.deleteMany({});
    await ServiceCatalogItem.deleteMany({});
    await Task.deleteMany({});
    await ActivityLog.deleteMany({});
    await SuggestedPackage.deleteMany({});
    await ClientInteraction.deleteMany({});

    console.log("Seeding clients...");
    const createdClients = await Client.insertMany(clients);

    console.log("Seeding service catalog...");
    await ServiceCatalogItem.insertMany(catalogItems);

    console.log("Seeding activity logs...");
    await ActivityLog.create({
      clientId: createdClients[0]._id,
      action: "generated",
      message: "Initial account setup completed.",
      entityType: "quotation",
      entityId: new mongoose.Types.ObjectId()
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
