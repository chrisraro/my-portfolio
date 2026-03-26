import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { projects, skills, experience, education, contactInfo, recommendations } from '@/lib/data'

// Build comprehensive portfolio context for the system prompt
function buildPortfolioContext(): string {
  // Owner info
  const ownerInfo = `
OWNER INFORMATION:
- Name: Christian Raro
- Title: Software Engineer / Full-Stack Developer
- Location: Naga City, Camarines Sur, Philippines
- Email: ${contactInfo.email}
- About: Christian Raro is a Software Engineer and Full-Stack Developer based in the Philippines. He specializes in building modern, responsive web applications using React, Next.js, and TypeScript — crafting digital experiences that are both functional and delightful to use. His background spans full-stack development, WordPress solutions, and mobile app development. He's passionate about writing clean, maintainable code and creating user-centric interfaces with thoughtful design decisions.
`

  // Projects
  const projectsList = projects.map(p => 
    `- ${p.title}: ${p.description} | Tech: ${p.technologies.join(', ')}${p.links?.live ? ` | URL: ${p.links.live}` : ''}${p.featured ? ' [FEATURED]' : ''}`
  ).join('\n')

  // Skills by category
  const frontendSkills = skills.filter(s => s.category === 'Frontend').map(s => s.name).join(', ')
  const backendSkills = skills.filter(s => s.category === 'Backend').map(s => s.name).join(', ')
  const toolsSkills = skills.filter(s => s.category === 'Tools & DevOps').map(s => s.name).join(', ')

  // Experience
  const experienceList = experience.map(e => 
    `- ${e.title} at ${e.company} (${e.dates}), ${e.location}
    Responsibilities: ${e.responsibilities.join('; ')}`
  ).join('\n')

  // Education
  const educationList = education.map(e => 
    `- ${e.degree} from ${e.school} (${e.graduationDate})${e.honors ? ` - ${e.honors}` : ''}`
  ).join('\n')

  // Recommendations
  const recommendationsList = recommendations.map(r => 
    `- "${r.quote}" — ${r.authorName}, ${r.authorTitle}`
  ).join('\n')

  return `
${ownerInfo}

PROJECTS (${projects.length} total):
${projectsList}

TECHNICAL SKILLS:
Frontend: ${frontendSkills}
Backend: ${backendSkills}
Tools & DevOps: ${toolsSkills}

WORK EXPERIENCE:
${experienceList}

EDUCATION:
${educationList}

RECOMMENDATIONS/TESTIMONIALS:
${recommendationsList}

SERVICES OFFERED:
- Full-stack web application development (React, Next.js, Node.js)
- WordPress website development & customization
- Mobile app development
- UI/UX design
- E-commerce solutions with WooCommerce
- API integrations
- Bubble.io development

CONTACT:
- Email: ${contactInfo.email}
- Location: ${contactInfo.location}
- Social Links: GitHub (github.com/chrisraro), LinkedIn (linkedin.com/in/christian-raro)
- Phone: 09631751535
- Address: Zone 3 Bronze Street, Brgy. Triangulo, Naga City, Camarines Sur

RESUME / EDUCATION HISTORY:
- B.S. Computer Science, Bicol University Polangui Campus, Polangui, Albay (Aug 2020 – July 2024)
- TVL – ICT (Computer Programming), Camarines Sur National High School, Naga City (June 2018 – July 2020) — With Honors
- TVL – ICT (Computer System Servicing, Gr. 7–8), Camarines Sur National High School (June 2014 – April 2018)

DETAILED WORK HISTORY (from resume):
- Web Developer at Online Creative Solutions, Naga City (Nov 2024 – present): Full stack web apps, WordPress sites, backend workflows & API integrations, UI/UX design
- IT Staff/Web Developer at Enjoy Realty and Development Corporation, Naga City (March 2025 – Aug 2025): Full stack web apps, WordPress sites, backend & API, graphic design, hardware/network/software maintenance
- Junior Bubble.io Developer at Muramart Holdings Inc., Naga City (Aug 2023 – Sep 2024): Full stack web & mobile apps via Bubble.io, UI/UX design, backend workflows
- OJT (240 hrs) at Muramart Holdings Inc. (July–Aug 2023): Bubble.io workshops, hands-on development

DETAILED PROJECT HISTORY (from resume):
- El Nido Guide PH (May–July 2025): WordPress + GeneratePress + GenerateBlocks, WooCommerce, PayPal, custom booking — elnidoguide.ph
- BeachBus Palawan (June–Aug 2025): WordPress + GeneratePress + GenerateBlocks, WooCommerce, payment — beachbus.ph
- Aman Group Web App (March–April 2025): Next.js full stack, v0.dev AI coding, Supabase/Upstash — amangroup-webapp.enjoyrealty.com
- Enjoy Realty Website Redesign (May–June 2025): Migrated Elementor to GeneratePress/GenerateBlocks — enjoyrealty.com
- Acad1 Review Center (Nov–Dec 2024): WordPress + WooCommerce + Paymongo — acad1.ph
- Muramart App (July 2023–Sep 2024): Bubble.io full stack web & mobile — muramartv2.com + Google Play
- ARWay CampusNav (Oct 2023–March 2024): Flutter + Unity + C# AR navigation thesis project

ADDITIONAL TECHNICAL SKILLS (from resume):
- OS: Windows, Linux
- Networking: TCP/IP, subnetting, routing, VLANs, Firewalls
- SysAdmin: Active Directory, File Server, Backup/Recovery, Security
- Scripting: PowerShell, Bash/Shell, Python
- Databases: SQL, basic database administration
- Languages: Java, PHP, JavaScript, HTML/CSS
- Frameworks: Flutter, WordPress, Material-UI, Bubble.io, Next.js, Laravel
- Dev Tools: Git/GitHub, VS Code, Cursor, Eclipse, Unity, Docker
- Libraries: Bootstrap, Material-UI, React, shadcn-ui
- Other: AI automation

SOFT SKILLS: Problem-solving, Communication, Documentation, Teamwork, Time Management, Customer Service

PERSONAL:
- Birthday: November 29, 2001
- Girlfriend: Jewel Maxine Fortuna — a beautiful and smart girl who is currently working as an Accounting Assistant
- Hobbies & Interests:
  • Basketball
  • Riding motorcycle
  • Learning new things, especially tech-related topics
  • Watching sneaker/buying content creators such as Rami and Frankie from Coolkicks
  • Sneaker enthusiast/collector
`
}

