import React from 'react';
import { ServiceBrand } from '../types';

interface ServiceIllustrationProps {
  marca: ServiceBrand;
  className?: string;
}

export const ServiceIllustration: React.FC<ServiceIllustrationProps> = ({ marca, className = 'w-full h-44' }) => {
  if (marca === 'elomak') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 flex items-center justify-center p-6 border-b border-amber-500/20 ${className}`}>
        {/* Subtle technical grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base plate */}
          <path d="M20 120H220C222 120 224 118 224 116V108H16V116C16 118 18 120 20 120Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
          
          {/* Machine arm & body */}
          <path d="M190 108V50C190 38 180 28 168 28H70C58 28 48 38 48 50V68H85V52C85 48 88 45 92 45H162C166 45 169 48 169 52V108H190Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          
          {/* Needle bar & presser foot */}
          <line x1="68" y1="52" x2="68" y2="104" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 104H74L76 108H60L62 104Z" fill="#f59e0b" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="68" y1="108" x2="68" y2="114" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Mechanical balance wheel */}
          <circle cx="196" cy="54" r="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="196" cy="54" r="6" fill="#f59e0b" />
          <line x1="196" y1="38" x2="196" y2="70" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="180" y1="54" x2="212" y2="54" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Precision calibration radar & thread line */}
          <path d="M80 34Q120 18 160 34" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="120" cy="26" r="3" fill="#38bdf8" />
          
          {/* Measurement marks */}
          <line x1="28" y1="108" x2="28" y2="113" stroke="#f59e0b" strokeWidth="1" />
          <line x1="38" y1="108" x2="38" y2="113" stroke="#f59e0b" strokeWidth="1" />
          <line x1="48" y1="108" x2="48" y2="113" stroke="#f59e0b" strokeWidth="1" />
          
          {/* Location text tag */}
          <rect x="94" y="68" width="86" height="20" rx="4" fill="#020617" stroke="#f59e0b" strokeWidth="0.8" />
          <text x="137" y="82" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">SÃO GONÇALO · RJ</text>
        </svg>
      </div>
    );
  }

  if (marca === 'vanguard') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-950 flex items-center justify-center p-6 border-b border-emerald-500/20 ${className}`}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Laptop / Screen Base */}
          <rect x="42" y="32" width="156" height="74" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
          <rect x="48" y="38" width="144" height="62" rx="4" fill="#020617" />
          
          {/* Stand */}
          <path d="M30 110H210C212 110 214 112 214 114V116H26V114C26 112 28 110 30 110Z" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
          <rect x="105" y="106" width="30" height="4" rx="2" fill="#10b981" />

          {/* Growth Chart within screen */}
          <path d="M60 88L88 74L118 80L150 54L178 46" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M60 88L88 74L118 80L150 54L178 46V92H60V88Z" fill="url(#growth-gradient)" opacity="0.25" />
          
          {/* Certificate Badge icon */}
          <circle cx="178" cy="46" r="5" fill="#34d399" />
          <path d="M178 41L180 45L184 46L181 48L182 52L178 50L174 52L175 48L172 46L176 45L178 41Z" fill="#020617" />
          
          {/* Online badge text */}
          <rect x="60" y="44" width="70" height="14" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="0.8" />
          <text x="95" y="54" fill="#6ee7b7" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">100% ONLINE · VENDAS</text>

          {/* Defs */}
          <defs>
            <linearGradient id="growth-gradient" x1="119" y1="46" x2="119" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (marca === 'elocontabil') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-950 flex items-center justify-center p-6 border-b border-sky-500/20 ${className}`}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Futuristic Dashboard Tablet */}
          <rect x="52" y="24" width="136" height="92" rx="8" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="58" y="30" width="124" height="80" rx="5" fill="#020617" />
          
          {/* Financial Flow Bars */}
          <rect x="70" y="78" width="12" height="24" rx="2" fill="#0284c7" />
          <rect x="88" y="66" width="12" height="36" rx="2" fill="#0ea5e9" />
          <rect x="106" y="56" width="12" height="46" rx="2" fill="#38bdf8" />
          
          {/* Compliance & HR Shield */}
          <path d="M152 46V62C152 72 142 80 136 84C130 80 120 72 120 62V46L136 40L152 46Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M129 62L134 67L143 57" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* BPO Label */}
          <rect x="70" y="38" width="60" height="14" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="100" y="48" fill="#7dd3fc" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">BPO & RH DIGITAL</text>

          {/* No CRC needed badge */}
          <rect x="68" y="94" width="104" height="12" rx="2" fill="#0369a1" />
          <text x="120" y="103" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">DISPENSA REGISTRO NO CRC</text>
        </svg>
      </div>
    );
  }

  if (marca === 'elosign') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 flex items-center justify-center p-6 border-b border-indigo-500/30 ${className}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Document Sheet */}
          <rect x="65" y="18" width="110" height="104" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
          <path d="M150 18H175V42H150V18Z" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
          <path d="M150 42L175 18" stroke="#818cf8" strokeWidth="1.2" />

          {/* Text lines */}
          <line x1="80" y1="36" x2="135" y2="36" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="46" x2="135" y2="46" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="56" x2="160" y2="56" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="80" y1="66" x2="160" y2="66" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Signature Line & Pen Curve */}
          <path d="M80 88C90 85 96 92 104 88C112 84 116 92 124 88C132 84 138 90 144 87" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="86" r="3" fill="#818cf8" />

          {/* Verified Badge */}
          <rect x="76" y="98" width="88" height="14" rx="3" fill="#312e81" stroke="#818cf8" strokeWidth="0.8" />
          <text x="120" y="108" fill="#c7d2fe" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.4">LEI 14.063/2020 · ASSINATURA AVANÇADA</text>
        </svg>
      </div>
    );
  }

  if (marca === 'eloautentico') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-950 flex items-center justify-center p-6 border-b border-purple-500/30 ${className}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Certificate Base */}
          <rect x="55" y="20" width="130" height="100" rx="8" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
          <rect x="62" y="27" width="116" height="86" rx="5" fill="#090514" />

          {/* QR Code representation */}
          <rect x="72" y="38" width="40" height="40" rx="4" fill="#1e1035" stroke="#c084fc" strokeWidth="1" />
          <rect x="76" y="42" width="12" height="12" fill="#c084fc" />
          <rect x="96" y="42" width="12" height="12" fill="#c084fc" />
          <rect x="76" y="62" width="12" height="12" fill="#c084fc" />
          <rect x="92" y="58" width="6" height="6" fill="#a855f7" />
          <rect x="100" y="66" width="8" height="8" fill="#e9d5ff" />

          {/* Hash & Verification metadata */}
          <rect x="120" y="40" width="50" height="8" rx="2" fill="#3b0764" />
          <text x="145" y="46" fill="#d8b4fe" fontSize="5.5" fontWeight="bold" textAnchor="middle">HASH SHA-256</text>
          <line x1="120" y1="54" x2="168" y2="54" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
          <line x1="120" y1="62" x2="168" y2="62" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
          <line x1="120" y1="70" x2="155" y2="70" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />

          {/* Golden Seal of Authenticity */}
          <rect x="70" y="88" width="100" height="16" rx="4" fill="#3b0764" stroke="#c084fc" strokeWidth="0.8" />
          <text x="120" y="99" fill="#f3e8ff" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.4">VALIDA.GRUPOELOIZIO.COM.BR</text>
        </svg>
      </div>
    );
  }

  // elomail & default saas
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 flex items-center justify-center p-6 border-b border-rose-500/20 ${className}`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

      <svg viewBox="0 0 240 140" className="w-full h-full max-h-36 drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Envelope Base */}
        <path d="M50 40H190C194 40 198 44 198 48V100C198 104 194 108 190 108H50C46 108 42 104 42 100V48C42 44 46 40 50 40Z" fill="#1e1b2e" stroke="#fb7185" strokeWidth="1.5" />
        <path d="M44 44L120 84L196 44" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M44 104L95 68" stroke="#4c0519" strokeWidth="1.2" />
        <path d="M196 104L145 68" stroke="#4c0519" strokeWidth="1.2" />

        {/* Dynamic PDF emerging */}
        <rect x="85" y="22" width="70" height="42" rx="4" fill="#0f172a" stroke="#fda4af" strokeWidth="1.2" />
        <rect x="92" y="28" width="22" height="12" rx="2" fill="#be123c" />
        <text x="103" y="37" fill="#ffffff" fontSize="6.5" fontWeight="extrabold" textAnchor="middle">PDF</text>
        <line x1="120" y1="32" x2="148" y2="32" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="92" y1="48" x2="148" y2="48" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

        {/* Server badge */}
        <rect x="68" y="94" width="104" height="12" rx="2" fill="#881337" />
        <text x="120" y="103" fill="#ffe4e6" fontSize="6.5" fontWeight="bold" textAnchor="middle">MAIL.GRUPOELOIZIO.COM.BR · SMTP HOSTINGER</text>
      </svg>
    </div>
  );
};
