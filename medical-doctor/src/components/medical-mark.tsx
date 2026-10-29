export function MedicalCross({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M34 6h32v28h28v32H66v28H34V66H6V34h28Z" /></svg>;
}

export function JointIllustration() {
  return <svg className="joint-art" viewBox="0 0 240 330" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M72 12c12 34 35 65 40 91 4 20-18 33-15 51 2 17 22 24 40 22 20-2 36-15 37-35 2-24-24-46-37-69L109 12" />
      <path d="M142 70c14 20 44 31 50 59 4 21-1 39-10 52" />
      <path d="M173 125c-9 13-10 27 1 40 3-15 2-26-1-40Z" />
      <path d="M101 185c-11-10-23-4-27 6-6 16 11 33 16 49 10 28 2 57-4 78M108 191c12 6 27 5 42-2 15-7 27 2 25 17-2 14-12 31-15 49-3 22-2 42 0 63M94 202c3 16 13 27 17 48 4 24 1 44-1 68" />
    </g>
    <circle cx="124" cy="182" r="64" stroke="currentColor" strokeOpacity=".15" strokeDasharray="3 7" />
    <path d="M190 227h21m-10-10v20" stroke="currentColor" strokeWidth="2" />
  </svg>;
}
