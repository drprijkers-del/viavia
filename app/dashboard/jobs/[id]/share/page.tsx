"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default function ShareJobPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [jobRes, groupsRes] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
          fetch("/api/groups/my")
        ]);

        const jobData = await jobRes.json();
        const groupsData = await groupsRes.json();

        setJob(jobData.job);
        setGroups(groupsData.groups);
      } catch (error) {
        console.error("Error loading:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  function toggleGroup(groupId: string) {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  }

  async function handleShare() {
    if (selectedGroups.length === 0) {
      alert("Selecteer minimaal één groep");
      return;
    }

    setSharing(true);

    try {
      await fetch(`/api/jobs/${params.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupIds: selectedGroups })
      });

      const message = generateWhatsAppMessage();
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");

      router.push(`/dashboard/jobs/${params.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Kon opdracht niet delen");
    } finally {
      setSharing(false);
    }
  }

  function generateWhatsAppMessage(): string {
    if (!job) return "";

    const jobUrl = `${window.location.origin}/jobs/${job.id}`;

    return `💼 *${job.title}*
🏢 ${job.company}

${job.description.substring(0, 120)}${job.description.length > 120 ? "..." : ""}

💰 €${job.rate}/uur${job.hoursPerWeek ? ` • ${job.hoursPerWeek}u/w` : ""}
📍 ${job.locationType}${job.locationDetail ? ` (${job.locationDetail})` : ""}
${job.months ? `⏱ ${job.months} maanden` : ""}

🔗 Bekijk de opdracht:
${jobUrl}`;
  }

  async function copyMessage() {
    const message = generateWhatsAppMessage();
    await navigator.clipboard.writeText(message);
    alert("Bericht gekopieerd!");
  }

  if (loading) {
    return (
      <div className="app-frame flex items-center justify-center">
        <p className="text-muted">Laden...</p>
      </div>
    );
  }

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ViaViaLogo size="sm" />
        <Link href="/dashboard">
          <button className="text-sm text-muted hover:text-white transition-colors">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Deel in WhatsApp groepen</h1>
      <p className="text-muted mb-6">
        Selecteer in welke groepen je deze opdracht wilt delen
      </p>

      {groups.length === 0 ? (
        <div className="card text-center mb-6">
          <p className="text-muted mb-4">Je hebt nog geen groepen</p>
          <Link href="/dashboard/groups/new">
            <button className="btn btn-secondary text-sm">
              Maak een groep
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => toggleGroup(group.id)}
              className={`card w-full text-left transition-all ${
                selectedGroups.includes(group.id)
                  ? "border-accent ring-2 ring-accent"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-xs text-tertiary">
                    {group._count.jobShares} opdrachten
                  </p>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedGroups.includes(group.id)
                    ? "bg-accent border-accent"
                    : "border-tertiary"
                }`}>
                  {selectedGroups.includes(group.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleShare}
          disabled={sharing || selectedGroups.length === 0}
          className="btn btn-primary w-full py-4"
        >
          {sharing ? "Bezig..." : `Deel in WhatsApp (${selectedGroups.length})`}
        </button>

        <button
          onClick={copyMessage}
          className="btn btn-secondary w-full"
        >
          Kopieer bericht
        </button>
      </div>
    </div>
  );
}
