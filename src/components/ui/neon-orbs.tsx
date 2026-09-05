// Server-rendered. The single static glow the site allows: one radial gradient
// behind the hero, painted once. No box-shadow, no animation, no fixed layer.
export function NeonOrbs() {
  return <div aria-hidden="true" className="hero-backdrop" />;
}
