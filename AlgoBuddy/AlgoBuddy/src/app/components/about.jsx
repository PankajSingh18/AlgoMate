import Link from 'next/link';
import React from 'react';
import { 
  Code2, 
  Cpu, 
  Users, 
  GitPullRequest, 
  Sparkles, 
  Target, 
  BookOpen, 
  Zap, 
  Trophy, 
  GitMerge, 
  ArrowRight,
  BrainCircuit,
  Eye,
  Rocket,
  Heart,
  Activity,
  Github,
  MonitorPlay,
  Share2,
  BookMarked
} from 'lucide-react';
import Footer from '@/app/components/footer';

const stats = [
  { label: 'Algorithms Covered', value: '50+', icon: <Cpu className="w-6 h-6" /> },
  { label: 'Visualizers Available', value: '20+', icon: <Eye className="w-6 h-6" /> },
  { label: 'Practice Problems', value: '100+', icon: <Code2 className="w-6 h-6" /> },
  { label: 'Contributors', value: '50+', icon: <GitPullRequest className="w-6 h-6" /> },
  { label: 'Community Members', value: '10k+', icon: <Users className="w-6 h-6" /> },
];

const features = [
  {
    title: 'Interactive Visualizers',
    description: 'Watch algorithms come to life step-by-step. Understand complex data structures visually rather than memorizing code.',
    icon: <MonitorPlay className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Step-by-Step Learning',
    description: 'Break down complex logic into digestible steps. Learn at your own pace with detailed explanations for each operation.',
    icon: <BookOpen className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Coding Practice',
    description: 'Test your knowledge with hands-on practice. Write code, run tests, and get immediate feedback on your solutions.',
    icon: <Code2 className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Arena Challenges',
    description: 'Prepare for interviews and contests in our Arena. Tackle challenging problems and optimize your solutions.',
    icon: <Trophy className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Community Driven Development',
    description: 'Join a thriving community of learners. Share insights, ask questions, and grow together.',
    icon: <Share2 className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Open Source Contributions',
    description: 'AlgoBuddy is open-source. Contribute to the platform, add new algorithms, and help others learn.',
    icon: <Github className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  }
];

const timeline = [
  {
    year: 'Phase 1',
    title: 'Platform Launch',
    description: 'AlgoBuddy was born out of a desire to make algorithmic learning intuitive and visually engaging for students worldwide.'
  },
  {
    year: 'Phase 2',
    title: 'Visualizer Expansion',
    description: 'Introduced an expansive library of animated sorting, searching, and graph algorithm visualizers.'
  },
  {
    year: 'Phase 3',
    title: 'Community Growth',
    description: 'Partnered with open source programs and cultivated a thriving global community of contributors and learners.'
  },
  {
    year: 'Phase 4',
    title: 'Future Features',
    description: 'Integrating AI-driven hints, broader algorithm coverage, and personalized, adaptive learning paths.'
  }
];

