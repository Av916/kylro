"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowDownRight, ArrowRight, Check, Circle, LayoutGrid, LockKeyhole, MessageCircle, Plus, Sparkles, Users } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-intro]", { opacity: 0, y: 24, duration: 1, stagger: .1, ease: "power3.out", clearProps: "transform" });
        gsap.from("[data-card]", { opacity: 0, y: 32, duration: 1.1, stagger: .09, delay: .25, ease: "power3.out", clearProps: "transform" });
      });
      return () => motion.revert();
    }, root);
    return () => ctx.revert();
  }, []);
  return <div className={styles.page} ref={root}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}><span className={styles.brandMark}>k<span>✳</span></span> kylro<span className={styles.brandDot}>.</span></Link>
      <nav className={styles.nav} aria-label="Main navigation"><a href="#features">The workspace</a><a href="#how-it-works">How it works</a></nav>
      <div className={styles.navActions}><Link href="/login" className={styles.signIn}>Sign in</Link><Link href="/login" className={styles.navButton}>Get started <ArrowRight size={15}/></Link></div>
    </header>
    <main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow} data-intro><span/> A LITTLE MORE CLARITY, EVERY DAY</div>
          <h1 data-intro>Good work<br/>happens <em>together.</em></h1>
          <p data-intro>Kylro is a calm space for your team to plan projects, track progress, and keep the conversation moving.</p>
          <div className={styles.heroActions} data-intro><Link href="/login" className={styles.primary}>Start your workspace <ArrowRight size={17}/></Link><a className={styles.textLink} href="#features">Take a look <ArrowDownRight size={17}/></a></div>
          <div className={styles.heroNote} data-intro><span>✳</span> Made for the work that matters.</div>
        </div>
        <div className={styles.heroArt} data-intro aria-label="Example project board">
          <div className={styles.artTop}><span>YOUR WORK, IN ONE PLACE</span><span>✳</span></div>
          <div className={styles.board}><div className={styles.boardHeader}><div><span className={styles.boardLabel}>PROJECT / 01</span><h2>Website refresh <span>↗</span></h2></div><div className={styles.avatars}><i>A</i><i>M</i><i>J</i></div></div>
            <div className={styles.boardTabs}><span>Overview</span><strong>Board</strong><span>Issues</span><span>Members</span></div>
            <div className={styles.columns}><div><div className={styles.columnTitle}><span className={styles.dotGray}/> To do <small>2</small></div><div className={styles.task}><span>◌ &nbsp; Design</span><b>Explore new directions</b><div><small>WEB-01</small><i>A</i></div></div><div className={styles.task}><span>◌ &nbsp; Content</span><b>Write the homepage copy</b><div><small>WEB-02</small><i>M</i></div></div></div><div><div className={styles.columnTitle}><span className={styles.dotOrange}/> In progress <small>1</small></div><div className={styles.task}><span>◐ &nbsp; Design</span><b>Build the landing page</b><div><small>WEB-03</small><i>J</i></div></div></div><div className={styles.lastColumn}><div className={styles.columnTitle}><span className={styles.dotGreen}/> Done <small>1</small></div><div className={styles.task}><span>✓ &nbsp; Planning</span><b>Kick off the project</b><div><small>WEB-04</small><i>A</i></div></div></div></div>
          </div><div className={styles.artCaption}>A clearer view of everything in motion. <span>01 / 03</span></div>
          <div className={styles.floating}><span>✓</span><div><b>Making progress</b><small>One good step at a time.</small></div></div>
        </div>
      </section>
      <section className={styles.features} id="features"><div className={styles.sectionHeading}><div><div className={styles.eyebrow}><span/> THE KYLRO WORKSPACE</div><h2>Less juggling.<br/><em>More doing.</em></h2></div><p>From the first idea to the final checkmark, keep your people and your projects on the same page.</p></div>
        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardBoard}`} data-card><div className={styles.cardIcon}><LayoutGrid size={20}/></div><div><span className={styles.cardNumber}>01 / SEE THE BIG PICTURE</span><h3>A home for every project.</h3><p>Organize work in dedicated projects and see what needs attention on a simple, visual board.</p></div><div className={styles.miniBoard}><div><span>TO DO</span><i/><i/></div><div><span>IN PROGRESS</span><i/><i/></div><div><span>DONE</span><i/></div></div></article>
          <article className={`${styles.card} ${styles.cardSage}`} data-card><div className={styles.cardIcon}><Users size={20}/></div><div className={styles.people}><span>A</span><span>M</span><span>J</span><span><Plus size={17}/></span></div><div><span className={styles.cardNumber}>02 / BRING EVERYONE IN</span><h3>Better, together.</h3><p>Invite your team into a shared workspace, with roles that keep the right people in the right places.</p></div></article>
          <article className={`${styles.card} ${styles.cardCream}`} data-card><div className={styles.cardIcon}><Check size={20}/></div><div className={styles.checklist}><span><Check size={14}/> Make a plan</span><span><Circle size={14}/> Move work forward</span><span><Circle size={14}/> Celebrate the finish</span></div><div><span className={styles.cardNumber}>03 / FIND YOUR FLOW</span><h3>Every detail, in its place.</h3><p>Create and assign issues, update their status, and move them across your board as work progresses.</p></div></article>
          <article className={`${styles.card} ${styles.cardConversation}`} data-card><div className={styles.cardIcon}><MessageCircle size={20}/></div><div><span className={styles.cardNumber}>04 / KEEP THE CONTEXT</span><h3>Conversations stay close.</h3><p>Add comments to issues and keep project discussions right where the work happens.</p></div><div className={styles.bubble}>Looks good to me! <span>✳</span></div></article>
        </div>
      </section>
      <section className={styles.closing} id="how-it-works"><div className={styles.closingMark}><Sparkles size={24}/></div><div><span className={styles.cardNumber}>A LITTLE ROOM TO DO GREAT THINGS</span><h2>Make space for<br/><em>your best work.</em></h2><p>Create a workspace, invite your people, and give your next idea a place to grow.</p><Link href="/login" className={styles.primary}>Get started with Kylro <ArrowRight size={17}/></Link></div><div className={styles.closingSteps}><div><span>01</span> Create a workspace <ArrowRight size={16}/></div><div><span>02</span> Invite your team <ArrowRight size={16}/></div><div><span>03</span> Make things happen <Sparkles size={16}/></div></div></section>
    </main><footer className={styles.footer}><Link href="/" className={styles.brand}>kylro<span className={styles.brandDot}>.</span></Link><p>A calmer way to work, together.</p><div><LockKeyhole size={14}/> Your work, your space.</div></footer>
  </div>;
}
