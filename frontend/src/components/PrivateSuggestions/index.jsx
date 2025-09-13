import { useEffect, useMemo, useRef, useState } from 'react'
import { http } from '../../services/http.js'
import { meetingApi } from '../../services/meetingApi.js'
import './PrivateSuggestions.scss'

const seedSuggestions = [
  { title: 'Ask about current medications (name & dose)', conf: 92, hint: 'Clarify drug interactions' },
  { title: 'Confirm smoking history: last cigarette?', conf: 85, hint: 'Risk factor for premium' },
  { title: 'Ask about recent hospitalizations', conf: 70, hint: 'Identify recent serious events' },
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildSuggestion(nextId) {
  const base = randomItem(seedSuggestions)
  const jitter = Math.max(50, Math.min(99, Math.round(base.conf + (Math.random() * 20 - 10))))
  return { id: nextId, title: base.title, conf: jitter, hint: base.hint, ts: Date.now() }
}

function PrivateSuggestions({ 
  showLive = true, 
  showProjection = true, 
  showHeader = true, 
  showList = true,
  transcript = '',
  patientInfo = null,
  meetingId = null,
  isAIMode = false
}) {
  const [items, setItems] = useState(() => [
    { id: 1, ...seedSuggestions[0], conf: 92, ts: Date.now() - 20000 },
    { id: 2, ...seedSuggestions[1], conf: 85, ts: Date.now() - 15000 },
    { id: 3, ...seedSuggestions[2], conf: 70, ts: Date.now() - 10000 },
  ])
  const nextIdRef = useRef(4)
  const liveEveryMs = 4000
  const [editingId, setEditingId] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Generate AI suggestions when transcript changes
  useEffect(() => {
    if (isAIMode && transcript && transcript.length > 50) {
      generateAISuggestions()
    }
  }, [transcript, isAIMode])

  const generateAISuggestions = async () => {
    if (isGeneratingAI) return
    
    setIsGeneratingAI(true)
    try {
      const response = await meetingApi.generateFollowUpQuestions(transcript, patientInfo, 0)
      
      if (response.success && response.data.questions) {
        const newSuggestions = response.data.questions.map((q, index) => ({
          id: `ai_${Date.now()}_${index}`,
          title: q.question,
          conf: Math.round(q.confidence * 100),
          hint: q.context || `Category: ${q.category}`,
          ts: Date.now(),
          category: q.category,
          priority: q.priority,
          isAI: true
        }))
        
        setAiSuggestions(prev => [...newSuggestions, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  useEffect(() => {
    if (editingId != null) return
    const t = setInterval(() => {
      const id = nextIdRef.current++
      setItems((prev) => [{ ...buildSuggestion(id) }, ...prev].slice(0, 20))
    }, liveEveryMs)
    return () => clearInterval(t)
  }, [editingId])

  const time = useMemo(() => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }), [])

  return (
    <aside className="private-suggestions">
      {/* {showHeader && (
        <div className="ps-header">
          <div>
            <div className="ps-title">Doctor Panel</div>
            <div className="ps-subtitle">Private • Doctor-only</div>
          </div>
          <DownloadReportButton />
        </div>
      )} */}

      {showLive && (
        <div className="ps-live">
          <span className="dot" /> Live suggestions (mock)
        </div>
      )}

      {showList && (
        <div className={`ps-list${editingId != null ? ' ps-list--locked' : ''}`}>
          {/* AI Suggestions */}
          {isAIMode && aiSuggestions.length > 0 && (
            <div className="ai-suggestions-section">
              <div className="ai-suggestions-header">
                <span className="ai-badge">AI Generated</span>
                {isGeneratingAI && <span className="generating-indicator">Generating...</span>}
              </div>
              {aiSuggestions.map((s) => (
                <SuggestionCard
                  key={s.id}
                  item={s}
                  onStartEdit={() => setEditingId(s.id)}
                  onEndEdit={() => setEditingId(null)}
                  onSave={(updatedTitle) => {
                    setAiSuggestions((prev) => prev.map((it) => it.id === s.id ? { ...it, title: updatedTitle } : it))
                  }}
                  onDismiss={() => {
                    setAiSuggestions((prev) => prev.filter((it) => it.id !== s.id))
                    if (editingId === s.id) setEditingId(null)
                  }}
                  onAccept={async () => {
                    await meetingApi.acceptSuggestion(s.id, s.title, s.conf, s.category)
                    setAiSuggestions((prev) => prev.filter((it) => it.id !== s.id))
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Regular Suggestions */}
          {items.map((s) => (
            <SuggestionCard
              key={s.id}
              item={s}
              onStartEdit={() => setEditingId(s.id)}
              onEndEdit={() => setEditingId(null)}
              onSave={(updatedTitle) => {
                setItems((prev) => prev.map((it) => it.id === s.id ? { ...it, title: updatedTitle } : it))
              }}
              onDismiss={() => {
                setItems((prev) => prev.filter((it) => it.id !== s.id))
                if (editingId === s.id) setEditingId(null)
              }}
            />
          ))}
        </div>
      )}

      {showProjection && (
        <div className="projection">
          <div className="proj-title">Premium Projection</div>
          <div className="proj-hint">If current facts are confirmed:</div>
          <div className="proj-card">
            <div className="proj-row"><span>Base</span><strong>₹1200</strong></div>
            <div className="proj-hint">Multiplier: 1.18x</div>
            <div className="proj-row"><span>Suggested Premium</span><strong className="proj-big">₹1416</strong></div>
            <div className="proj-actions">
              <button className="ps-btn ps-btn--primary ps-btn--block">Accept Premium</button>
              <button className="ps-btn ps-btn--block">Manual Review</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default PrivateSuggestions

function SuggestionCard({ item, onSave, onStartEdit, onEndEdit, onDismiss, onAccept }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [saving, setSaving] = useState(false)
  const time = useMemo(() => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }), [])
  const cardRef = useRef(null)
  const inputRef = useRef(null)

  async function submit() {
    focusCard()
    setSaving(true)
    try {
      await http.post('/suggestions', { id: item.id, title })
      onSave(title)
      setEditing(false)
      onEndEdit && onEndEdit()
    } catch (e) {
      // swallow for mock
    }
    setSaving(false)
  }

  function startEdit() {
    setEditing(true)
    onStartEdit && onStartEdit()
    // focus card and input next frame
    requestAnimationFrame(() => {
      cardRef.current && cardRef.current.focus({ preventScroll: false })
      inputRef.current && inputRef.current.focus()
      cardRef.current && cardRef.current.scrollIntoView({ block: 'nearest' })
    })
  }

  function cancel() {
    focusCard()
    setEditing(false)
    setTitle(item.title)
    onEndEdit && onEndEdit()
  }

  function focusCard() {
    if (cardRef.current) {
      cardRef.current.focus({ preventScroll: false })
      cardRef.current.scrollIntoView({ block: 'nearest' })
    }
  }

  return (
    <div className="ps-card" tabIndex={0} ref={cardRef}>
      <div className="ps-card__row">
        {editing ? (
          <input ref={inputRef} className="ps-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <div className="ps-card__title">{item.title}</div>
        )}
        <div className="ps-conf">{item.conf}% conf.</div>
      </div>
      <div className="ps-time">{time.format(new Date(item.ts))}</div>
      <div className="ps-hint">{item.hint}</div>
      <div className="ps-actions">
        <button 
          className="ps-btn ps-btn--primary" 
          onClick={() => { 
            focusCard(); 
            if (onAccept) {
              onAccept();
            } else {
              acceptSuggestion(item);
            }
          }}
        >
          Accept
        </button>
        <button className="ps-btn" onClick={() => { focusCard(); onDismiss && onDismiss() }}>Dismiss</button>
        {editing ? (
          <>
            <button className="ps-btn" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="ps-btn" onClick={cancel}>Cancel</button>
          </>
        ) : (
          <button className="ps-btn" onClick={startEdit}>Edit</button>
        )}
      </div>
    </div>
  )
}

const ACCEPTED_KEY = 'accepted_suggestions'

function readAccepted() {
  try {
    const raw = localStorage.getItem(ACCEPTED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (_) {
    return []
  }
}

function writeAccepted(list) {
  try { localStorage.setItem(ACCEPTED_KEY, JSON.stringify(list)) } catch (_) {}
}

function acceptSuggestion(item) {
  const current = readAccepted()
  const exists = current.some((x) => x.id === item.id)
  const next = exists ? current : [{ id: item.id, title: item.title, conf: item.conf, hint: item.hint, ts: item.ts }, ...current]
  writeAccepted(next)
}

function DownloadReportButton() {
  const [loading, setLoading] = useState(false)

  async function onClick() {
    const payload = readAccepted()
    if (!payload.length) return
    setLoading(true)
    try {
      await http.post('/reports', { suggestions: payload })
      localStorage.removeItem(ACCEPTED_KEY)
    } catch (_) {
      // ignore for mock
    }
    setLoading(false)
  }

  return (
    <button className="ps-btn" onClick={onClick} disabled={loading} title="Send accepted suggestions">
      {loading ? 'Sending…' : 'Download Report'}
    </button>
  )
}


