import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpenCheck, Target, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Master Your Exams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">PrepWise AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          The ultimate smart study planner powered by AI. Generate personalized, actionable schedules to conquer any subject.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 gap-2">
              Start Planning Now <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 w-14 h-14 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Planning</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Tell us your subject, topics, and exam date. Our advanced AI creates a day-by-day roadmap tailored for you.
          </p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 hover:shadow-md transition-shadow">
          <div className="bg-cyan-100 dark:bg-cyan-900/50 w-14 h-14 rounded-xl flex items-center justify-center">
            <Target className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stay on Target</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Difficult topics are prioritized. Revision days are built-in. Never cram for an exam again.
          </p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 dark:bg-purple-900/50 w-14 h-14 rounded-xl flex items-center justify-center">
            <BookOpenCheck className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manage All Plans</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Save your study schedules, edit them as things change, and easily keep track of multiple exams at once.
          </p>
        </div>
      </div>
    </div>
  );
}
