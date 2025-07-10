export default function SayonaraLogo({ size = 80 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="40" r="36" fill="#924DAC" />
        {/* Stylized human figure */}
        <path
          d="M40 20 Q44 32 52 36 Q44 38 40 60 Q36 38 28 36 Q36 32 40 20 Z"
          fill="white"
        />
        {/* Head */}
        <circle cx="40" cy="28" r="4" fill="white" />
      </svg>
      <span
        style={{
          fontFamily: "'Quicksand', 'Montserrat', Arial, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.2em",
          color: "#924DAC",
          marginTop: 8,
        }}
      >
        SAYONARA
      </span>
    </div>
  );
} 