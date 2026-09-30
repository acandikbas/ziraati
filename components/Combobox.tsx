'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

/** Türkçe karakterleri ve büyük/küçük harfi yok sayar: "istanbul" → İstanbul, "cankaya" → Çankaya. */
export function normalizeTr(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .trim();
}

/**
 * Yazarak aranabilen seçim kutusu. Yalnızca listedeki bir değer seçilebilir;
 * seçilen değer `name` adlı gizli alanla forma gönderilir.
 */
export function Combobox({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const listId = `${id}-liste`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Dışarıdan değer değişirse (ör. il değişince ilçe sıfırlanır) kutudaki yazı da güncellenir
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setText(value);
  }

  const filtered = useMemo(() => {
    const q = normalizeTr(text);
    if (!q || (value && q === normalizeTr(value))) return options;
    const starts: string[] = [];
    const contains: string[] = [];
    for (const o of options) {
      const n = normalizeTr(o);
      if (n.startsWith(q)) starts.push(o);
      else if (n.includes(q)) contains.push(o);
    }
    return [...starts, ...contains];
  }, [text, value, options]);

  // Yazılan metin listedeki bir değerle birebir eşleşmiyorsa form gönderilemez
  useEffect(() => {
    const valid = value !== '' && normalizeTr(text) === normalizeTr(value);
    inputRef.current?.setCustomValidity(valid ? '' : `Lütfen listeden bir ${label.toLocaleLowerCase('tr')} seçin.`);
  }, [text, value, label]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  function choose(option: string) {
    onChange(option);
    setText(option);
    setOpen(false);
  }

  function onBlur() {
    setOpen(false);
    // Tam adı yazıp listeden seçmeden çıktıysa ("konya") otomatik seç
    const exact = options.find(o => normalizeTr(o) === normalizeTr(text));
    if (exact) choose(exact);
    else if (!text.trim()) onChange('');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault(); // formu göndermek yerine seçimi yap
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  const showList = open && !disabled;
  return (
    <div className="relative flex flex-col gap-1 text-sm font-semibold text-gray-800">
      <label htmlFor={id}>{label}</label>
      <input type="hidden" name={name} value={value} />
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && filtered[active] ? `${id}-${active}` : undefined}
        autoComplete={autoComplete ?? 'off'}
        required
        disabled={disabled}
        placeholder={placeholder}
        value={text}
        onChange={e => {
          const t = e.target.value;
          setText(t);
          setActive(0);
          setOpen(true);
          // Tam ad yazıldıysa (veya tarayıcı otomatik doldurduysa) seçilmiş say; değilse önceki seçim geçersizleşir
          const exact = options.find(o => normalizeTr(o) === normalizeTr(t));
          if (exact) { if (exact !== value) onChange(exact); } else if (value) onChange('');
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal disabled:bg-gray-100"
      />
      {showList && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 font-normal shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-500">Sonuç bulunamadı</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={o}
                id={`${id}-${i}`}
                data-index={i}
                role="option"
                aria-selected={o === value}
                // mousedown: input'un blur'undan önce seçimi yakalar
                onMouseDown={e => { e.preventDefault(); choose(o); }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-2 ${i === active ? 'bg-green-50 text-green-900' : ''} ${o === value ? 'font-semibold' : ''}`}
              >
                {o}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
