// 🚀 REMOVED 'use client' - This is now 100% Server Rendered HTML/CSS
export function NeonOrbs() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-screen overflow-hidden flex items-center justify-center bg-background transition-colors duration-500">
      {/* Top-left orb */}
      <div
        className="absolute animate-orb-enter-top"
        style={{
          top: "-40%",
          left: "-20%",
          width: "80vw",
          height: "80vw",
          maxWidth: "800px",
          maxHeight: "800px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="beam-container beam-spin-8">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Bottom-right orb */}
      <div
        className="absolute animate-orb-enter-bottom"
        style={{
          bottom: "-35%",
          right: "-15%",
          width: "75vw",
          height: "75vw",
          maxWidth: "750px",
          maxHeight: "750px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="beam-container beam-spin-7-reverse">
            <div className="beam-light" />
          </div>
        </div>
      </div>
    </div>
  )
}
