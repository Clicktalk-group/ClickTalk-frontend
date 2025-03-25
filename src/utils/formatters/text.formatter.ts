import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @param ellipsis Text to add after truncation
 * @returns Truncated string
 */
export const truncateText = (
  text: string,
  maxLength: number = 50,
  ellipsis: string = '...'
): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary if possible
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) { // Only truncate at word if we're not losing too much text
    return truncated.substring(0, lastSpace) + ellipsis;
  }
  
  return truncated + ellipsis;
};

/**
 * Formats markdown text to HTML
 * @param text Markdown text
 * @param options Options for formatting
 * @returns Sanitized HTML string
 */
export const formatMarkdown = (
  text: string, 
  options: { allowLinks?: boolean; allowImages?: boolean } = {}
): string => {
  if (!text) return '';
  
  // Configure Marked options
  marked.setOptions({
    breaks: true,  // Add <br> on a single line break
    gfm: true,     // GitHub flavored markdown
  });
  
  // Convert markdown to HTML - coercé à string pour éviter les erreurs TypeScript
  const html = String(marked.parse(text));
  
  // Configure DOMPurify
  const purifyConfig: DOMPurify.Config = {};
  
  // Définir les tags autorisés
  const allowedTags = [
    'p', 'br', 'b', 'i', 'em', 'strong', 'code', 'pre', 
    'blockquote', 'ul', 'ol', 'li'
  ];
  
  // Optionally allow links
  if (options.allowLinks) {
    allowedTags.push('a');
  }
  
  // Optionally allow images
  if (options.allowImages) {
    allowedTags.push('img');
  }
  
  // Définir les attributs autorisés
  let allowedAttrs: string[] = [];
  
  if (options.allowLinks) {
    allowedAttrs = [...allowedAttrs, 'href', 'target', 'rel'];
  }
  
  if (options.allowImages) {
    allowedAttrs = [...allowedAttrs, 'src', 'alt', 'width', 'height'];
  }
  
  purifyConfig.ALLOWED_TAGS = allowedTags;
  if (allowedAttrs.length > 0) {
    purifyConfig.ALLOWED_ATTR = allowedAttrs;
  }
  
  // Sanitize HTML
  return DOMPurify.sanitize(html, purifyConfig);
};

/**
 * Formats a number to a compact representation (e.g., 1.2K, 5.7M)
 * @param num Number to format
 * @param precision Decimal precision
 * @returns Formatted number string
 */
export const formatNumber = (num: number, precision: number = 1): string => {
  if (isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum < 1000) {
    return sign + absNum.toString();
  }
  
  const units = ['', 'K', 'M', 'B', 'T'];
  const unit = Math.floor(Math.log10(absNum) / 3);
  const value = absNum / Math.pow(1000, unit);
  const formattedValue = value.toFixed(precision).replace(/\.0+$/, '');
  
  return sign + formattedValue + units[unit];
};

/**
 * Highlights search terms within a text
 * @param text The text to search in
 * @param searchTerm The term to highlight
 * @param highlightClass CSS class to apply (default: 'highlighted')
 * @returns HTML string with highlighted terms
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  highlightClass: string = 'highlighted'
): string => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const highlighted = text.replace(regex, `<span class="${highlightClass}">$1</span>`);
  
  // DOMPurify to prevent XSS
  return DOMPurify.sanitize(highlighted, {
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class']
  });
};

/**
 * Escapes special characters for use in regular expressions
 * @param string String to escape
 * @returns Escaped string
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Removes extra whitespace and normalizes text
 * @param text Text to clean
 * @returns Cleaned text
 */
export const cleanText = (text: string): string => {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/[\r\n]+/g, '\n'); // Normalize line breaks
};
