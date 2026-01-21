"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

type Member = {
  id: string;
  role: string;
  userId: string;
  user: {
    name: string | null;
    email: string | null;
  };
};

type Job = {
  id: string;
  title: string;
  company: string;
  rate: number;
  locationType: string;
  hoursPerWeek: number | null;
  createdById: string;
  shareId: string;
};

type GroupManageClientProps = {
  group: {
    id: string;
    name: string | null;
    slug: string;
    inviteUrl: string;
  };
  members: Member[];
  jobs: Job[];
  isAdmin: boolean;
  currentUserId: string;
};

export default function GroupManageClient({
  group,
  members,
  jobs,
  isAdmin,
  currentUserId,
}: GroupManageClientProps) {
  const router = useRouter();
  const [jobList, setJobList] = useState(jobs);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    await navigator.clipboard.writeText(group.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function deleteJob(jobId: string, shareId: string) {
    if (!confirm("Weet je zeker dat je deze opdracht wilt verwijderen uit deze groep?")) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}/shares/${shareId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setJobList(prev => prev.filter(j => j.id !== jobId));
      } else {
        alert("Kon opdracht niet verwijderen");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Er is iets misgegaan");
    } finally {
      setDeletingJobId(null);
    }
  }

  async function deleteGroup() {
    setDeletingGroup(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Kon groep niet verwijderen");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Er is iets misgegaan");
    } finally {
      setDeletingGroup(false);
      setShowDeleteGroupModal(false);
    }
  }

  return (
    <div className="app-frame">
      {/* Delete Group Modal */}
      {showDeleteGroupModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <h2 className="text-xl font-semibold text-white mb-2">Groep verwijderen</h2>
            <p className="text-muted mb-2">
              Weet je zeker dat je <span className="text-white font-semibold">{group.name}</span> wilt verwijderen?
            </p>
            <p className="text-[#FF453A] text-sm mb-6">
              Alle opdrachten worden uit deze groep verwijderd.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteGroupModal(false)}
                className="btn btn-secondary flex-1"
                disabled={deletingGroup}
              >
                Annuleren
              </button>
              <button
                onClick={deleteGroup}
                disabled={deletingGroup}
                className="flex-1 bg-[#FF453A] hover:bg-[#FF3B30] text-white font-medium py-3 rounded-full transition-all"
              >
                {deletingGroup ? "Bezig..." : "Verwijderen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ViaViaLogo size="sm" />
        <Link href="/dashboard">
          <button className="text-sm text-muted hover:text-white transition-colors">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Group Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{group.name || "Naamloze groep"}</h1>
        <p className="text-xs text-tertiary">
          {jobList.length} {jobList.length === 1 ? "opdracht" : "opdrachten"} · {members.length} {members.length === 1 ? "lid" : "leden"}
          {isAdmin && <span className="text-accent"> · Admin</span>}
        </p>
      </div>

      {/* Invite Link */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Uitnodigingslink</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={group.inviteUrl}
            readOnly
            className="input flex-1 text-sm"
          />
          <button
            onClick={copyInviteLink}
            className="btn btn-secondary text-sm"
          >
            {copied ? "Gekopieerd!" : "Kopieer"}
          </button>
        </div>
        <p className="text-xs text-tertiary mt-3">
          Deel deze link zodat anderen kunnen toetreden
        </p>
      </div>

      {/* Members */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Leden ({members.length})</h2>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="card py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.user.name || member.user.email}</p>
                  {member.role === "ADMIN" && (
                    <p className="text-xs text-accent">Admin</p>
                  )}
                </div>
                {member.userId === currentUserId && (
                  <span className="text-xs text-tertiary">Jij</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Opdrachten ({jobList.length})</h2>
          <Link href="/dashboard/jobs/new">
            <button className="btn btn-primary text-sm py-2">+ Nieuw</button>
          </Link>
        </div>
        {jobList.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-muted mb-4">Nog geen opdrachten in deze groep</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobList.map((job) => {
              const canDelete = isAdmin || job.createdById === currentUserId;
              return (
                <div key={job.id} className="card">
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <h3 className="font-semibold mb-1">{job.title}</h3>
                    <p className="text-sm text-muted mb-2">{job.company}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-accent font-semibold">€{job.rate}/uur</span>
                      <span className="text-tertiary">•</span>
                      <span className="text-tertiary">{job.locationType}</span>
                      {job.hoursPerWeek && (
                        <>
                          <span className="text-tertiary">•</span>
                          <span className="text-tertiary">{job.hoursPerWeek}u/w</span>
                        </>
                      )}
                    </div>
                  </Link>
                  {canDelete && (
                    <div className="mt-3 pt-3 border-t border-border flex justify-end">
                      <button
                        onClick={() => deleteJob(job.id, job.shareId)}
                        disabled={deletingJobId === job.id}
                        className="text-sm text-[#FF453A] hover:text-[#FF3B30] transition-colors"
                      >
                        {deletingJobId === job.id ? "Bezig..." : "Verwijderen"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="pt-6 border-t border-border">
          <h2 className="text-lg font-semibold mb-4 text-[#FF453A]">Danger Zone</h2>
          <button
            onClick={() => setShowDeleteGroupModal(true)}
            className="btn w-full bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/20"
          >
            Groep verwijderen
          </button>
        </div>
      )}
    </div>
  );
}