// System prompt with guardrails
const SYSTEM_PROMPT = `You are "Chunks", the AI assistant for Christian Raro's portfolio website. Christian is a Software Engineer and Full-Stack Developer based in Naga City, Camarines Sur, Philippines.

RULES:
1. Keep responses SHORT — 1-2 sentences max unless the user asks for detail
2. Be direct, friendly, and conversational
3. Only answer questions about Christian's portfolio, projects, skills, experience, education, and services
4. For business inquiries, direct to the contact form or email (rarochristian029@gmail.com)
5. Politely decline off-topic questions in one sentence
6. Never generate harmful or inappropriate content
7. Don't make up information — say you don't know

PORTFOLIO DATA:
${buildPortfolioContext()}

Be concise. No fluff.`

// Groq model — Llama 3.3 70B (free tier: 30 RPM, 14,400 RPD)
const MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY

    // Graceful degradation if no API key
    if (!apiKey) {
      return NextResponse.json({
        response: "I'm currently running in offline mode. I can still help you learn about Christian's portfolio! He's a Software Engineer specializing in React, Next.js, and WordPress development. Feel free to explore the portfolio or use the contact form to get in touch directly.",
        offline: true
      })
    }

    const groq = new Groq({ apiKey })

    // Build conversation messages for Groq (OpenAI-compatible format)
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message })

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.6,
      max_tokens: 300,
    })

    const response = chatCompletion.choices[0]?.message?.content || 
      "I couldn't generate a response. Please try again!"

    return NextResponse.json({ response })

  } catch (error: unknown) {
    console.error('Chat API error:', error)

    const status = (error as { status?: number }).status
    if (status === 429) {
      return NextResponse.json({
        response: "I'm getting a lot of questions right now! Please try again in a few seconds.",
        error: true
      })
    }
    
    return NextResponse.json({
      response: "I apologize, but I'm having trouble connecting right now. In the meantime, you can explore Christian's portfolio directly — check out the Works section for his projects, or use the contact form to reach out. He'd love to hear from you!",
      error: true
    })
  }
}
