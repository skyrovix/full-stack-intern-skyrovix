import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Printer, 
  ArrowLeft, 
  ExternalLink,
  Search,
  Building,
  Award,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

import navLogo from '../assets/top nav bar logo.png';
import sealImg from '../assets/seal.jpg';
import hariSig from '../assets/hari sig.jpeg';
import maheshSig from '../assets/mahesh sig.jpeg';
import msmeLogo from '../assets/msme.png';
import vinixImg from '../assets/vinix.png';
import yrTechImg from '../assets/yr-tech logo.png';
import { handleDownloadCertificate } from './documents/OfferLetterCertificateTemplates';

export const CertificateView = ({ certId: initialCertId, onBack }) => {
  const [certId, setCertId] = useState(initialCertId || '');
  const [searchInput, setSearchInput] = useState('');
  const [certData, setCertData] = useState(null);
  const [certStatus, setCertStatus] = useState('LOADING'); // 'LOADING' | 'VALID' | 'REVOKED' | 'NOT_FOUND'
  const [errorMessage, setErrorMessage] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const fetchCertificate = async (idToFetch) => {
    if (!idToFetch) {
      setCertStatus('NOT_FOUND');
      setErrorMessage('Please provide a Certificate ID to verify.');
      return;
    }

    setCertStatus('LOADING');
    setErrorMessage('');

    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(idToFetch)}/verify`);
      const data = await res.json();

      if (res.status === 404 || data.status === 'NOT_FOUND') {
        setCertStatus('NOT_FOUND');
        setErrorMessage(data.message || 'The certificate ID entered is invalid or does not exist.');
        setCertData(null);
        return;
      }

      if (data.status === 'REVOKED' || data.certificate?.status === 'REVOKED') {
        setCertStatus('REVOKED');
        setCertData(data.certificate || null);
        setErrorMessage(data.message || 'This certificate is no longer valid.');
        return;
      }

      if (data.verified && data.certificate) {
        setCertStatus('VALID');
        setCertData(data.certificate);

        // Generate high-resolution scannable QR Code pointing to verification URL
        const verifyUrl = data.certificate.verify_url || `https://www.skyrovix.in/verify/${data.certificate.certificate_id || idToFetch}`;
        try {
          const qrUrl = await QRCode.toDataURL(verifyUrl, {
            width: 240,
            margin: 1,
            color: {
              dark: '#0f2b48',
              light: '#ffffff'
            }
          });
          setQrDataUrl(qrUrl);
        } catch (qrErr) {
          console.warn('QR generation error:', qrErr);
        }
      } else {
        setCertStatus('NOT_FOUND');
        setErrorMessage(data.message || 'Verification could not be established.');
      }
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setCertStatus('NOT_FOUND');
      setErrorMessage('Network connection error. Please try again in a few moments.');
    }
  };

  useEffect(() => {
    if (initialCertId) {
      setCertId(initialCertId);
      fetchCertificate(initialCertId);
    } else {
      setCertStatus('NOT_FOUND');
      setErrorMessage('Please enter a Certificate ID to verify.');
    }
  }, [initialCertId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const cleanId = searchInput.trim();
    setCertId(cleanId);
    try {
      window.history.pushState({}, '', `/verify/${cleanId}`);
    } catch (e) {}
    fetchCertificate(cleanId);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header / Portal Return Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack || (() => window.location.href = '/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <img src={navLogo} alt="Skyrovix" className="h-7 w-auto object-contain" />
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
                Official Credential Verification
              </span>
            </div>
          </div>

          {/* Quick Search Another ID */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Verify
            </button>
          </form>
        </div>

        {/* ========================================================
            STATE 1: LOADING
        ======================================================== */}
        {certStatus === 'LOADING' && (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Verifying Authenticity with Skyrovix Central Registry...</h3>
            <p className="text-xs text-slate-500 font-mono">Querying: {certId}</p>
          </div>
        )}

        {/* ========================================================
            STATE 2: NOT FOUND (Section 17)
        ======================================================== */}
        {certStatus === 'NOT_FOUND' && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-rose-200 shadow-sm text-center max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold tracking-wider">
                ✕ CERTIFICATE NOT FOUND
              </span>
              <h2 className="text-xl font-black text-slate-900 pt-2">Invalid Certificate Identifier</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The certificate ID entered is invalid or does not exist in the official Skyrovix credential registry. Please ensure the code matches the physical or digital document.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs text-slate-500 font-mono">
              Searched: <span className="font-bold text-slate-800">{certId || 'None'}</span>
            </div>
          </div>
        )}

        {/* ========================================================
            STATE 3: REVOKED (Section 18)
        ======================================================== */}
        {certStatus === 'REVOKED' && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-amber-200 shadow-sm text-center max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold tracking-wider">
                ⚠ CERTIFICATE REVOKED
              </span>
              <h2 className="text-xl font-black text-slate-900 pt-2">Certificate No Longer Valid</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                This certificate has been revoked by the Skyrovix Director Board or administrative authorities. It is no longer recognized as an authentic, active qualification.
              </p>
            </div>
            {certData && (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-left max-w-md mx-auto space-y-1.5 text-xs text-slate-700">
                <div>Recipient Name: <strong className="text-slate-900">{certData.student_name}</strong></div>
                <div>Domain: <strong className="text-slate-900">{certData.domain}</strong></div>
                <div>Certificate ID: <strong className="font-mono text-slate-900">{certData.certificate_id || certData.id}</strong></div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STATE 4: VALID & AUTHENTIC RECORD (Section 14, 15, 16)
        ======================================================== */}
        {certStatus === 'VALID' && certData && (
          <div className="space-y-6">

            {/* Verification Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ✓ VERIFIED AUTHENTIC CREDENTIAL
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {certData.certificate_id || certData.id}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900">
                  {certData.student_name}
                </h1>
                <p className="text-xs text-slate-600">
                  Has fulfilled all required curriculum assignments and capstone requirements in <strong>{certData.domain}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <a
                  href={`/api/documents/certificate/${certData.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Document</span>
                </a>
                <button
                  onClick={() => {
                    handleDownloadCertificate({
                      fullName: certData.student_name,
                      internId: certData.intern_id,
                      domain: certData.domain,
                      certId: certData.certificate_id || certData.id,
                      issuedAt: certData.issue_date,
                      verifyUrl: certData.verify_url || `https://skyrovix.online/verify-certificate?id=${certData.certificate_id || certData.id}`,
                      qrCodeDataUri: qrDataUrl
                    });
                  }}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Public Particulars Card (Section 16: Safe fields only, NO emails or phone numbers) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Internship Domain</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{certData.domain}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Internship Duration</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{certData.duration}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tenure Period</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{certData.start_date} — {certData.end_date}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Accreditation Status</span>
                <span className="font-extrabold text-emerald-700 mt-0.5 block">Successfully Completed</span>
              </div>
            </div>

            {/* ========================================================
                PIXEL-PERFECT CERTIFICATE FRAME (MATCHING NEW TEMPLATE)
            ======================================================== */}
            <div className="overflow-x-auto pb-4">
              <div 
                className="bg-white mx-auto shadow-2xl relative select-none"
                style={{
                  width: '1000px',
                  minHeight: '700px',
                  padding: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Outer Navy Border */}
                <div 
                  className="w-full h-full relative p-8 flex flex-col justify-between"
                  style={{
                    border: '6px solid #07284a',
                    outline: '1px solid #e2e8f0',
                    outlineOffset: '-12px',
                    minHeight: '668px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {/* Top Bar: Left (Logo + Vinix), Center (Skyrovix), Right (YR-Tech + MSME) */}
                  <div className="flex items-center justify-between pt-2 px-2">
                    <div className="flex items-center gap-3">
                      <img src={navLogo} alt="Skyrovix Logo" className="h-11 w-auto object-contain" />
                      <img src={vinixImg} alt="Vinix Partner" className="h-8 w-auto object-contain" />
                    </div>

                    <div className="text-center space-y-0.5">
                      <h3 
                        className="text-2xl font-black tracking-[0.25em] text-[#07284a]"
                        style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
                      >
                        SKYROVIX
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 tracking-wider">
                        Empowering Future Innovators
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={yrTechImg} alt="YR Tech Partner" className="h-8 w-auto object-contain" />
                      <img src={msmeLogo} alt="MSME Emblem" className="h-9 w-auto object-contain" />
                    </div>
                  </div>

                  {/* Main Title Section */}
                  <div className="text-center py-4 space-y-1">
                    <h1 
                      className="text-4xl font-extrabold tracking-[0.2em] text-[#07284a]"
                      style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
                    >
                      CERTIFICATE
                    </h1>
                    <div className="text-xs font-bold tracking-[0.35em] text-slate-500 uppercase">
                      OF INTERNSHIP COMPLETION
                    </div>
                  </div>

                  {/* Presentation Text & Recipient */}
                  <div className="text-center space-y-3 px-12">
                    <p className="text-xs text-slate-500 font-medium">
                      This certificate is proudly presented to
                    </p>

                    <div className="py-1">
                      <h2 
                        className="text-3xl font-black text-[#07284a] underline decoration-[#0284c7] underline-offset-8"
                        style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
                      >
                        {certData.student_name}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
                      for successfully completing the rigorous task-based virtual internship in{' '}
                      <strong className="font-extrabold text-[#07284a]">{certData.domain}</strong>{' '}
                      at Skyrovix, demonstrating consistent technical competence, problem-solving skills, and dedication to industry-standard deliverables.
                    </p>
                  </div>

                  {/* Dual Signatures and Center Seal (Image 2 style) */}
                  <div className="grid grid-cols-3 items-end pt-4 pb-2 px-6">
                    {/* Left: Founder Signature */}
                    <div className="text-center space-y-1">
                      <div className="h-12 flex items-end justify-center mb-1">
                        <img src={hariSig} alt="Hariharan Signature" className="h-10 w-auto object-contain" />
                      </div>
                      <div className="w-44 mx-auto border-t border-slate-400" />
                      <div className="text-xs font-bold text-slate-900">Hariharan S</div>
                      <div className="text-[10px] text-slate-500 font-medium">Founder &amp; CEO</div>
                    </div>

                    {/* Center: Blue Company Seal */}
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto">
                        <img src={sealImg} alt="Skyrovix Seal" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* Right: Co-Founder Signature */}
                    <div className="text-center space-y-1">
                      <div className="h-12 flex items-end justify-center mb-1">
                        <img src={maheshSig} alt="Maheshwaran Signature" className="h-10 w-auto object-contain" />
                      </div>
                      <div className="w-44 mx-auto border-t border-slate-400" />
                      <div className="text-xs font-bold text-slate-900">Maheshwaran S</div>
                      <div className="text-[10px] text-slate-500 font-medium">Co-Founder</div>
                    </div>
                  </div>

                  {/* Bottom Footer Line (Image 2 style) */}
                  <div className="pt-2 px-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <div>
                      Certificate ID: <strong className="text-slate-800">{certData.certificate_id || certData.id}</strong>
                    </div>

                    <div className="text-center space-y-0.5">
                      <div>Intern ID: <strong className="text-slate-800">{certData.intern_id}</strong></div>
                      <div className="text-[9px] text-slate-400">Verify at: www.skyrovix.in</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>Issued: <strong className="text-slate-800">{certData.issue_date}</strong></div>
                      {qrDataUrl && (
                        <img src={qrDataUrl} alt="Verification QR" className="w-10 h-10 border border-slate-200 rounded p-0.5" />
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
