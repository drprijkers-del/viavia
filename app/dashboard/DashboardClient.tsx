"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

type Group = {
  id: string;
  name: string | null;
  slug: string;
  _count: {
    jobShares: number;
    members: number;
  };
};

type GroupMembership = {
  group: Group;
  role: string;
};

type Job = {
  id: string;
  title: string;
  company: string;
  rate: number;
  locationType: string;
  hoursPerWeek: number | null;
  createdById: string;
  shares: {
    group: {
      name: string | null;
      slug: string;
    };
    groupId: string;
  }[];
};

type DashboardClientProps = {
  groups: GroupMembership[];
  jobs: Job[];
  userEmail: string;
  userId: string;
};

const STORAGE_KEY = "viavia-last-group";

export default function DashboardClient({ groups, jobs, userEmail, userId }: DashboardClientProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Initialize selected group from localStorage or first group
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && groups.some(g => g.group.id === stored)) {
      setSelectedGroupId(stored);
    } else if (groups.length > 0) {
      setSelectedGroupId(groups[0].group.id);
    }
  }, [groups]);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (selectedGroupId) {
      localStorage.setItem(STORAGE_KEY, selectedGroupId);
    }
  }, [selectedGroupId]);

  const selectedGroup = groups.find(g => g.group.id === selectedGroupId);

  // Filter jobs for selected group
  const filteredJobs = selectedGroupId
    ? jobs.filter(job => job.shares.some(s => s.groupId === selectedGroupId))
    : [];

  // Empty state: no groups (fallback, normally redirected server-side)
  if (groups.length === 0) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-main flex items-center justify-center">
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Nog geen groepen</h2>
            <p className="text-muted text-sm mb-6">Maak je eerste groep aan om opdrachten te delen.</p>
            <Link href="/dashboard/groups/new">
              <button className="btn btn-primary">
                + Maak je eerste groep
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* Desktop Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="mb-6">
          <ViaViaLogo size="sm" href="/dashboard" />
        </div>

        <div className="sidebar-group-list">
          {groups.map(({ group, role }) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`sidebar-group-tab ${selectedGroupId === group.id ? "active" : ""}`}
            >
              <div
                className="sidebar-group-avatar"
                style={{ background: `linear-gradient(135deg, var(--accent), #30B350)` }}
              >
                {group.name?.charAt(0).toUpperCase() || "V"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="sidebar-group-name">{group.name || "Naamloze groep"}</div>
                <div className="sidebar-group-meta">
                  {group._count.jobShares} {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
                  {role === "ADMIN" && <span className="text-accent ml-2">Admin</span>}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Link href="/dashboard/groups/new" className="block mb-3">
            <button className="btn btn-secondary w-full text-sm">
              + Nieuwe groep
            </button>
          </Link>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted truncate">{userEmail}</span>
            <Link href="/api/auth/signout" className="text-muted hover:text-white transition-colors">
              Uitloggen
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="flex-1">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <ViaViaLogo size="sm" href="/dashboard" />
            <Link href="/api/auth/signout" className="text-sm text-muted hover:text-white transition-colors">
              Uitloggen
            </Link>
          </div>

          {/* Mobile Group Tabs */}
          <div className="group-tabs-mobile">
            {groups.map(({ group }) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`group-tab ${selectedGroupId === group.id ? "active" : ""}`}
              >
                <div
                  className="group-tab-avatar"
                  style={{ background: `linear-gradient(135deg, var(--accent), #30B350)` }}
                >
                  {group.name?.charAt(0).toUpperCase() || "V"}
                </div>
                <span className="group-tab-name">{group.name || "Naamloze groep"}</span>
              </button>
            ))}
            <Link href="/dashboard/groups/new" className="group-tab">
              <span className="text-accent">+ Nieuw</span>
            </Link>
          </div>

          {/* Group Header */}
          {selectedGroup && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold">{selectedGroup.group.name || "Naamloze groep"}</h1>
                <p className="text-sm text-muted">
                  {selectedGroup.group._count.members} {selectedGroup.group._count.members === 1 ? "lid" : "leden"} · {filteredJobs.length} {filteredJobs.length === 1 ? "opdracht" : "opdrachten"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/g/${selectedGroup.group.slug}`}>
                  <button className="btn btn-secondary text-sm py-2">
                    Bekijk groep
                  </button>
                </Link>
                <Link href="/dashboard/jobs/new">
                  <button className="btn btn-primary text-sm py-2">
                    + Opdracht
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Job List */}
          {filteredJobs.length > 0 ? (
            <div className="dashboard-job-list">
              {filteredJobs.map((job) => {
                const isOwner = job.createdById === userId;
                const groupSlug = selectedGroup?.group.slug;
                return (
                  <Link key={job.id} href={`/g/${groupSlug}/j/${job.id}`}>
                    <div className="dashboard-job-card">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{job.title}</h3>
                          <p className="text-sm text-muted">{job.company}</p>
                        </div>
                        {isOwner && (
                          <span className="badge badge-open shrink-0">Jouw</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-accent font-semibold">€{job.rate}/uur</span>
                        <span className="text-muted">{job.locationType}</span>
                        {job.hoursPerWeek && (
                          <span className="text-muted">{job.hoursPerWeek} uur/week</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Nog geen opdrachten</h3>
              <p className="text-sm text-muted mb-4">Deel je eerste opdracht met deze groep.</p>
              <Link href="/dashboard/jobs/new">
                <button className="btn btn-primary">
                  + Nieuwe opdracht
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center text-xs text-tertiary">
          <p>Powered by DnZ Productions</p>
        </footer>
      </main>
    </div>
  );
}
