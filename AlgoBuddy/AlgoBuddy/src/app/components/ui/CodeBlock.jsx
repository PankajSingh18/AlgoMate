'use client';
import { useState, useRef, useMemo } from 'react';
import { FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

/**
 * Cleanly translates a given JavaScript implementation into standard textbook pseudocode.
 * Runs fully dynamically on the client so that every visualizer gets an immediate, elegant
 * pseudocode tab without requiring manual rewrites in 100+ separate files.
 */
export const generatePseudocode = (jsCode) => {
  if (!jsCode) return '';
  
  let lines = jsCode.split('\n');
  let result = [];
  
  for (let line of lines) {
    let clean = line;
    
    // Replace variable declarations with assignment arrows
    clean = clean.replace(/\b(const|let|var)\b\s+([a-zA-Z0-9_$]+)\s*=\s*/g, '$2 ← ');
    
    // Replace function/methods declarations
    clean = clean.replace(/\bfunction\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{?/g, 'algorithm $1($2)');
    clean = clean.replace(/\bclass\s+([a-zA-Z0-9_$]+)\s*\{?/g, 'structure $1');
    clean = clean.replace(/\bconstructor\s*\(([^)]*)\)\s*\{?/g, 'initialize($1)');
    
    // Replace comparison operators
    clean = clean.replace(/===/g, ' = ');
    clean = clean.replace(/==/g, ' = ');
    clean = clean.replace(/!==/g, ' ≠ ');
    clean = clean.replace(/!=/g, ' ≠ ');
    
    // Replace boolean operators
    clean = clean.replace(/&&/g, ' AND ');
    clean = clean.replace(/\|\|/g, ' OR ');
    clean = clean.replace(/!(?!=)/g, ' NOT ');
    
    // Replace loop controls
    clean = clean.replace(/for\s*\(\s*let\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+);\s*\1\s*<\s*([^;]+);\s*[^)]+\)/g, 'for $1 from $2 to $3 - 1 do');
    clean = clean.replace(/for\s*\(\s*let\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+);\s*\1\s*<=\s*([^;]+);\s*[^)]+\)/g, 'for $1 from $2 to $3 do');
    clean = clean.replace(/for\s*\(\s*(const|let|var)\s+([a-zA-Z0-9_$]+)\s+of\s+([^)]+)\)/g, 'for each $2 in $3 do');
    
    // Replace standard flow blocks
    clean = clean.replace(/if\s*\(([^)]+)\)\s*\{?/g, 'if $1 then');
    clean = clean.replace(/while\s*\(([^)]+)\)\s*\{?/g, 'while $1 do');
    
    // Strip braces and semicolons
    clean = clean.replace(/;\s*$/g, '');
    clean = clean.replace(/\{\s*$/g, '');
    clean = clean.replace(/^\s*\}\s*$/g, '');
    clean = clean.replace(/\s*\}\s*else\s*\{?/g, ' else');
    clean = clean.replace(/\s*\}\s*else\s+if\s*\(([^)]+)\)\s*\{?/g, ' else if $1 then');
    
    // If the line is empty (only braces stripped), skip it
    if (line.trim() !== '' && clean.trim() === '') {
      continue;
    }
    
    result.push(clean);
  }
  
  return result.join('\n');
};

/**
 * Highlights a block of code dynamically. Prepares custom premium highlighting for
 * pseudocode keywords to match the editor's visual style.
 */
