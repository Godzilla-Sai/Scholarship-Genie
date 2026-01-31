
import React, { useState, useEffect } from 'react';
import { Sparkles, GraduationCap, MapPin, BookOpen, Trophy, Send, RefreshCw, ChevronRight, ChevronLeft, ExternalLink, BrainCircuit } from 'lucide-react';
import { UserProfile, AnalysisResult } from './types';
import { analyzeScholarshipProfile } from './services/geminiService';
import StepIndicator from './components/StepIndicator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    gpa: '',
    major: '',
    educationLevel: 'High School Senior',
    location: '',
    financialNeed: 'medium',
    extracurriculars: '',
    background: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeScholarshipProfile(profile);
      setResult(data);
    } catch (err: any) {
      setError("The Genie's magic encountered a glitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setError(null);
  };

  const data = result ? [
    { name: 'Eligibility', value: result.eligibilityScore },
    { name: 'Gap', value: 100 - result.eligibilityScore }
  ] : [];

  const COLORS = ['#4f46e5', '#e2e8f0'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <Sparkles className="w-16 h-16 text-indigo-600 animate-pulse" />
          <BrainCircuit className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 sparkle-icon" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 mt-6 text-center">Consulting the Genie...</h2>
        <p className="text-slate-500 mt-2 text-center max-w-md">Scanning academic databases and web-wide scholarship listings to find your perfect match.</p>
        <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 animate-[loading_2s_infinite]" style={{ width: '40%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-slate-900">Scholarship Genie</h1>
          </div>
          {result && (
            <button 
              onClick={resetForm}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Check Your Eligibility</h2>
              <p className="text-slate-600">Provide your details and let our AI genie find scholarships you're actually qualified for.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
              <StepIndicator currentStep={step} totalSteps={4} />

              {/* Step 1: Basics */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Education Level</label>
                    <select 
                      name="educationLevel"
                      value={profile.educationLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option>High School Junior</option>
                      <option>High School Senior</option>
                      <option>Undergraduate Student</option>
                      <option>Graduate Student</option>
                      <option>Doctorate/Post-Grad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location (City, State/Country)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="Los Angeles, CA"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current GPA</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="gpa"
                          value={profile.gpa}
                          onChange={handleChange}
                          placeholder="e.g. 3.8"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Major / Field of Study</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="major"
                          value={profile.major}
                          onChange={handleChange}
                          placeholder="Computer Science"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Financial Need Level</label>
                    <div className="flex gap-4">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setProfile(p => ({ ...p, financialNeed: level as any }))}
                          className={`flex-1 py-3 px-4 rounded-xl border capitalize transition-all ${
                            profile.financialNeed === level 
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Extracurriculars */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Extracurriculars & Achievements</label>
                    <div className="relative">
                      <Trophy className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <textarea 
                        name="extracurriculars"
                        value={profile.extracurriculars}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Sports, volunteering, clubs, awards..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Background */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Personal Background / Identity</label>
                    <p className="text-xs text-slate-500 mb-3">Mention your heritage, first-gen status, or unique life experiences. This helps find niche scholarships.</p>
                    <textarea 
                      name="background"
                      value={profile.background}
                      onChange={handleChange}
                      rows={5}
                      placeholder="e.g. First-generation college student, bilingual in Spanish, interested in environmental justice..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10">
                {step > 1 ? (
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Discover Magic
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Results View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Left Column: Analysis & Score */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Eligibility Score</h3>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={180}
                        endAngle={-180}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-serif font-black text-indigo-600">{result.eligibilityScore}%</span>
                    <span className="text-sm text-slate-500">Match Rank</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2 px-4">
                  Your profile strength is <span className="font-bold text-slate-900">{result.eligibilityScore >= 80 ? 'Exceptional' : result.eligibilityScore >= 60 ? 'Strong' : 'Developing'}</span>.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5" />
                  Genie's Summary
                </h3>
                <p className="text-indigo-50 leading-relaxed italic">
                  "{result.summary}"
                </p>
              </div>
            </div>

            {/* Right Column: Recommendations & Matches */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recommendations */}
              <section>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  Pro Tips for Success
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                      <p className="text-slate-700 text-sm leading-relaxed">{rec.replace(/^• |^\d\. /, '')}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Matches */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    Personalized Matches
                  </h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                    {result.scholarships.length} LIVE OPPORTUNITIES
                  </span>
                </div>
                
                <div className="space-y-4">
                  {result.scholarships.length > 0 ? (
                    result.scholarships.map((scholarship, i) => (
                      <div key={i} className="bg-white group p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{scholarship.title}</h4>
                            <p className="text-slate-500 text-sm mt-1">{scholarship.description}</p>
                          </div>
                          <a 
                            href={scholarship.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider">
                          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Est. {scholarship.amount}
                          </div>
                          <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Deadline: {scholarship.deadline}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
                      <p className="text-slate-500">No specific real-time links found. Try refining your background info for better search grounding.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-5 h-5" />
            <span className="font-serif font-bold text-slate-900">Scholarship Genie</span>
          </div>
          <p className="text-slate-400 text-sm text-center">
            Powered by Gemini 3 Flash. Built for students worldwide. 
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm transition-colors">Resources</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
