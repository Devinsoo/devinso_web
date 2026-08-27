"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Globe, MapPin, Sparkles, Code2 } from "lucide-react";

const profile = {
  name: "Alex Morgan",
  title: "Creative Full Stack Engineer",
  bio: "Building digital experiences with modern technologies and immersive interfaces.",
  location: "Remote Studio",
  avatar: "https://i.pravatar.cc/400?img=12",
  skills: [
    ["React", "EXPERT"],
    ["Next.js", "ADVANCED"],
    ["UI Motion", "EXPERT"],
    ["Node.js", "ADVANCED"],
  ],
  projects: [
    { title: "Allixro", desc: "Automation platform experience", tech: "Next.js · GSAP · AI" },
    { title: "Digital Core", desc: "Creative web ecosystem", tech: "React · Node" },
  ],
};

export function ProfilePage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".profile-reveal", { y: 60, opacity: 0, filter: "blur(12px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: .12, ease: "power3.out" });
      gsap.to(".floating", { y: -18, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb", { rotate: 360, duration: 18, repeat: -1, ease: "none" });
    }, root);
    return () => ctx.revert();
  }, []);

  return <main ref={root} className="relative min-h-screen overflow-hidden bg-[#050508] px-5 py-24 text-white">
    <div className="orb absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-cyan-400/20 blur-sm" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

    <section className="relative mx-auto max-w-6xl">
      <div className="profile-reveal glass rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <div className="floating relative">
            <div className="absolute inset-[-12px] rounded-full bg-cyan-400/30 blur-xl" />
            <img src={profile.avatar} className="relative h-44 w-44 rounded-full border border-white/20 object-cover" />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-cyan-300"><Sparkles size={18}/> MEMBER PROFILE</div>
            <h1 className="text-5xl font-semibold tracking-tight">{profile.name}</h1>
            <p className="mt-3 text-xl text-white/60">{profile.title}</p>
            <p className="mt-5 max-w-2xl text-white/70">{profile.bio}</p>
            <div className="mt-5 flex items-center gap-2 text-white/50"><MapPin size={16}/> {profile.location}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="profile-reveal rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl">Social</h2>
          <div className="flex gap-5 text-cyan-300"><Code2/><Globe/><Globe/></div>
        </div>
        <div className="profile-reveal rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl">Skills</h2>
          <div className="space-y-4">{profile.skills.map(([s,l])=><div key={s} className="flex justify-between rounded-xl bg-black/20 p-4"><span>{s}</span><span className="text-cyan-300">{l}</span></div>)}</div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {profile.projects.map(p=><article key={p.title} className="profile-reveal rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2">
          <h3 className="text-3xl">{p.title}</h3><p className="mt-3 text-white/60">{p.desc}</p><p className="mt-6 text-cyan-300">{p.tech}</p>
        </article>)}
      </section>
    </section>
  </main>;
}