export const highlightCode = (code, language) => {
  if (language === 'pseudocode') {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    // Use a single-pass regex matching comments, strings, keywords, operators, and numbers to prevent any HTML tag conflict
    const regex = /(\/\/.*)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|\b(algorithm|procedure|structure|initialize|declare|for each|for|to|do|while|if|then|else|return|AND|OR|NOT)\b|(←)|\b(\d+)\b/g;

    const highlighted = escaped.replace(regex, (match, comment, string, keyword, operator, number) => {
      if (comment !== undefined) {
        return `<span class="hljs-comment" style="color: #5c6370; font-style: italic;">${comment}</span>`;
      }
      if (string !== undefined) {
        return `<span class="hljs-string" style="color: #98c379;">${string}</span>`;
      }
      if (keyword !== undefined) {
        return `<span class="hljs-keyword" style="color: #c678dd; font-weight: bold;">${keyword}</span>`;
      }
      if (operator !== undefined) {
        return `<span class="hljs-operator" style="color: #56b6c2;">${operator}</span>`;
      }
      if (number !== undefined) {
        return `<span class="hljs-number" style="color: #d19a66;">${number}</span>`;
      }
      return match;
    });

    return sanitizeHtml(highlighted, {
      allowedTags: ['span'],
      allowedAttributes: {
        span: ['class', 'style']
      }
    });
  }

  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  const rawHtml = hljs.highlight(code, { language: validLanguage }).value;
  return sanitizeHtml(rawHtml, {
    allowedTags: ['span'],
    allowedAttributes: {
      span: ['class', 'style']
    }
  });
};

const decodeHtmlEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");

const styleStringToObject = (style = '') =>
  style.split(';').reduce((styles, rule) => {
    const [rawName, rawValue] = rule.split(':');
    if (!rawName || !rawValue) return styles;

    const name = rawName.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    styles[name] = rawValue.trim();
    return styles;
  }, {});

const getSpanAttribute = (attributes, name) => {
  const match = attributes.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match?.[1] || '';
};

const renderHighlightedCode = (html) => {
  const nodes = [];
  const spanRegex = /<span([^>]*)>(.*?)<\/span>/g;
  let lastIndex = 0;
  let tokenIndex = 0;
  let match;

  while ((match = spanRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(decodeHtmlEntities(html.slice(lastIndex, match.index)));
    }

    const attributes = match[1] || '';
    const className = getSpanAttribute(attributes, 'class');
    const style = styleStringToObject(getSpanAttribute(attributes, 'style'));

    nodes.push(
      <span key={`token-${tokenIndex++}`} className={className || undefined} style={style}>
        {decodeHtmlEntities(match[2])}
      </span>
    );

    lastIndex = spanRegex.lastIndex;
  }

  if (lastIndex < html.length) {
    nodes.push(decodeHtmlEntities(html.slice(lastIndex)));
  }

  return nodes;
};

const LANGUAGES = [
  { id: 'pseudocode', name: 'Pseudocode' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'go', name: 'Go' },
];

const TrafficDot = ({ color, hoverTitle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      title={hoverTitle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '13px',
        height: '13px',
        borderRadius: '50%',
        background: color,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'filter 0.15s',
        filter: hovered ? 'brightness(0.85)' : 'none',
        boxShadow: `0 0 0 0.5px rgba(0,0,0,0.25) inset`,
      }}
    />
  );
};