const AboutSection = () => {
  return (
    <>
      <div className="bg-udemy-bg dark:bg-udemy-dark-bg min-h-screen font-sans selection:bg-udemy-purple/30 pb-10">
        
        {/* HERO SECTION */}
        <section aria-label="Hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
          {/* Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[40rem] bg-udemy-purple/10 dark:bg-udemy-purple/15 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-udemy-purple/10 text-udemy-purple dark:text-udemy-purple-light font-medium text-sm border border-udemy-purple/20">
              <Sparkles className="w-4 h-4" />
              <span>Discover AlgoBuddy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text tracking-tight leading-tight">
              Revolutionizing <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-pink-500">
                DSA Learning
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between complex theoretical concepts and practical understanding. Experience algorithms visually, practice interactively, and master computer science effortlessly.
            </p>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section aria-label="Our Story" className="py-20 px-6 relative z-10 bg-white/50 dark:bg-udemy-dark-surface/50 border-y border-udemy-border/50 dark:border-udemy-dark-border/50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text">
                  The Story Behind AlgoBuddy
                </h2>
                <div className="w-20 h-1 bg-udemy-purple rounded-full"></div>
                <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                  Learning Data Structures and Algorithms has traditionally been a daunting task. Students often find themselves staring at dense textbooks and static code blocks, struggling to mentally simulate how variables change and pointers move.
                </p>
                <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                  We created AlgoBuddy because we believe there is a better way. By replacing static text with <strong className="text-udemy-purple dark:text-udemy-purple-light font-semibold">dynamic, interactive visualizers</strong>, we transform abstract logic into tangible animations. Seeing an algorithm unfold step-by-step builds an intuitive understanding that rote memorization simply cannot achieve.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-udemy-purple to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white dark:bg-udemy-dark-surface p-8 rounded-3xl border border-udemy-border dark:border-udemy-dark-border shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-udemy-bg dark:bg-udemy-dark-bg p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                      <BookMarked className="w-8 h-8 text-udemy-muted" />
                      <span className="text-sm font-medium text-udemy-muted">Traditional Learning</span>
                    </div>
                    <div className="bg-udemy-purple/10 dark:bg-udemy-purple/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border border-udemy-purple/30">
                      <Zap className="w-8 h-8 text-udemy-purple" />
                      <span className="text-sm font-medium text-udemy-purple">Visual Learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section aria-label="Mission and Vision" className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white dark:bg-udemy-dark-surface p-10 md:p-12 rounded-3xl border border-udemy-border/50 dark:border-udemy-dark-border/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110 transform">
                  <Target className="w-40 h-40 text-udemy-purple" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-udemy-purple/10 flex items-center justify-center mb-8 border border-udemy-purple/20 group-hover:bg-udemy-purple group-hover:text-white transition-colors duration-300">
                    <Target className="w-7 h-7 text-udemy-purple group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text mb-6">Our Mission</h2>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                    To make data structures and algorithms accessible, intuitive, and engaging for everyone. We believe that seeing concepts in action is the key to true mastery, moving beyond rote memorization to <strong className="text-udemy-text dark:text-udemy-dark-text">profound practical understanding</strong>.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white dark:bg-udemy-dark-surface p-10 md:p-12 rounded-3xl border border-udemy-border/50 dark:border-udemy-dark-border/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110 transform">
                  <Rocket className="w-40 h-40 text-udemy-purple" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-udemy-purple/10 flex items-center justify-center mb-8 border border-udemy-purple/20 group-hover:bg-udemy-purple group-hover:text-white transition-colors duration-300">
                    <Rocket className="w-7 h-7 text-udemy-purple group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text mb-6">Our Vision</h2>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                    To become the global standard platform for algorithmic education. We envision a future where every developer, regardless of their background, can <strong className="text-udemy-text dark:text-udemy-dark-text">confidently tackle complex computational problems</strong> with an algorithmic mindset.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEARNING PHILOSOPHY */}
        <section aria-label="Learning Philosophy" className="py-20 px-6 bg-gradient-to-b from-udemy-purple/5 to-transparent dark:from-udemy-purple/10 dark:to-transparent">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">Our Learning Philosophy</h2>
              <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
                "Tell me and I forget, teach me and I may remember, involve me and I learn."
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Learn by Seeing', desc: 'Visual representation reduces cognitive load, allowing you to instantly grasp the flow of algorithms.', icon: <Eye className="w-8 h-8" /> },
                { title: 'Learn by Practicing', desc: 'Transition seamlessly from watching to coding. Hands-on practice solidifies theoretical knowledge.', icon: <Code2 className="w-8 h-8" /> },
                { title: 'Learn by Experimenting', desc: 'Play with edge cases, change inputs, and watch how algorithms adapt. Experimentation is key to deep learning.', icon: <Activity className="w-8 h-8" /> }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-udemy-dark-surface/80 backdrop-blur-sm p-8 rounded-3xl border border-udemy-purple/20 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-udemy-purple/10 flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-udemy-text dark:text-udemy-dark-text mb-4">{item.title}</h3>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section aria-label="Features" className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-4">Why AlgoBuddy?</h2>
              <p className="text-lg text-udemy-muted dark:text-udemy-dark-muted">
                A comprehensive suite of tools designed to take you from a beginner to a confident problem solver.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white dark:bg-udemy-dark-surface p-8 rounded-2xl border border-udemy-border/40 dark:border-udemy-dark-border/50 hover:border-udemy-purple/50 dark:hover:border-udemy-purple/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group">
                  <div className="w-14 h-14 rounded-xl bg-udemy-purple/5 dark:bg-udemy-purple/10 flex items-center justify-center mb-6 group-hover:bg-udemy-purple group-hover:text-white transition-all duration-300">
                    <div className="group-hover:scale-110 transition-transform group-hover:brightness-200">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-udemy-text dark:text-udemy-dark-text mb-3">{feature.title}</h3>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section aria-label="Platform Statistics" className="py-20 px-6 border-y border-udemy-purple/20 bg-udemy-purple/5 dark:bg-udemy-purple/5">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-udemy-dark-surface border border-udemy-purple/20 flex items-center justify-center text-udemy-purple shadow-sm">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-udemy-text dark:text-udemy-dark-text tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-udemy-muted dark:text-udemy-dark-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM JOURNEY */}
        <section aria-label="Roadmap" className="py-24 px-6 bg-white dark:bg-udemy-dark-surface/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-center text-udemy-text dark:text-udemy-dark-text mb-16">Platform Roadmap</h2>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-udemy-purple/50 before:via-udemy-purple/20 before:to-transparent">
              {timeline.map((item, idx) => (
                <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-udemy-bg dark:border-udemy-dark-bg bg-udemy-purple text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-udemy-dark-surface p-8 rounded-2xl border border-udemy-border/40 dark:border-udemy-dark-border/50 shadow-md hover:shadow-xl hover:border-udemy-purple/50 transition-all duration-300">
                    <span className="text-udemy-purple dark:text-udemy-purple-light font-bold text-sm tracking-wide uppercase mb-3 block">{item.year}</span>
                    <h3 className="text-2xl font-bold text-udemy-text dark:text-udemy-dark-text mb-3">{item.title}</h3>
                    <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY SECTION */}
        <section aria-label="Community" className="py-24 px-6 relative z-10 border-t border-udemy-border/50 dark:border-udemy-dark-border/50">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-br from-udemy-purple/10 to-pink-500/10 dark:from-udemy-purple/20 dark:to-pink-500/10 rounded-[3rem] p-8 md:p-16 border border-udemy-purple/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Heart className="w-64 h-64 text-udemy-purple" />
              </div>
              <div className="relative z-10 md:w-2/3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-udemy-dark-surface/50 text-udemy-text dark:text-udemy-dark-text font-medium text-sm mb-6 border border-udemy-border/50 backdrop-blur-sm">
                  <Github className="w-4 h-4" />
                  <span>Open Source</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">Built by the Community, <br/> For the Community</h2>
                <p className="text-lg md:text-xl text-udemy-text dark:text-udemy-dark-text/80 leading-relaxed mb-8">
                  AlgoBuddy thrives on open-source contributions. From participating in prestigious programs like GSSoC (GirlScript Summer of Code) to daily contributions from developers worldwide, our platform is constantly evolving thanks to our amazing community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-white dark:bg-udemy-dark-surface px-5 py-3 rounded-xl shadow-sm border border-udemy-border/50">
                    <GitPullRequest className="w-5 h-5 text-udemy-purple" />
                    <span className="font-semibold text-udemy-text dark:text-udemy-dark-text">Pull Requests Welcome</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-udemy-dark-surface px-5 py-3 rounded-xl shadow-sm border border-udemy-border/50">
                    <Users className="w-5 h-5 text-udemy-purple" />
                    <span className="font-semibold text-udemy-text dark:text-udemy-dark-text">GSSoC Partner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section aria-label="Call to Action" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-udemy-purple/5 dark:bg-udemy-purple/10 border-t border-udemy-purple/20"></div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">Ready to start your journey?</h2>
            <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted mb-10 max-w-2xl mx-auto">
              Join thousands of learners who are mastering data structures and algorithms the visual way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/visualizer" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-udemy-purple text-white font-bold hover:bg-udemy-purple-dark transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-udemy-purple/25 flex items-center justify-center gap-2">
                Explore Visualizers <MonitorPlay className="w-5 h-5" />
              </Link>
              <Link href="/practice" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-udemy-purple/20 dark:border-udemy-purple/30 bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text font-bold hover:border-udemy-purple dark:hover:border-udemy-purple transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm">
                Start Practicing <Code2 className="w-5 h-5 text-udemy-purple" />
              </Link>
              <a href="https://github.com/Prakitesh28/AlgoBuddy" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-udemy-border dark:border-udemy-dark-border bg-transparent text-udemy-text dark:text-udemy-dark-text font-bold hover:bg-udemy-border/50 dark:hover:bg-udemy-dark-border/50 transition-all duration-300 flex items-center justify-center gap-2">
                Join Community <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default AboutSection;
