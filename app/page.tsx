"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { ProfessionalJourney } from "@/components/professional-journey"
import { CodeDashboard } from "@/components/code-dashboard"
import { Projects } from "@/components/projects"
import { Articles } from "@/components/articles"
import { TechStack } from "@/components/tech-stack"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { CustomCursor } from "@/components/custom-cursor"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <ScrollProgress />
      <main className="w-full pt-20">
        <section id="hero">
          <Hero />
        </section>
        <section id="journey">
          <ProfessionalJourney />
        </section>
        <motion.section
          id="github"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <CodeDashboard />
        </motion.section>
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <Projects />
        </motion.section>
        <motion.section
          id="articles"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <Articles />
        </motion.section>
        <motion.section
          id="stack"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          <TechStack />
        </motion.section>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <ContactSection />
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
