export function ProfileBackground() {
  return (
    <div className="profile-background pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 z-0 opacity-[.42] [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_28%,#000_0%,rgba(0,0,0,.88)_58%,transparent_92%)] max-[720px]:opacity-[.28] max-[720px]:[background-size:44px_44px]"
      />

      <div
        className="profile-grid-light absolute inset-0 z-[1] opacity-[.7] [background-image:linear-gradient(rgba(var(--accent-a),.18)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--accent-a),.18)_1px,transparent_1px)] [background-size:64px_64px] [filter:drop-shadow(0_0_10px_rgba(var(--accent-a),.08))] [mask-repeat:no-repeat] [mask-size:34%_100%] [mask-position:-52%_0] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,.12)_24%,#000_43%,#000_57%,rgba(0,0,0,.12)_76%,transparent_100%)] [will-change:mask-position,opacity]"
      />

      <div className="profile-halo absolute left-1/2 top-[8%] z-[2] aspect-square w-[min(70vw,900px)] -translate-x-1/2 rounded-full opacity-90 [background:radial-gradient(circle_at_48%_48%,rgba(255,255,255,.06),transparent_15%),radial-gradient(circle,rgba(var(--accent-a),.16),rgba(var(--accent-b),.07)_35%,transparent_69%)] blur-[76px]" />

      <div className="profile-orb profile-orb-a absolute right-[6%] top-[10%] z-[3] h-[190px] w-[190px] rounded-full opacity-[.5] blur-[1px] [background:radial-gradient(circle_at_32%_28%,rgba(255,255,255,.14),rgba(var(--accent-a),.1)_35%,transparent_72%)] max-[640px]:-right-[10%] max-[640px]:h-[120px] max-[640px]:w-[120px]" />
      <div className="profile-orb profile-orb-b absolute bottom-[18%] left-[10%] z-[3] h-40 w-40 rounded-full opacity-[.5] blur-[1px] [background:radial-gradient(circle_at_48%_42%,rgba(var(--accent-b),.11),rgba(var(--accent-a),.06)_44%,transparent_72%)] max-[640px]:hidden" />

      <div className="absolute inset-0 z-[5] [box-shadow:inset_0_0_190px_42px_rgba(0,0,0,.68),inset_0_-130px_130px_rgba(0,0,0,.42)]" />
    </div>
  );
}
