import { useState, useRef, useEffect } from 'react';

interface Option { value: string; label: string; }

interface Props {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
}

export default function CustomSelect({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    // Prevent page scroll on arrow keys and space
    if (['ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === ' ') {
        setOpen(o => !o);
        return;
    }
    if (e.key === 'Escape') {
        setOpen(false);
        return;
    }
    if (e.key === 'ArrowDown') {
        const idx = options.findIndex(o => o.value === value);
        if (idx < options.length - 1) onChange(options[idx + 1].value);
        return;
    }
    if (e.key === 'ArrowUp') {
        const idx = options.findIndex(o => o.value === value);
        if (idx > 0) onChange(options[idx - 1].value);
        return;
    }

    // Letter cycling
    if (e.key.length === 1) {
        const char = e.key.toLowerCase();
        const matches = options.filter(o => o.label.toLowerCase().startsWith(char));
        if (matches.length === 0) return;

        const currentMatchIdx = matches.findIndex(o => o.value === value);
        const nextMatch = matches[(currentMatchIdx + 1) % matches.length];
        onChange(nextMatch.value);
    }
    };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 120 }}>
      <div
        tabIndex={0}
        onKeyDown={handleKey}
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: 'white',
          cursor: 'pointer',
          fontSize: '1em',
          userSelect: 'none',
        }}
      >
        {selected?.label ?? ''}
      </div>
      {open && (
        <div style={{
          position: 'fixed',        // fixed instead of absolute to escape stacking context
          zIndex: 99999,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          width: ref.current?.getBoundingClientRect().width,
          left: ref.current?.getBoundingClientRect().left,
          top: ref.current?.getBoundingClientRect().bottom,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background: opt.value === value ? '#e8e8e8' : 'white',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.background = opt.value === value ? '#e8e8e8' : 'white')}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}