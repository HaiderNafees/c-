import { useState } from 'react'

/* ============================================================
   CodeBlock
   Dark syntax-highlighted code block with a copy button.
   - SF Mono / Consolas font
   - Rounded-xl, proper padding
   - Works in Light & Dark theme (always dark code area)
   - One-click copy with "Copied!" feedback

   Props: code (string), language (string, optional)
   ============================================================ */

// C++ keyword set for basic highlighting
const KEYWORDS = new Set([
  'int', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
  'case', 'break', 'continue', 'class', 'struct', 'public', 'private',
  'protected', 'const', 'static', 'virtual', 'override', 'new', 'delete',
  'this', 'nullptr', 'true', 'false', 'using', 'namespace', 'template',
  'typename', 'auto', 'enum', 'float', 'double', 'char', 'bool', 'string',
  'long', 'short', 'unsigned', 'signed', 'try', 'catch', 'throw', 'sizeof',
])

const COLORS = {
  keyword: '#ff7b72',
  string: '#a5d6ff',
  comment: '#8b949e',
  number: '#79c0ff',
  function: '#d2a8ff',
  preprocessor: '#ffa657',
  plain: '#e6edf3',
}

/**
 * Lightweight C++ syntax highlighter.
 * Returns an array of {type, value} tokens for a single line.
 */
function tokenizeLine(line) {
  const tokens = []
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    // Line comment
    if (ch === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'comment', value: line.slice(i) })
      break
    }

    // String literal
    if (ch === '"') {
      let j = i + 1
      while (j < line.length && line[j] !== '"') {
        if (line[j] === '\\') j++
        j++
      }
      j++
      tokens.push({ type: 'string', value: line.slice(i, j) })
      i = j
      continue
    }

    // Char literal
    if (ch === "'") {
      let j = i + 1
      if (line[j] === '\\') j++
      j += 2
      tokens.push({ type: 'string', value: line.slice(i, j) })
      i = j
      continue
    }

    // Preprocessor directive
    if (ch === '#' && line.slice(0, i).trim() === '') {
      tokens.push({ type: 'preprocessor', value: line.slice(i) })
      break
    }

    // Number
    if (/[0-9]/.test(ch)) {
      let j = i
      while (j < line.length && /[0-9.a-fA-FxX]/.test(line[j])) j++
      tokens.push({ type: 'number', value: line.slice(i, j) })
      i = j
      continue
    }

    // Identifier / keyword / function call
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++
      const word = line.slice(i, j)

      // Check if it's a function call (followed by '(')
      let k = j
      while (k < line.length && line[k] === ' ') k++
      const isFuncCall = line[k] === '('

      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word })
      } else if (isFuncCall) {
        tokens.push({ type: 'function', value: word })
      } else {
        tokens.push({ type: 'plain', value: word })
      }
      i = j
      continue
    }

    // Everything else (operators, punctuation, whitespace)
    tokens.push({ type: 'plain', value: ch })
    i++
  }

  return tokens
}

export default function CodeBlock({ code, language = 'cpp' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      /* clipboard may be unavailable */
    }
  }

  const lines = code.split('\n')

  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{
        background: '#0d1117',
        border: '1px solid #30363d',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: '#161b22',
          borderBottom: '1px solid #30363d',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: '#ff5f56' }}
            aria-hidden="true"
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: '#ffbd2e' }}
            aria-hidden="true"
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: '#27c93f' }}
            aria-hidden="true"
          />
          <span
            className="ml-2 text-xs font-mono"
            style={{ color: '#8b949e' }}
          >
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200"
          style={{
            background: copied ? '#238636' : '#21262d',
            color: copied ? '#ffffff' : '#c9d1d9',
            border: '1px solid #30363d',
          }}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </span>
          ) : (
            'Copy'
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        className="p-4 overflow-x-auto text-sm leading-relaxed"
        style={{
          margin: 0,
          fontFamily: '"SF Mono", Consolas, Menlo, monospace',
        }}
      >
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              <span
                className="select-none text-right pr-4 w-8 shrink-0"
                style={{ color: '#484f58' }}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <span style={{ color: COLORS.plain, whiteSpace: 'pre' }}>
                {tokenizeLine(line).map((tok, tIdx) => (
                  <span key={tIdx} style={{ color: COLORS[tok.type] }}>
                    {tok.value}
                  </span>
                ))}
                {line === '' ? '\u00A0' : ''}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
