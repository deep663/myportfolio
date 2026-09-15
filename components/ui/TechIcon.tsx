interface TechIconProps {
  iconClass: string;
  title: string;
}

/**
 * Wraps one devicon/bootstrap-icon class name with consistent sizing.
 * Pure presentational Server Component — no fetching, no state.
 *
 * Rests desaturated and reveals each icon's real brand color on hover —
 * the same grayscale -> color move as the Hero portrait, applied to the
 * tech-stack row instead of staying a one-off photo effect.
 *
 * @param iconClass - the devicon/bootstrap-icon class (e.g. "devicon-react-original")
 * @param title - accessible/tooltip title for the icon (e.g. "React")
 */
export default function TechIcon({ iconClass, title }: TechIconProps) {
  return (
    <i
      className={`${iconClass} text-4xl text-neutral-800 grayscale transition-[filter] duration-500 hover:grayscale-0`}
      title={title}
    ></i>
  );
}
