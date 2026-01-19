interface Reactie {
  id: string;
  naam: string;
  bericht?: string | null;
  whatsapp_nummer?: string | null;
  created_at: Date;
}

export default function ReactieList({ reacties }: { reacties: Reactie[] }) {
  return (
    <div className="space-y-3">
      {reacties.map((reactie) => (
        <div key={reactie.id} className="card">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold">{reactie.naam}</h4>
            <span className="text-xs text-gray-500">
              {new Date(reactie.created_at).toLocaleDateString("nl-NL")}
            </span>
          </div>

          {reactie.bericht && (
            <p className="text-gray-700 mb-3">{reactie.bericht}</p>
          )}

          {reactie.whatsapp_nummer && (
            <a
              href={`https://wa.me/${reactie.whatsapp_nummer}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              💬 WhatsApp: {reactie.whatsapp_nummer}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
