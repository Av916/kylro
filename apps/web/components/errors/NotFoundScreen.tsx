import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderOpen, House } from "lucide-react";
import styles from "./NotFoundScreen.module.css";

export function NotFoundScreen({ project = false }: { project?: boolean }) {
    return <div className={styles.page}>
        <header className={styles.header}>
            <Link href="/" className={styles.brand} aria-label="Kylro home"><span className={styles.mark}>k.</span>Kylro</Link>
            <Link href="/workspace" className={styles.headerLink}>Go to workspace <ArrowUpRight size={15} /></Link>
        </header>
        <main className={styles.main} id="not-found-content">
            <div className={styles.paper} aria-hidden="true">
                <span className={styles.tape} />
                <span className={styles.paperLabel}>PAGE NOT FOUND</span>
                <span className={styles.code}>404</span>
                <div className={styles.rule} />
                <span className={styles.paperCaption}>Nothing at this address.</span>
            </div>
            <section className={styles.message} aria-labelledby="not-found-title">
                <span className={styles.eyebrow}>404 / {project ? "PROJECT UNAVAILABLE" : "PAGE NOT FOUND"}</span>
                <h1 id="not-found-title">{project ? "This project isn’t available." : "This page couldn’t be found."}</h1>
                <p>{project ? "The project may have been deleted, or you may not have access. Open your workspace to find the projects available to you." : "The link may be incorrect, or the page may have moved. Check the address or return to your workspace."}</p>
                <Link href="/workspace" className={styles.primary}><ArrowLeft size={16} /> Back to workspace</Link>
                <nav className={styles.destinations} aria-label="Page recovery">
                    <Link href="/workspace/projects"><FolderOpen size={19} /><span><strong>Your projects</strong><small>Browse projects you can access</small></span><ArrowUpRight size={15} /></Link>
                    <Link href="/"><House size={19} /><span><strong>Kylro home</strong><small>Return to the starting page</small></span><ArrowUpRight size={15} /></Link>
                </nav>
            </section>
        </main>
    </div>;
}
