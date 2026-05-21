import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Search, Activity, ExternalLink, Globe, ZoomIn, ZoomOut, Maximize2, X, Users, Lightbulb, Target, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ResearchSource } from '../../services/api';

interface ResearchCanvasProps {
  key?: string;
  sources: ResearchSource[];
  isStreaming: boolean;
  ideaTitle?: string;
}

const PHASE_CONFIG = [
  { id: 1, name: 'Competitors', color: '#818cf8', query: 'Phase 1' },
  { id: 2, name: 'Market Gap', color: '#fbbf24', query: 'Phase 2' },
  { id: 3, name: 'Community', color: '#34d399', query: 'Phase 3' },
  { id: 4, name: 'Synthesis', color: '#fb923c', query: 'Phase 4' },
];

const getPhaseIcon = (id?: number) => {
  if (id === 1) return <Target size={12} />;
  if (id === 2) return <Search size={12} />;
  if (id === 3) return <Users size={12} />;
  return <Lightbulb size={12} />;
};

interface BPNode {
  id: string;
  x: number;
  y: number;
  type: 'idea' | 'phase' | 'source';
  label: string;
  color: string;
  phaseId?: number;
  source?: ResearchSource;
}

interface BPEdge {
  from: string;
  fromPin: 'right';
  to: string;
  toPin: 'left';
  color: string;
}

