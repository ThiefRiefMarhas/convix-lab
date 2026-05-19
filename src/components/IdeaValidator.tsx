import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Mic, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, TrendingUp, ShieldAlert, BarChart3, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface AnalysisResult {
  analysis: string;
}

export default function IdeaValidator() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  } as any);

  const handleAnalyze = async () => {
    if (!prompt && !file) {
      setError("Please provide an idea or a file to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let analysisData;
      
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload-analysis', {
          method: 'POST',
          body: formData,
        });
        analysisData = await response.json();
      } else {
        const response = await fetch('/api/analyze-market', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: prompt }),
        });
        analysisData = await response.json();
      }

      setResult(analysisData);
      
      // Save to Supabase if logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('analyses').insert([{
          user_id: session.user.id,
          prompt: prompt || 'File Analysis',
          result: analysisData.analysis,
          file_name: file?.name
        }]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach the validation engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Logic for speech stop would go here
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Logic for speech start
      if ('webkitSpeechRecognition' in window) {
        // @ts-ignore
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setPrompt(prev => prev + " " + transcript);
          setIsRecording(false);
        };
        recognition.start();
      } else {
        alert("Speech recognition not supported in this browser.");
        setIsRecording(false);
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-white" id="validator-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 mb-4">Validate Your Move</h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Upload your pitch deck, describe your idea, or speak to our AI. We'll cross-reference the digital landscape to find real gaps.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Input Side */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#f5f2ee] rounded-3xl p-8 border border-neutral-200/50 shadow-sm">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3 ml-1">Describe your idea</label>
                  <div className="relative">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. AI-powered editor for boutique PR agencies..."
                      className="w-full h-40 bg-white border border-neutral-200 rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#ef4d23]/20 focus:border-[#ef4d23] resize-none"
                    />
                    <button 
                      onClick={toggleRecording}
                      className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all ${
                        isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                </div>

                <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-[#ef4d23] bg-[#ef4d23]/5' : 'border-neutral-200 hover:border-[#ef4d23]/50'
                }`}>
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex items-center justify-between text-left bg-white p-3 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500">
                          <Upload size={16} />
                        </div>
                        <span className="text-sm font-medium text-neutral-900 truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-neutral-400 shadow-sm">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900">Upload PDF or Image</p>
                        <p className="text-[12px] text-neutral-500 mt-1">Drag & drop or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-[#0b0f1a] text-white rounded-full py-4 px-8 font-semibold flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing Landscape...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Validate Idea
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Results Side */}
          <div className="lg:col-span-3 min-h-[500px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Verdict Card */}
                  <div className={`p-8 rounded-3xl border-2 ${
                    result.analysis.includes('GAP FOUND') 
                      ? 'bg-emerald-50 border-emerald-100' 
                      : 'bg-amber-50 border-amber-100'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Verdict & Market Analysis</h3>
                        <div className="flex gap-4 mt-6">
                           <div className="flex items-center gap-2 text-neutral-700 bg-white/50 px-4 py-2 rounded-full text-sm font-semibold">
                              <TrendingUp size={16} className="text-emerald-500" />
                              Gap Identified
                           </div>
                           <div className="flex items-center gap-2 text-neutral-700 bg-white/50 px-4 py-2 rounded-full text-sm font-semibold">
                              <ShieldAlert size={16} className="text-amber-500" />
                              Medium Risk
                           </div>
                        </div>
                      </div>
                      {result.analysis.includes('GAP FOUND') ? (
                        <CheckCircle2 size={40} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={40} className="text-amber-500" />
                      )}
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-2 text-neutral-900 mb-6">
                      <BarChart3 size={20} />
                      <h4 className="font-bold uppercase tracking-widest text-[12px]">Intelligence Report</h4>
                    </div>
                    <div className="prose prose-neutral max-w-none prose-p:text-[15px] prose-p:leading-relaxed text-neutral-700 whitespace-pre-wrap">
                      {result.analysis}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-[#ef4d23] rounded-3xl p-8 text-white">
                    <h5 className="text-xl font-bold mb-2">Next Steps for Branding</h5>
                    <p className="text-white/80 mb-6">Our engine recommends focusing on niche positioning. Would you like to generate a brand identity kit?</p>
                    <button className="bg-white text-[#ef4d23] px-6 py-3 rounded-full font-bold shadow-lg hover:bg-neutral-50 transition-colors">
                      Start Branding Process
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border-2 border-dashed border-neutral-100 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                    <Send size={32} />
                  </div>
                  <p className="font-semibold text-neutral-500">Awaiting your idea...</p>
                  <p className="text-sm max-w-[200px] mt-2">Submit your prompt or upload a source file to start the analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
