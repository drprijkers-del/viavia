"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  useEffect(() => {
    if (isScanning.current) return;
    isScanning.current = true;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    scanner
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().catch(console.error);
        },
        () => {
          // Scan error (ignore)
        }
      )
      .catch((err) => {
        console.error("Error starting scanner:", err);
        alert("Kan camera niet openen. Geef toestemming voor camera toegang.");
        onClose();
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch(console.error);
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal animate-scale-in">
        <h2 className="text-xl font-semibold text-white mb-2 text-center">
          Scan QR Code
        </h2>
        <p className="text-secondary mb-6 text-sm text-center">
          Richt de camera op een QR code
        </p>

        <div id="qr-reader" className="rounded-xl overflow-hidden mb-6"></div>

        <button
          onClick={onClose}
          className="btn btn-secondary w-full"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
