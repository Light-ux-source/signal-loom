'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Signal = {
  id: number | string;
  source: string;
  handle: string;
  time: string;
  title: string;
  summary: string;
  tag: string;
  confidence: number;
  momentum: string;
  verified: boolean;
};

const initialKeywords = [
  { label: '人工智能体', count: 18, active: true },
  { label: '模型路由', count: 9, active: true },
  { label: '苹果智能', count: 6, active: false },
];

const initialSignals: Signal[] = [
  {
    id: 1,
    source: 'X',
    handle: '@swyx',
    time: '8 min ago',
    title: '智能体界面正在成为新的操作系统',
    summary: '一组高密度讨论梳理了产品从聊天优先走向工具调用的变化，并提出了三个值得持续观察的模式。',
    tag: '人工智能体',
    confidence: 92,
    momentum: '+184%',
    verified: true,
  },
  {
    id: 2,
    source: 'X',
    handle: '@OpenRouterAI',
    time: '21 min ago',
    title: '新的模型路由基准测试日请求量超过一百万',
    summary: '多个独立账号提到了同一份更新说明。流量数据暂标为高可信度，但仍等待一手来源确认。',
    tag: '模型路由',
    confidence: 84,
    momentum: '+72%',
    verified: true,
  },
  {
    id: 3,
    source: 'X',
    handle: '@latent_space_',
    time: '43 min ago',
    title: '小团队正在悄悄用智能体替代内部仪表盘',
    summary: '过去一小时有五个账号提到类似做法，叙事热度较高，但目前仍主要是个案证据。',
    tag: '人工智能体',
    confidence: 67,
    momentum: '+39%',
    verified: false,
  },
];

