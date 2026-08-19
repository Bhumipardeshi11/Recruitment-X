import React, { useState } from 'react';
import {
  UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw,
  Layers, Briefcase, GraduationCap, Code2, Award, Database, Zap, ArrowRight
} from 'lucide-react';
import { ResumeService } from '../services/api';

export const ResumeUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [parsedDataResult, setParsedDataResult] = useState<any>(null);

  const validateFile = (file: File): boolean => {
    setErrorMsg('');
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExts = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExts.includes(ext)) {
      setErrorMsg('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      return false;
    }
    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadAndParse = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMsg('');
    setUploadProgress('Uploading file to server...');

    try {
      setTimeout(() => setUploadProgress('Extracting raw text from document...'), 400);
      setTimeout(() => setUploadProgress('Identifying Skills, Experience, Education, Projects & Certifications...'), 800);
      setTimeout(() => setUploadProgress('Saving structured data to PostgreSQL via Prisma ORM...'), 1200);

      const res = await ResumeService.uploadResumeFile(selectedFile);

      if (res.success && res.data) {
        setParsedDataResult(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to upload and parse resume file.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> PDF & DOCX Resume Parser Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white font-outfit">
              Upload & Extract <span className="glow-text">Structured Resume Data</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Upload your PDF or DOCX resume file. Our NLP service automatically extracts raw text, identifies section boundaries (Skills, Experience, Education, Projects, Certifications), and persists structured JSON records into PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              Upload PDF or DOCX Document
            </h2>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/40'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-3 block">
                <FileText className={`w-12 h-12 mx-auto ${selectedFile ? 'text-emerald-400' : 'text-indigo-400'}`} />
                <div>
                  {selectedFile ? (
                    <p className="text-sm font-bold text-emerald-300 truncate max-w-xs mx-auto">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-200">
                        Drag and drop your resume file here, or <span className="text-indigo-400 underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Supports PDF (.pdf) and Word (.docx) formats up to 10MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {uploading && (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {uploadProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUploadAndParse}
              disabled={!selectedFile || uploading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {uploading ? 'Processing File...' : 'Upload & Parse Resume to PostgreSQL'}
            </button>
          </div>
        </div>

        {/* Extracted Structured Sections Preview */}
        <div className="lg:col-span-6 space-y-6">
          {parsedDataResult ? (
            <div className="space-y-6">
              {/* Top Banner Status */}
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Successfully Parsed & Persisted!</h3>
                    <p className="text-xs text-slate-400">Saved in PostgreSQL table <code className="text-emerald-300">Resume</code> ID: {parsedDataResult.resume?.id}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30">
                  {parsedDataResult.atsAnalysis?.overallAtsScore}% ATS Score
                </span>
              </div>

              {/* 1. Extracted Skills */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Identified Skills ({parsedDataResult.parsedData?.skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedDataResult.parsedData?.skills?.map((s: any, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                      {s.name} <span className="text-[10px] text-slate-400">({s.category})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Extracted Experience */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> Identified Experience ({parsedDataResult.parsedData?.experience?.length || 0})
                </h3>
                <div className="space-y-3">
                  {parsedDataResult.parsedData?.experience?.map((exp: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-white">{exp.position} — <span className="text-indigo-300">{exp.company}</span></span>
                        <span className="text-[11px] text-slate-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      {exp.bulletPoints?.map((b: string, bIdx: number) => (
                        <p key={bIdx} className="text-xs text-slate-300 pl-2 border-l-2 border-indigo-500/40">{b}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Extracted Education */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" /> Identified Education ({parsedDataResult.parsedData?.education?.length || 0})
                </h3>
                <div className="space-y-2">
                  {parsedDataResult.parsedData?.education?.map((ed: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div>
                        <span className="font-bold text-white block">{ed.degree}</span>
                        <span className="text-slate-400">{ed.institution}</span>
                      </div>
                      <span className="font-mono text-slate-500">{ed.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3 my-auto min-h-[350px] flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-600 mb-1" />
              <h3 className="text-base font-bold text-slate-300 font-outfit">No Resume Parsed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload a PDF or DOCX file on the left to view extracted Skills, Education, Work Experience, Projects, and Certifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
