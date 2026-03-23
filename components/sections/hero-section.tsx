'use client'

import { motion } from 'framer-motion'
import { MapPin, FileText, Mail, Briefcase } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { achievements, contactInfo } from '@/lib/data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function HeroSection() {
  const degreeAchievement = achievements.find((a) => a.id === 2)

  return (
    <section id="home" className="bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center md:items-start gap-6 py-8 md:py-12"
      >
        {/* Profile Image - Large, rounded rectangle like bryllim.com */}
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <div className="w-[160px] h-[200px] md:w-[180px] md:h-[220px] rounded-xl overflow-hidden border-2 border-border shadow-lg bg-muted">
            <Image
              src="/assets/images/about/ProfilePic.jpg"
              alt="Christian Raro"
              width={180}
              height={220}
              priority
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* Info Section - Left aligned */}
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          {/* Name with Verified Badge */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2"
          >
            Christian Raro
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              viewBox="0 0 48 48"
              fill="none"
              aria-label="Verified"
            >
              {/* Starburst / badge shape */}
              <path
                d="M24 0l4.24 8.76L37 6.1l-1.1 8.9 8.9-1.1-2.66 8.76L48 24l-5.86 1.34 2.66 8.76-8.9-1.1L37 41.9l-8.76-2.66L24 48l-4.24-8.76L11 41.9l1.1-8.9-8.9 1.1 2.66-8.76L0 24l5.86-1.34L3.2 13.9l8.9 1.1L11 6.1l8.76 2.66L24 0z"
                fill="#1DA1F2"
              />
              {/* White checkmark */}
              <path
                d="M21.2 33.2l-7.4-7.4 3.2-3.2 4.2 4.2 10-10 3.2 3.2-13.2 13.2z"
                fill="white"
              />
            </svg>
          </motion.h1>

          {/* Location Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span>Philippines</span>
          </motion.div>

          {/* Professional Titles */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground"
          >
            Software Engineer / Frontend Developer
          </motion.p>

          {/* Achievement Badge */}
          {degreeAchievement && (
            <motion.div variants={itemVariants}>
              <Link
                href={degreeAchievement.link || '#experience'}
                className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {degreeAchievement.title}
              </Link>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 pt-3"
          >
            <Link
              href="/assets/resume/Raro, Christian F - Resume (DEV).pdf"
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </Link>
            <Link
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 bg-muted border border-border text-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </Link>
            <Link
              href="#works"
              className="inline-flex items-center gap-2 bg-muted border border-border text-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              View Projects
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
