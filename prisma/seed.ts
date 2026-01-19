import { db } from "@/lib/db";
import { generateEditToken, stringifyTags } from "@/lib/utils";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.reactie.deleteMany({});
  await db.opdracht.deleteMany({});

  // Create sample opdrachten
  const opdracht1 = await db.opdracht.create({
    data: {
      titel: "React & TypeScript Expert",
      omschrijving:
        "Zoeken naar een ervaren React developer voor een e-commerce platform. Minimaal 3 jaar ervaring met TypeScript. Werken aan scalable componenten, state management, en performance optimization.",
      locatie: "Remote",
      plaats: null,
      hybride_dagen_per_week: null,
      uurtarief_min: 5500, // €55
      uurtarief_max: 7500, // €75
      valuta: "EUR",
      startdatum: "ASAP",
      duur: "3-6 maanden",
      inzet: "30 uur/week",
      tags: stringifyTags(["react", "typescript", "frontend"]),
      plaatser_naam: "Jan de Vries",
      plaatser_whatsapp: "+31612345678",
      status: "OPEN",
      edit_token: generateEditToken(),
    },
  });

  const opdracht2 = await db.opdracht.create({
    data: {
      titel: "Kubernetes DevOps Setup",
      omschrijving:
        "Hulp nodig bij het opzetten van Kubernetes cluster en CI/CD pipeline. Docker, Helm charts, monitoring setup. On-site voor initial setup, daarna hybrid mogelijk.",
      locatie: "Hybride",
      plaats: "Amsterdam",
      hybride_dagen_per_week: 2,
      uurtarief_min: 7000, // €70
      uurtarief_max: 9000, // €90
      valuta: "EUR",
      startdatum: "2026-02-01",
      duur: "2 maanden",
      inzet: "40 uur/week",
      tags: stringifyTags(["kubernetes", "devops", "docker"]),
      plaatser_naam: "Sarah Chen",
      plaatser_whatsapp: "+31687654321",
      status: "OPEN",
      edit_token: generateEditToken(),
    },
  });

  const opdracht3 = await db.opdracht.create({
    data: {
      titel: "Copy Writing voor SaaS landingpage",
      omschrijving:
        "We hebben een copywriter nodig voor onze SaaS product. Schreef jij graag overtuigende sales copy en calls-to-action? Dit is remote werk, je ontvangt wireframes en richtlijnen.",
      locatie: "Remote",
      plaats: null,
      hybride_dagen_per_week: null,
      uurtarief_min: 2500, // €25
      uurtarief_max: 4000, // €40
      valuta: "EUR",
      startdatum: "ASAP",
      duur: "1-2 weken",
      inzet: "10-15 uur",
      tags: stringifyTags(["copywriting", "saas", "marketing"]),
      plaatser_naam: "Marco Rossi",
      plaatser_whatsapp: "+31656789012",
      status: "OPEN",
      edit_token: generateEditToken(),
    },
  });

  const opdracht4 = await db.opdracht.create({
    data: {
      titel: "Data Science Model Development",
      omschrijving:
        "Predictive model development voor inventory forecasting. Machine learning ervaring (Python, scikit-learn, TensorFlow). Accès tot onze dataset en cloud infrastructure.",
      locatie: "OnSite",
      plaats: "Rotterdam",
      hybride_dagen_per_week: null,
      uurtarief_min: 8000, // €80
      uurtarief_max: 10000, // €100
      valuta: "EUR",
      startdatum: "2026-03-01",
      duur: "4 maanden",
      inzet: "35 uur/week",
      tags: stringifyTags(["python", "machinelearning", "datascience"]),
      plaatser_naam: "Dr. Lisa Mueller",
      plaatser_whatsapp: "+31645123456",
      status: "OPEN",
      edit_token: generateEditToken(),
    },
  });

  // Add some reactions
  await db.reactie.createMany({
    data: [
      {
        opdracht_id: opdracht1.id,
        naam: "Thomas",
        bericht: "Ik ben geïnteresseerd! Heb 5 jaar React ervaring.",
        whatsapp_nummer: "+31698765432",
      },
      {
        opdracht_id: opdracht1.id,
        naam: "Femke",
        bericht: "TypeScript expert hier. Kunnen we snel een call plannen?",
        whatsapp_nummer: "+31655555555",
      },
      {
        opdracht_id: opdracht2.id,
        naam: "Sven",
        bericht: "Kubernetes pro, Amsterdam-based. Geïnteresseerd!",
        whatsapp_nummer: "+31699999999",
      },
      {
        opdracht_id: opdracht3.id,
        naam: "Anke",
        bericht: "SaaS copy is mijn specialty. Let's talk!",
        whatsapp_nummer: null,
      },
    ],
  });

  console.log("✅ Seed complete!");
  console.log(`   - ${4} opdrachten created`);
  console.log(`   - ${4} reactions created`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
