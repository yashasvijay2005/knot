import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const volunteerId = 'ea0b6b26-0b85-444e-b10d-b2a64c48ec31'; // Hardcoded for demo

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    scanner.render((text) => {
      scanner.clear();
      setScanResult(text);
      handleCheckIn(text);
    }, (err) => {
      // Ignore routine scan errors
    });

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, []);

  const handleCheckIn = (qrPayload: string) => {
    axios.post('http://localhost:5000/api/attendance/checkin', { qrPayload, volunteerId })
      .then(res => {
        alert("Check-in Successful!");
        setScanResult(null);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Check-in failed");
        setScanResult(null);
      });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Volunteer QR Check-in</h1>

      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4 font-bold text-center">{error}</div>}
        <div id="reader" className="w-full"></div>
        {scanResult && <p className="mt-4 text-center text-blue-600 font-bold">Processing Scan...</p>}
      </div>
    </div>
  );
}
