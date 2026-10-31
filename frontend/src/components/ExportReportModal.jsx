import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Map, 
  Sparkles,
  Share2
} from 'lucide-react';
import { exportReport } from '../api/client';

export default function ExportReportModal({ scanData, onClose }) {
  const [copied, setCopied] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!scanData) return;
    exportReport(scanData).then((res) => {
      setReportMarkdown(res.markdown || '');
      setLoading(false);
    });
  }, [scanData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoloom_afforestation_report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadGeoJson = () => {
    const geojson = scanData?.land_allocation?.candidate_parcels_geojson;
    if (!geojson) return;
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoloom_candidate_parcels_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-forest-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-forest-deep via-forest-medium to-forest-pine text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-forest-mint" />
            <div>
              <h2 className="text-lg font-bold">Afforestation Dossier Export</h2>
              <p className="text-xs text-forest-pale">Certified Geospatial & Species Allocation Summary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 font-mono text-xs text-slate-800 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Generating dossier from satellite telemetry...
            </div>
          ) : (
            <pre className="whitespace-pre-wrap bg-white p-4 rounded-2xl border border-slate-200 shadow-sm leading-relaxed">
              {reportMarkdown}
            </pre>
          )}
        </div>

        {/* Actions Bar */}
        <div className="p-4 bg-white border-t border-forest-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-deep text-xs font-semibold border border-forest-200 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadGeoJson}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-deep text-xs font-semibold border border-forest-200 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Export GeoJSON</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest-deep hover:bg-forest-medium text-white text-xs font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-forest-mint" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
