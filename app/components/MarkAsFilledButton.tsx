"use client";

import { useSearchParams } from "next/navigation";
import { updateOpdracht } from "@/app/actions/opdracht";
import { useState } from "react";

export default function MarkAsFilledButton({
	opdrachtId
}: {
	opdrachtId: string;
}) {
	const params = useSearchParams();
	const token = params.get("token");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	if (!token) {
		return null; // Don't show button if no token
	}

	async function handleMarkFilled() {
		if (!token) return;
		setLoading(true);
		const result = await updateOpdracht(opdrachtId, token, {
			status: "INGEVULD"
		});
		if (result.success) {
			setMessage("✅ Opdracht gemarkeerd als ingevuld!");
		} else {
			setMessage(`❌ ${result.error}`);
		}
		setLoading(false);
	}

	return (
		<div className="mt-4 pt-4 border-t border-gray-200">
			{message && (
				<div className="mb-3 p-2 bg-blue-50 text-blue-900 rounded text-sm">
					{message}
				</div>
			)}
			<button
				onClick={handleMarkFilled}
				disabled={loading}
				className="btn btn-secondary w-full">
				{loading
					? "Bijwerken..."
					: "✅ Markeer als ingevuld"}
			</button>
			<p className="text-xs text-gray-500 mt-2">
				(alleen zichtbaar voor plaatser)
			</p>
		</div>
	);
}
