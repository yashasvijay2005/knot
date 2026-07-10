import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const userId = 'ea0b6b26-0b85-444e-b10d-b2a64c48ec31'; // Hardcoded for demo

  useEffect(() => {
    axios.get(`http://localhost:5000/api/certificates/user/${userId}`).then(res => {
      setCertificates(res.data.certificates);
    });
  }, []);

  const verifyCertificate = (hash: string) => {
    axios.get(`http://localhost:5000/api/certificates/verify/${hash}`)
      .then(res => alert("Certificate is Valid! Issued to " + res.data.certificate.user.firstName))
      .catch(() => alert("Invalid Certificate!"));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Certificates</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.length === 0 ? (
          <p className="text-gray-500 col-span-2">No certificates issued yet.</p>
        ) : (
          certificates.map((cert: any) => (
            <div key={cert.id} className="border p-6 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-white flex flex-col items-center text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-xl font-bold mb-2">{cert.type} Certificate</h2>
              <p className="text-gray-700 mb-4">{cert.event?.title}</p>
              <p className="text-xs text-gray-500 mb-6 font-mono break-all">{cert.hash}</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => verifyCertificate(cert.hash)}
                  className="flex-1 bg-gray-800 text-white py-2 rounded font-bold"
                >
                  Verify
                </button>
                <button
                  onClick={() => alert('Download not implemented')}
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-bold"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