export default function ResearchCanvas({ sources, isStreaming, ideaTitle }: ResearchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.65);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [selectedSource, setSelectedSource] = useState<ResearchSource | null>(null);

  // Drag state
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [dragNode, setDragNode] = useState<{ id: string; startX: number; startY: number } | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPhase, setFilterPhase] = useState<number | 'all'>('all');

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter(s => {
      const matchesSearch = !searchQuery || 
        (s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.snippet?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesPhase = true;
      if (filterPhase !== 'all') {
        const phaseStr = `Phase ${filterPhase}`;
        matchesPhase = s.search_query?.includes(phaseStr) ?? false;
        // Fallback for Phase 1 if no phase is specified
        if (filterPhase === 1 && !s.search_query) matchesPhase = true;
      }

      return matchesSearch && matchesPhase;
    });
  }, [sources, searchQuery, filterPhase]);

  // Group sources by phase
  const groupedSources = useMemo(() => {
    const groups: Record<number, ResearchSource[]> = { 1: [], 2: [], 3: [], 4: [] };
    for (const s of filteredSources) {
      if (s.search_query?.includes('Phase 1')) groups[1].push(s);
      else if (s.search_query?.includes('Phase 2')) groups[2].push(s);
      else if (s.search_query?.includes('Phase 3')) groups[3].push(s);
      else if (s.search_query?.includes('Phase 4')) groups[4].push(s);
      else groups[1].push(s);
    }
    return groups;
  }, [sources]);

  // Build Blueprint node layout (left-to-right flow)
  const { nodes, edges } = useMemo(() => {
    const ns: BPNode[] = [];
    const es: BPEdge[] = [];

    // Column 1: Idea node (left side)
    ns.push({ id: 'idea', x: 80, y: 400, type: 'idea', label: ideaTitle || 'Your Idea', color: '#ef4d23' });

    // Column 2: Phase nodes (middle)
    const phaseX = 400;
    const phaseSpacing = 300;
    const phaseStartY = 100;

    PHASE_CONFIG.forEach((phase, pi) => {
      const py = phaseStartY + pi * phaseSpacing;
      const phaseId = `phase-${phase.id}`;
      const count = groupedSources[phase.id]?.length || 0;

      ns.push({ id: phaseId, x: phaseX, y: py, type: 'phase', label: `${phase.name} (${count})`, color: phase.color, phaseId: phase.id });
      es.push({ from: 'idea', fromPin: 'right', to: phaseId, toPin: 'left', color: phase.color });

      // Column 3: Source nodes (right side) - Staggered 3-column grid layout to prevent overlap and spread the connections beautifully
      const srcList = (groupedSources[phase.id] || []).slice(0, 20);
      const cols = 3;
      const colWidth = 280; // card width is 240, so 40px horizontal gap
      const rowHeight = 78; // card height is 60, so 18px vertical gap
      
      const totalRows = Math.ceil(srcList.length / cols);
      const gridHeight = (totalRows - 1) * rowHeight;
      const gridStartY = py - gridHeight / 2;

      srcList.forEach((src, si) => {
        const colIndex = si % cols;
        const rowIndex = Math.floor(si / cols);
        
        const srcX = 750 + colIndex * colWidth;
        const srcY = gridStartY + rowIndex * rowHeight;
        
        const srcId = `src-${phase.id}-${si}`;
        ns.push({ 
          id: srcId, 
          x: srcX, 
          y: srcY, 
          type: 'source', 
          label: src.domain || src.title || 'Source', 
          color: phase.color, 
          phaseId: phase.id, 
          source: src 
        });
        es.push({ from: phaseId, fromPin: 'right', to: srcId, toPin: 'left', color: phase.color });
      });
    });

    return { nodes: ns, edges: es };
  }, [groupedSources, ideaTitle]);

  // Node dimensions
  const getNodeRect = (node: BPNode) => {
    if (node.type === 'idea') return { w: 220, h: 90 };
    if (node.type === 'phase') return { w: 200, h: 80 };
    return { w: 240, h: 60 }; // Source nodes are now wider cards
  };

  const getPinPos = (node: BPNode, pin: 'left' | 'right', offset: { x: number; y: number }) => {
    const rect = getNodeRect(node);
    const actualX = node.x + offset.x;
    const actualY = node.y + offset.y;
    return { x: pin === 'right' ? actualX + rect.w : actualX, y: actualY + rect.h / 2 };
  };

  const getCablePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = Math.abs(to.x - from.x) * 0.5;
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  };

  // Pan and Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const nodeEl = (e.target as HTMLElement).closest('.bp-node-interactive');
    if (nodeEl) {
      const id = nodeEl.getAttribute('data-id');
      if (id) {
        setDragNode({ id, startX: e.clientX, startY: e.clientY });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
      return;
    }
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragNode) {
      const dx = (e.clientX - dragNode.startX) / zoom;
      const dy = (e.clientY - dragNode.startY) / zoom;
      setNodeOffsets(prev => ({
        ...prev,
        [dragNode.id]: {
          x: (prev[dragNode.id]?.x || 0) + dx,
          y: (prev[dragNode.id]?.y || 0) + dy,
        }
      }));
      setDragNode({ id: dragNode.id, startX: e.clientX, startY: e.clientY });
      return;
    }
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  }, [isPanning, dragNode, zoom]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    setDragNode(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Cannot preventDefault on passive event listener, so we just zoom.
    setZoom(prev => Math.max(0.3, Math.min(2, prev - e.deltaY * 0.001)));
  }, []);

  const resetView = () => { 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.65); 
    setNodeOffsets({});
  };

  useEffect(() => {
    if (containerRef.current && nodes.length > 1) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2 - 450 * zoom, y: rect.height / 2 - 400 * zoom });
    }
  }, [nodes.length > 1]);

  const totalSources = sources.length;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--dash-canvas-bg)] rounded-2xl border border-neutral-200/60 dark:border-neutral-700/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-700/50 bg-[var(--dash-chat-bg)] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
            <Activity size={14} className="text-[#ef4d23]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Research Canvas</h3>
            <p className="text-[11px] text-neutral-400 font-medium">
              {totalSources} sources · {isStreaming ? <span className="text-[#ef4d23]">Scanning...</span> : 'Blueprint view'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors" title="Zoom in"><ZoomIn size={14} /></button>
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.15))} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors" title="Zoom out"><ZoomOut size={14} /></button>
          <button onClick={resetView} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors" title="Reset layout"><Maximize2 size={14} /></button>
        </div>
      </div>

      {/* Phase Legend */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-neutral-100 dark:border-neutral-700/50 bg-[var(--dash-chat-bg)] shrink-0 z-20">
        {PHASE_CONFIG.map(p => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">{p.name}</span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{groupedSources[p.id]?.length || 0}</span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 relative overflow-hidden bg-neutral-50 dark:bg-[#141420] select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : dragNode ? 'grabbing' : 'grab' }}
      >
        {/* Top UI Panel (Search & Filters) */}
        <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-auto">
          <div className="bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-[#333] rounded-lg shadow-lg flex items-center p-1 px-3">
            <Search size={14} className="text-neutral-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search sources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none w-48 py-1.5"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white ml-2">
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-[#333] rounded-lg shadow-lg flex items-center p-1">
            <Filter size={14} className="text-neutral-500 ml-2 mr-1" />
            <select 
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent border-none text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none py-1.5 pl-1 pr-2 cursor-pointer"
            >
              <option value="all">All Phases</option>
              {PHASE_CONFIG.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blueprint grid */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(140,140,180,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(140,140,180,0.12) 1px, transparent 1px),
              linear-gradient(rgba(140,140,180,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(140,140,180,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            transform: `translate(${pan.x % (100 * zoom)}px, ${pan.y % (100 * zoom)}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '200%', height: '200%',
          }}
        />

        {sources.length === 0 && !isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Search size={22} className="text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1">No research data yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 max-w-[240px]">Start an analysis to see your research visualized as a blueprint graph.</p>
          </div>
        ) : (
          <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: 2000, height: 1600, position: 'relative' }}>
            {/* Edges (Curved glowing cables) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              <defs>
                {PHASE_CONFIG.map(p => (
                  <linearGradient key={p.id} id={`cable-grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={p.color} stopOpacity="0.6" />
                    <stop offset="50%" stopColor={p.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={p.color} stopOpacity="0.4" />
                  </linearGradient>
                ))}
                <filter id="cable-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const fromOffset = nodeOffsets[fromNode.id] || { x: 0, y: 0 };
                const toOffset = nodeOffsets[toNode.id] || { x: 0, y: 0 };
                const from = getPinPos(fromNode, edge.fromPin, fromOffset);
                const to = getPinPos(toNode, edge.toPin, toOffset);
                const path = getCablePath(from, to);
                const phaseId = toNode.phaseId || fromNode.phaseId || 1;
                return (
                  <g key={i}>
                    <path d={path} fill="none" stroke={PHASE_CONFIG.find(p => p.id === phaseId)?.color || '#fff'} strokeWidth={toNode.type === 'source' ? 1.5 : 3} strokeOpacity={0.12} filter="url(#cable-glow)" />
                    <path d={path} fill="none" stroke={`url(#cable-grad-${phaseId})`} strokeWidth={toNode.type === 'source' ? 1.5 : 2.5} />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const rect = getNodeRect(node);
              const offset = nodeOffsets[node.id] || { x: 0, y: 0 };
              const actualX = node.x + offset.x;
              const actualY = node.y + offset.y;
              
              return (
                <div 
                  key={node.id} 
                  data-id={node.id}
                  className={`absolute bp-node-interactive cursor-grab active:cursor-grabbing hover:z-10`} 
                  style={{ left: actualX, top: actualY, width: rect.w, height: rect.h, zIndex: node.type === 'idea' ? 5 : node.type === 'phase' ? 4 : 2 }}
                >
                  
                  {/* IDEA NODE */}
                  {node.type === 'idea' && (
                    <div className="w-full h-full rounded-xl border border-[#ef4d23]/40 bg-orange-50 dark:bg-[#2a1a1a] shadow-lg shadow-[#ef4d23]/10 flex flex-col overflow-hidden pointer-events-none">
                      <div className="px-3 py-2 bg-[#ef4d23]/10 dark:bg-[#ef4d23]/20 border-b border-[#ef4d23]/20 dark:border-[#ef4d23]/30 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ef4d23]" />
                        <span className="text-[10px] font-bold text-[#ef4d23] uppercase tracking-wider">Input Idea</span>
                      </div>
                      <div className="flex-1 flex items-center px-3 py-1">
                        <span className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-tight">{node.label}</span>
                      </div>
                      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ef4d23] border-2 border-neutral-50 dark:border-[#141420] z-10" />
                    </div>
                  )}

                  {/* PHASE NODE */}
                  {node.type === 'phase' && (
                    <div className="w-full h-full rounded-xl border shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-[1.02] bg-white dark:bg-neutral-900 pointer-events-none" style={{ borderColor: node.color + '40', boxShadow: `0 4px 24px ${node.color}15` }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: node.color + '20', backgroundColor: node.color + '10' }}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: node.color }}>
                          {getPhaseIcon(node.phaseId)}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: node.color }}>{node.label}</span>
                      </div>
                      <div className="flex-1 flex items-center px-3 gap-2">
                        <Globe size={14} style={{ color: node.color }} className="opacity-60" />
                        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Research Agent Process</span>
                      </div>
                      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-neutral-50 dark:border-[#141420] z-10" style={{ backgroundColor: node.color }} />
                      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-neutral-50 dark:border-[#141420] z-10" style={{ backgroundColor: node.color }} />
                    </div>
                  )}

                  {/* SOURCE NODE (CARD) */}
                  {node.type === 'source' && (
                    <div 
                      className="w-full h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-neutral-800 flex flex-col overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing group"
                      style={{ borderColor: node.color + '40' }}
                      onClick={(e) => { e.stopPropagation(); node.source && setSelectedSource(node.source); }}
                    >
                      <div className="px-2.5 py-1.5 border-b border-neutral-100 dark:border-neutral-700/50 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900/50 pointer-events-none">
                        <img src={`https://www.google.com/s2/favicons?domain=${node.label}&sz=16`} alt="" className="w-3.5 h-3.5 rounded-sm shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 truncate uppercase">{node.label}</span>
                      </div>
                      <div className="px-2.5 py-1.5 flex-1 pointer-events-none">
                         <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-tight">
                           {node.source?.title || 'External Source'}
                         </span>
                      </div>
                      
                      {/* Left connection dot */}
                      <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-neutral-50 dark:border-[#141420] z-10 pointer-events-none" style={{ backgroundColor: node.color }} />
                      
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="bg-neutral-800 text-white text-[9px] px-2 py-1 rounded-md font-medium shadow-lg flex items-center gap-1">
                           <ExternalLink size={10} /> View details
                         </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Source detail slide-over */}
      <AnimatePresence>
        {selectedSource && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 rounded-t-2xl shadow-2xl p-4 z-30 max-h-[45%] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Globe size={14} className="text-neutral-400 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-500 uppercase truncate">{selectedSource.domain}</span>
              </div>
              <button onClick={() => setSelectedSource(null)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400"><X size={14} /></button>
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">{selectedSource.title || 'Untitled'}</h4>
            {selectedSource.snippet && <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">{selectedSource.snippet}</p>}
            <a href={selectedSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ef4d23] hover:text-[#ff7a55]">
              <ExternalLink size={12} /> Open source
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