export default function Home() {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [signals, setSignals] = useState(initialSignals);
  const [activeKeyword, setActiveKeyword] = useState('全部热点');
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('刚刚');
  const [showComposer, setShowComposer] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [scanError, setScanError] = useState('');
  const [notificationCount, setNotificationCount] = useState(12);
  const [notice, setNotice] = useState('');
  const knownSignalIds = useRef(new Set<string | number>(initialSignals.map((signal) => signal.id)));

  const visibleSignals = useMemo(() => signals.filter((signal) => {
    const matchesKeyword = activeKeyword === '全部热点' || signal.tag === activeKeyword;
    const matchesQuery = `${signal.title} ${signal.summary} ${signal.handle}`.toLowerCase().includes(query.toLowerCase());
    return matchesKeyword && matchesQuery;
  }), [activeKeyword, query, signals]);

  const runScan = useCallback(async (keyword: string) => {
    setIsScanning(true);
    setScanError('');
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const payload = await response.json() as { signals?: Array<{ id: string; author: string; createdAt: string; title: string; summary: string; confidence: number; momentum: string }>; error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Scan failed');
      if (payload.signals) {
        const nextSignals = payload.signals.map((signal) => ({
          id: signal.id,
          source: 'X',
          handle: `@${signal.author.replace(/^@/, '')}`,
          time: new Date(signal.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
          title: signal.title,
          summary: signal.summary,
          tag: keyword,
          confidence: signal.confidence,
          momentum: signal.momentum,
          verified: signal.confidence >= 80,
        }));
        const freshSignals = nextSignals.filter((signal) => !knownSignalIds.current.has(signal.id));
        nextSignals.forEach((signal) => knownSignalIds.current.add(signal.id));
        setSignals((current) => {
          const existingIds = new Set<string | number>(nextSignals.map((signal) => signal.id));
          return [...nextSignals, ...current.filter((signal) => !existingIds.has(signal.id))];
        });
        if (freshSignals.length > 0) {
          setNotificationCount((count) => count + freshSignals.length);
          const message = `${keyword} 发现 ${freshSignals.length} 条中文新热点`;
          setNotice(message);
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Signal Loom 新热点', { body: message });
        }
      }
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Scan failed');
    } finally {
      setIsScanning(false);
      setLastScan('刚刚');
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      keywords.filter((keyword) => keyword.active).forEach((keyword) => void runScan(keyword.label));
    }, 30 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [keywords, runScan]);

  function addKeyword() {
    const label = newKeyword.trim();
    if (!label || keywords.some((keyword) => keyword.label.toLowerCase() === label.toLowerCase())) return;
    setKeywords((current) => [...current, { label, count: 0, active: true }]);
    setActiveKeyword(label);
    setNewKeyword('');
    setShowComposer(false);
    if ('Notification' in window && Notification.permission === 'default') void Notification.requestPermission();
    void runScan(label);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
          <div><strong>signal loom</strong><small>中文热点监控</small></div>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <button className="nav-item active"><span className="nav-icon">◈</span>收件箱 <b>{notificationCount}</b></button>
        </nav>

        <div className="keyword-heading"><span>MONITORING</span><button onClick={() => setShowComposer(true)} aria-label="Add keyword">+</button></div>
        <div className="keyword-list">
          <button className={`keyword-item ${activeKeyword === '全部热点' ? 'selected' : ''}`} onClick={() => setActiveKeyword('全部热点')}><span className="keyword-dot all" />全部热点 <em>{signals.length}</em></button>
          {keywords.map((keyword) => (
            <button className={`keyword-item ${activeKeyword === keyword.label ? 'selected' : ''}`} key={keyword.label} onClick={() => setActiveKeyword(keyword.label)}>
              <span className={`keyword-dot ${keyword.active ? 'live' : 'paused'}`} />{keyword.label}<em>{keyword.count}</em>
            </button>
          ))}
        </div>

        <div className="sidebar-footer"><div className="ai-status"><span className="status-pulse" />AI 服务已连接</div><button className="settings-link">设置 <span>↗</span></button></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>收件箱</span><i>/</i><strong>{activeKeyword}</strong></div>
          <div className="top-actions"><span className="scan-note"><span className="live-indicator" />上次扫描 {lastScan}</span><button className="icon-button" aria-label="Notifications" onClick={() => setNotificationCount(0)}>♢{notificationCount > 0 && <span className="notification-dot" />}</button><div className="avatar">ML</div></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading"><div><p className="eyebrow">2026 年 9 月 17 日 星期四</p><h1>热点收件箱 <span>↗</span></h1><p className="lede">互联网很嘈杂，你只需要真正重要的信号。</p></div><button className={`scan-button ${isScanning ? 'scanning' : ''}`} onClick={() => void runScan(activeKeyword === '全部热点' ? '人工智能体' : activeKeyword)}><span>◉</span>{isScanning ? '扫描中...' : '立即扫描'}</button></div>

          <div className="stats-strip"><div><span className="stat-label">未读热点</span><strong>{notificationCount}</strong><small className="positive">自动提醒已开启</small></div><div><span className="stat-label">平均可信度</span><strong>81<span className="unit">%</span></strong><small>中文热点</small></div><div><span className="stat-label">下次自动扫描</span><strong>30<span className="unit"> 分钟</span></strong><small>持续监控中</small></div><div className="filter-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选中文热点..." aria-label="筛选中文热点" /></div></div>

          <div className="feed-toolbar"><div><strong>{visibleSignals.length} 条热点</strong><span>按热度排序</span></div></div>
          {notice && <div className="scan-notice" role="status">● {notice}<button onClick={() => setNotice('')} aria-label="关闭提示">×</button></div>}
          {scanError && <div className="scan-error" role="alert">扫描失败：{scanError}</div>}
          <div className="signal-feed">
            {visibleSignals.map((signal, index) => (
              <article className={`signal-card ${index === 0 ? 'featured' : ''}`} key={signal.id}>
                <div className="signal-rail"><span className={`signal-number ${signal.verified ? 'unread' : ''}`}>{String(index + 1).padStart(2, '0')}</span><span className="rail-line" /></div>
                <div className="signal-main"><div className="signal-meta"><span className="source-badge">{signal.source}</span><span>{signal.handle}</span><span>·</span><span>{signal.time}</span><span className="topic-tag">{signal.tag}</span></div><h2>{signal.title}</h2><p>{signal.summary}</p><div className="signal-bottom"><span className={`confidence ${signal.confidence > 80 ? 'high' : 'medium'}`}><i />{signal.confidence}% 可信度</span><span className="evidence">{signal.verified ? 'AI 已核验' : '证据仍不足'}</span></div></div>
                <div className="momentum"><span>热度趋势</span><strong>{signal.momentum}</strong><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
              </article>
            ))}
            {visibleSignals.length === 0 && <div className="empty-state">暂时没有符合条件的中文热点。</div>}
          </div>
          <div className="feed-footer"><span>显示最新热点</span><button>加载更早热点 <span>↓</span></button></div>
        </div>
      </section>

      {showComposer && <div className="modal-backdrop" onClick={() => setShowComposer(false)}><form className="composer" onSubmit={(event) => { event.preventDefault(); addKeyword(); }} onClick={(event) => event.stopPropagation()}><p className="eyebrow">新增监控</p><h2>你想关注什么？</h2><input autoFocus value={newKeyword} onChange={(event) => setNewKeyword(event.target.value)} placeholder="例如：合成媒体" /><div><button type="button" onClick={() => setShowComposer(false)}>取消</button><button className="confirm-button" type="submit">开始监控</button></div></form></div>}
    </main>
  );
}
