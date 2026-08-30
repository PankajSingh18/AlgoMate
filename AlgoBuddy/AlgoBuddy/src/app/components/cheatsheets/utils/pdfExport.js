/**
 * PDF export utility for cheatsheets.
 * Uses the native window.print() API which preserves dark mode styles.
 * For a more advanced solution, integrate html2canvas + jspdf.
 */
export function downloadCheatsheet() {
  window.print();
}
