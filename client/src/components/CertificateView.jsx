import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowLeft, 
  ExternalLink,
  Calendar,
  Building,
  QrCode
} from 'lucide-react';

export const CertificateView = ({ certId, onBack }) => {
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await fetch(`/api/certificates/${certId}`);
        const data = await res.json();
        setLoading(false);

        if (!res.ok || !data.verified) {
          setError(data.message || 'Certificate verification failed.');
          return;
        }

        setCertData(data.certificate);
      } catch (err) {
        setLoading(false);
        setError('Network error verifying certificate.');
      }
    };

    if (certId) {
      fetchCert();
    } else {
      setLoading(false);
      setError('Certificate ID required.');
    }
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Verifying Certificate Authenticity...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Certificate Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'This certificate record could not be authenticated.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Print Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              AUTHENTIC RECORD
            </span>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>

        {/* Certificate Frame */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-slate-200 shadow-2xl text-left overflow-hidden">
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Award className="w-[500px] h-[500px] text-slate-950" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b-2 border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Skyrovix" className="h-10 w-auto" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  SKYROVIX TECHNOLOGIES
                </span>
                <span className="text-xs font-black text-sky-700">
                  ENGINEERING CREDENTIALS
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate ID</span>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                {certData.id}
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="py-10 text-center space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
                CERTIFICATE OF ACCOMPLISHMENT
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-slate-800 italic">
                This is to officially certify that
              </h1>
            </div>

            {/* Recipient Name */}
            <div className="py-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight underline decoration-sky-500 underline-offset-8">
                {certData.student_name}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-2">
                {certData.college}
              </p>
            </div>

            {/* Program Statement */}
            <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
              has successfully fulfilled all rigorous technical milestones, completed 50+ real-world project assignments, and deployed a production-grade Capstone SaaS application in the
            </p>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 max-w-xl mx-auto">
              <h3 className="text-lg sm:text-xl font-extrabold text-sky-950">
                {certData.program}
              </h3>
              <p className="text-xs font-bold text-sky-700 mt-0.5">
                {certData.batch} • Duration: {certData.duration} (100% Virtual)
              </p>
            </div>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="pt-8 border-t-2 border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            
            {/* Verification QR / Link */}
            <div className="text-left space-y-1">
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                Verify URL: skyrovix.com/verify
              </span>
            </div>

            {/* Official Gold Seal */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-4 border-amber-500 shadow-md flex items-center justify-center mx-auto text-amber-950">
                <Award className="w-10 h-10" />
              </div>
              <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider block mt-1">
                OFFICIAL SEAL
              </span>
            </div>

            {/* Authorizing Signature */}
            <div className="text-left sm:text-right space-y-1">
              <div className="text-slate-900 font-serif italic text-lg leading-tight font-bold">
                Director of Engineering
              </div>
              <p className="text-xs font-bold text-slate-800">Skyrovix Technologies</p>
              <p className="text-[11px] text-slate-400">Issue Date: {certData.issue_date}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
