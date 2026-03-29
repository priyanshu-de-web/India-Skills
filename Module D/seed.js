require("dotenv").config();
const mongoose = require("mongoose");
const Region = require("./model/Region");
const Attraction = require("./model/Attraction");
const InfoItem = require("./model/InfoItem");

const regions = [
  { id: 1, key: "north", name: "North", color: "#22c55e", summary: "Urban energy & nature: Taipei 101, night markets, Jiufen's old streets, Yehliu's unique geology." },
  { id: 2, key: "central", name: "Central", color: "#06b6d4", summary: "Misty mountains & lakes: Sun Moon Lake cycling, Taichung art, Alishan sunrise forests." },
  { id: 3, key: "south", name: "South", color: "#f97316", summary: "Historic flavors & beaches: Tainan temples, Kaohsiung harbor art, Kenting's tropical coast." },
  { id: 4, key: "east", name: "East", color: "#8b5cf6", summary: "Wild coasts & gorges: Taroko marble cliffs, Hualien ocean vistas, Taitung hot air vibes." },
];

const attractionsData = [
  { id: 1, region_id: 1, name: "Taipei 101", description: "Skyscraper views & luxury mall" },
  { id: 2, region_id: 1, name: "Jiufen", description: "Hillside lantern alleys & tea houses" },
  { id: 3, region_id: 1, name: "Yehliu Geopark", description: "Otherworldly sea-eroded rock formations" },
  { id: 4, region_id: 2, name: "Sun Moon Lake", description: "Scenic cycling & boat tours" },
  { id: 5, region_id: 2, name: "Taichung", description: "Museums, parks & creative parks" },
  { id: 6, region_id: 2, name: "Alishan", description: "Tea terraces & sunrise sea of clouds" },
  { id: 7, region_id: 3, name: "Tainan", description: "Taiwan's oldest city & street eats" },
  { id: 8, region_id: 3, name: "Kaohsiung", description: "Pier-2 Art Center & harbor views" },
  { id: 9, region_id: 3, name: "Kenting", description: "White-sand beaches & water sports" },
  { id: 10, region_id: 4, name: "Taroko Gorge", description: "Marble canyons & sky-high trails" },
  { id: 11, region_id: 4, name: "Hualien", description: "Pacific coastlines & rice paddies" },
  { id: 12, region_id: 4, name: "Taitung", description: "Hot springs & laid-back festivals" },
];

const infoItems = [
  { id: 1, category: "transportation", icon: "#i-train", title: "High-Speed Rail (HSR)", body: "Zip between major cities from Taipei to Kaohsiung in ~1.5\u20132 hours. Reserve seats online or at kiosks." },
  { id: 2, category: "transportation", icon: "#i-landmark", title: "TRA & Local Lines", body: "Coastal and mountain routes cover smaller towns. EasyCard works on most services." },
  { id: 3, category: "transportation", icon: "#i-pin", title: "Metro & Buses", body: "Taipei/Kaohsiung MRT are bilingual and spotless. Bus networks are extensive and affordable." },
  { id: 4, category: "accommodation", icon: "#i-hotel", title: "Hotels & Hostels", body: "From luxury towers to design hostels\u2014book early for weekends & festivals." },
  { id: 5, category: "accommodation", icon: "#i-landmark", title: "Minshuku (B&B)", body: "Warm, family-run stays\u2014especially common on the East Coast." },
  { id: 6, category: "accommodation", icon: "#i-pin", title: "Hot Spring Resorts", body: "Soak in Beitou, Jiaoxi or mountainside retreats across the island." },
  { id: 7, category: "shopping", icon: "#i-bag", title: "Night Markets", body: "Try snacks as you browse souvenirs\u2014remember to bring small bills." },
  { id: 8, category: "shopping", icon: "#i-utensils", title: "Gourmet Gifts", body: "Pineapple cakes, nougat, oolong teas\u2014pack for customs." },
  { id: 9, category: "shopping", icon: "#i-globe", title: "Tax Refund", body: "Foreign visitors can claim VAT refunds\u2014check store windows for the logo." },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    // Clear existing data
    await Region.deleteMany({});
    await Attraction.deleteMany({});
    await InfoItem.deleteMany({});

    // Seed regions
    const createdRegions = await Region.insertMany(regions);
    console.log("Regions seeded:", createdRegions.length);

    // Map region numeric id to MongoDB _id
    const regionMap = {};
    createdRegions.forEach((r) => {
      regionMap[r.id] = r._id;
    });

    // Seed attractions with proper region_id references
    const attractions = attractionsData.map((a) => ({
      ...a,
      region_id: regionMap[a.region_id],
    }));
    const createdAttractions = await Attraction.insertMany(attractions);
    console.log("Attractions seeded:", createdAttractions.length);

    // Seed info items
    const createdInfoItems = await InfoItem.insertMany(infoItems);
    console.log("Info items seeded:", createdInfoItems.length);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.log("Seed Error:", error.message);
    process.exit(1);
  }
}

seed();