const CodeBlock = ({ variant = 'standard', title, codeExamples, fileNames }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('pseudocode');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const resolvedCode = useMemo(() => {
    if (selectedLanguage === 'pseudocode') {
      return codeExamples?.pseudocode || generatePseudocode(codeExamples?.javascript || codeExamples?.js || '');
    }
    let code = codeExamples?.[selectedLanguage];
    if (!code) {
      if (selectedLanguage === 'c') {
        code = codeExamples?.cpp || codeExamples?.c_cpp || codeExamples?.cppCode;
      } 
      else if (selectedLanguage === 'cpp') {
        code = codeExamples?.c || codeExamples?.cCode;
      } 
      else if (selectedLanguage === 'go') {
        code = codeExamples?.golang || codeExamples?.goCode;
      }

      if (!code) {
        code =
          codeExamples?.javascript ||
          codeExamples?.js ||
          codeExamples?.python ||
          codeExamples?.java ||
          codeExamples?.cpp ||
          '';
      }
    }
    return code;
  }, [selectedLanguage, codeExamples]);

  const highlightedCode = useMemo(
    () => highlightCode(resolvedCode, selectedLanguage),
    [resolvedCode, selectedLanguage]
  );

  const highlightedNodes = useMemo(
    () => renderHighlightedCode(highlightedCode),
    [highlightedCode]
  );

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  /* ═══════════════════════════ macOS variant ═══════════════════════════ */
  if (variant === 'macos') {
    return (
      <div className="max-w-4xl mx-auto" ref={topRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* ── macOS Title Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 16px',
              background: 'linear-gradient(180deg, #3a3a3c 0%, #2d2d2f 100%)',
              borderBottom: '1px solid #1a1a1c',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrafficDot color="#ff5f57" hoverTitle="Close" />
              <TrafficDot color="#febc2e" hoverTitle="Minimize" />
              <TrafficDot color="#28c840" hoverTitle="Maximize" />
            </div>

            <span
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',
                fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontWeight: 500,
                color: '#c8c8cc',
                letterSpacing: '0.01em',
                pointerEvents: 'none',
              }}
            >
              {selectedLanguage === 'pseudocode' 
                ? 'algorithm.txt' 
                : (fileNames?.[selectedLanguage] ?? {
                    javascript: 'solution.js',
                    python: 'solution.py',
                    java: 'Solution.java',
                    c: 'solution.c',
                    cpp: 'solution.cpp',
                    go: 'solution.go'
                  }[selectedLanguage] ?? 'solution.txt')}
            </span>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => copyToClipboard(resolvedCode)}
              aria-label="Copy code"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.07)',
                color: copied ? '#30d158' : '#c8c8cc',
                fontSize: '12px',
                fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(6px)',
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#30d158" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="2" width="10" height="14" rx="2" stroke="#c8c8cc" strokeWidth="2" />
                      <path d="M5 6H4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="#c8c8cc" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Copy Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* ── Language tab bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '0 16px',
              background: '#1e1e20',
              borderBottom: '1px solid #111113',
              overflowX: 'auto',
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: selectedLanguage === lang.id
                    ? '2px solid #007aff'
                    : '2px solid transparent',
                  background: 'transparent',
                  color: selectedLanguage === lang.id ? '#ffffff' : '#8e8e93',
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* ── Code body ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="hljs-force-dark"
              style={{
                background: '#282c34',
                overflowX: 'auto',
                padding: '20px 24px 24px',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                  fontSize: '13.5px',
                  lineHeight: '1.8',
                  display: 'flex',
                  gap: '20px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    color: '#636d83',
                    userSelect: 'none',
                    minWidth: '32px',
                    flexShrink: 0,
                    lineHeight: '1.8',
                    fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                    fontSize: '13.5px',
                  }}
                >
                  {resolvedCode
                    .split('\n')
                    .map((_, i) => (
                      <span key={i} style={{ display: 'block' }}>
                        {i + 1}
                      </span>
                    ))}
                </span>

                <code
                  className={`language-${selectedLanguage}`}
                  style={{
                    flex: 1,
                    fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                    fontSize: '13.5px',
                    lineHeight: '1.8',
                    background: 'transparent',
                    padding: 0,
                    whiteSpace: 'pre',
                  }}
                >
                  {highlightedNodes}
                </code>
              </pre>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════════════════ standard variant ═══════════════════════════ */
  return (
    <div
      className="max-w-4xl mx-auto"
      ref={topRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(resolvedCode)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-green-600 dark:text-green-400"
                >
                  <FaCheck className="mr-1" /> Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <FaCopy className="mr-1" /> Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Language Selector */}
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>

        {/* Code Block */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto p-4 bg-gray-900 text-white"
            >
              <pre className="text-sm leading-relaxed">
                <code className={`language-${selectedLanguage}`}>{highlightedNodes}</code>
              </pre>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
              >
                {selectedLanguage.toUpperCase()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
