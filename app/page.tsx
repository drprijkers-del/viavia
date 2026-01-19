"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { listOpdrachten, ListOpdrachtQuery } from "@/app/actions/queries";
import OpdrachtenList from "@/app/components/OpdrachtenList";

export default function HomePage() {
  const [filter, setFilter] = useState<ListOpdrachtQuery>({
    status: "OPEN",
    sort: "recent",
  });
  const [searchInput, setSearchInput] = useState("");
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = useCallback(
    async (newFilter: ListOpdrachtQuery) => {
      setLoading(true);
      const result = await listOpdrachten(newFilter);
      setOpdrachten(result);
      setFilter(newFilter);
      setLoading(false);
    },
    []
  );

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchInput(value);
      setLoading(true);
      const result = await listOpdrachten({
        ...filter,
        search: value || undefined,
      });
      setOpdrachten(result);
      setLoading(false);
    },
    [filter]
  );

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await listOpdrachten(filter);
      setOpdrachten(result);
      setLoading(false);
    };
    loadData();
  }, [filter]);

  return (
    <div className="container-main">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📋 ViaVia Opdrachten</h1>
        <p className="text-gray-600 text-sm">
          Freelance opdrachten uit je WhatsApp groep op één plek
        </p>
      </div>

      {/* CTA */}
      <div className="mb-6">
        <Link href="/opdracht/nieuw">
          <button className="btn btn-primary w-full text-lg py-3">
            + Nieuwe opdracht plaatsen
          </button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Zoeken op titel of skill..."
          className="input w-full"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleFilterChange({ ...filter, status: "OPEN" })}
            className={`btn ${
              filter.status === "OPEN" ? "btn-primary" : "btn-outline"
            }`}
          >
            Openstaand
          </button>
          <button
            onClick={() =>
              handleFilterChange({ ...filter, status: "INGEVULD" })
            }
            className={`btn ${
              filter.status === "INGEVULD" ? "btn-primary" : "btn-outline"
            }`}
          >
            Ingevuld
          </button>

          {/* Locatie filters */}
          <button
            onClick={() => handleFilterChange({ ...filter, locatie: "Remote" })}
            className={`btn ${
              filter.locatie === "Remote" ? "btn-primary" : "btn-outline"
            }`}
          >
            🌐 Remote
          </button>
          <button
            onClick={() =>
              handleFilterChange({ ...filter, locatie: undefined })
            }
            className={`btn ${
              !filter.locatie ? "btn-primary" : "btn-outline"
            }`}
          >
            Alles
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Laden...
        </div>
      ) : (
        <OpdrachtenList opdrachten={opdrachten} />
      )}
    </div>
  );
}

  return (
    <div className="container-main">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📋 ViaVia Opdrachten</h1>
        <p className="text-gray-600 text-sm">
          Freelance opdrachten uit je WhatsApp groep op één plek
        </p>
      </div>

      {/* CTA */}
      <div className="mb-6">
        <Link href="/opdracht/nieuw">
          <button className="btn btn-primary w-full text-lg py-3">
            + Nieuwe opdracht plaatsen
          </button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Zoeken op titel of skill..."
          className="input w-full"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleFilterChange({ ...filter, status: "OPEN" })}
            className={`btn ${
              filter.status === "OPEN" ? "btn-primary" : "btn-outline"
            }`}
          >
            Openstaand
          </button>
          <button
            onClick={() =>
              handleFilterChange({ ...filter, status: "INGEVULD" })
            }
            className={`btn ${
              filter.status === "INGEVULD" ? "btn-primary" : "btn-outline"
            }`}
          >
            Ingevuld
          </button>

          {/* Locatie filters */}
          <button
            onClick={() => handleFilterChange({ ...filter, locatie: "Remote" })}
            className={`btn ${
              filter.locatie === "Remote" ? "btn-primary" : "btn-outline"
            }`}
          >
            🌐 Remote
          </button>
          <button
            onClick={() =>
              handleFilterChange({ ...filter, locatie: undefined })
            }
            className={`btn ${
              !filter.locatie ? "btn-primary" : "btn-outline"
            }`}
          >
            Alles
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Laden...
        </div>
      ) : (
        <OpdrachtenList opdrachten={opdrachten} />
      )}
    </div>
  );
}
