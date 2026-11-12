"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/** Content stays visible without JS; animations only decorate mounted pages. */
export function PageMotion({ children }: { children: ReactNode }) {
    const root = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    useLayoutEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        let context: gsap.Context | undefined;
        function enter() {
            context?.revert();
            if (media.matches || !root.current) return;
            context = gsap.context(() => {
                const heading = root.current!.querySelectorAll(".project-page-heading, .ws-heading");
                const cards = root.current!.querySelectorAll(".project-stat, .project-team-stat");
                const panels = root.current!.querySelectorAll(".project-panel, .ws-panel, .ws-project-card, .ws-new-project, .project-role-guide, .project-notebook");
                const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: .42 } });
                if (heading.length) timeline.from(heading, { y: 12, opacity: 0, clearProps: "transform,opacity" }, 0);
                if (cards.length) timeline.from(cards, { y: 16, opacity: 0, stagger: .055, clearProps: "transform,opacity" }, .06);
                if (panels.length) timeline.from(panels, { y: 14, opacity: 0, stagger: { each: .045, amount: .18 }, clearProps: "transform,opacity" }, .12);
            }, root);
        }
        enter();
        media.addEventListener("change", enter);
        return () => { media.removeEventListener("change", enter); context?.revert(); };
    }, [pathname]);
    return <div ref={root} className="page-motion">{children}</div>;
}
