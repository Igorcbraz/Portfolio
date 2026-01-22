"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Articles, ContactSection, Hero, ProfessionalJourney, Projects, TechStack } from "@/components/sections"
import { Footer } from "@/components/layout"

const ScrollProgress = dynamic(() => import("@/components/features/scroll-progress").then(m => m.ScrollProgress), {
  ssr: false,
  loading: () => null,
})

const CodeDashboard = dynamic(() => import("@/components/features/code-dashboard").then(m => m.CodeDashboard), {
  ssr: false,
  loading: () => null,
})

export function PortfolioContent() {
  return (
    <>
      <ScrollProgress />
      <div className="relative z-10 bg-black">
        <main className="w-full pb-8 mb-8">
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
      </div>
    </>
  )
}
