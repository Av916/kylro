"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ProjectHeader } from "../layout/ProjectHeader";
import { ProjectSidebar } from "../layout/ProjectSidebar";
import { useSidebarPreference } from "../layout/useSidebarPreference";

export function ProjectShell({ children }: { children: ReactNode }) {
    const [navigationOpen, setNavigationOpen] = useState(false);
    const { collapsed, setCollapsed, mobile } = useSidebarPreference();
    function closeNavigation() {
        setNavigationOpen(false);
        requestAnimationFrame(() => document.getElementById("project-sidebar-toggle")?.focus());
    }
    useEffect(() => {
        if (!navigationOpen || !mobile) return;
        document.querySelector<HTMLElement>("#project-navigation button.mobile-only")?.focus();
        const close = (event: KeyboardEvent) => {
            if (event.key === "Tab") {
                const items = Array.from(document.querySelectorAll<HTMLElement>("#project-navigation a, #project-navigation button")).filter(item => item.offsetParent !== null);
                const first = items[0], last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }
            if (event.key === "Escape") { setNavigationOpen(false); requestAnimationFrame(() => document.getElementById("project-sidebar-toggle")?.focus()); }
        };
        document.addEventListener("keydown", close);
        return () => document.removeEventListener("keydown", close);
    }, [navigationOpen, mobile]);
    return <div className={`project-shell${collapsed ? " project-navigation-collapsed" : ""}`}>
        <a className="project-skip" href="#project-content">Skip to content</a>
        <ProjectSidebar open={mobile && navigationOpen} onClose={closeNavigation} onCollapse={() => { setCollapsed(true); requestAnimationFrame(() => document.getElementById("project-sidebar-toggle")?.focus()); }} />
        <div className="project-main" inert={mobile && navigationOpen}>
            <ProjectHeader navigationOpen={mobile ? navigationOpen : !collapsed} onOpenNavigation={() => mobile ? setNavigationOpen(value => !value) : setCollapsed(!collapsed)} />
            <main id="project-content" className="project-content">{children}</main>
        </div>
    </div>;
}
