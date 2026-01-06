// Mapping from web routes (landscape) to mobile app routes (portrait)
// Web routes use Vue Router paths, mobile routes use uni-app pages structure

// Base URL for the mobile application (portrait mode)
const MOBILE_BASE_URL = 'https://m.hinghwa.cn';

// Regex pattern for detecting unresolved parameters (compiled once for performance)
const UNRESOLVED_PARAM_PATTERN = /\{[A-Za-z0-9_]+\}/;

const pc2mobRouters = {
  // Home and main pages
  '/': '/pages/index',
  '/Home': '/pages/index',
  '/search': '/pages/search?key={key}',

  // Articles
  '/articles': '/pages/articles/index',
  '/articles/create': '/pages/articles/edit?id=0',
  '/articles/{id}': '/pages/articles/details?id={id}',
  '/articles/edit/{id}': '/pages/articles/edit?id={id}',

  // Login
  '/login': '/pages/login/login',
  '/register': '/pages/login/register',
  '/forget': '/pages/login/forget',

  // Quizzes/Exam
  '/PuxianExam': '/pages/quizzes/random',
  '/PuxianExam/Research': '/pages/quizzes/search',
  '/PuxianExam/Create': '/pages/quizzes/random', // No create page in mobile, redirect to random
  '/PuxianExam/{id}': '/pages/quizzes/details?id={id}',

  // Users
  '/users/{id}': '/pages/users/details?id={id}',
  '/users/certificate/{id}': '/pages/users/details?id={id}', // No certificate page in mobile
  '/settings': '/pages/users/settings/information',
  '/notification': '/pages/mails/index',

  // Rewards
  '/rewards': '/pages/products/index',
  '/rewards/detail/{id}': '/pages/products/details?id={id}',
  '/rewards/transactions': '/pages/products/history',
  '/admin/rewards': '/pages/products/index', // No admin page in mobile

  // Word Lists
  '/wordlist': '/pages/lists/index',
  '/wordlist/editor': '/pages/lists/upload', // Query param 'id' will be preserved if present
  '/wordlist/{id}': '/pages/lists/details?id={id}',

  // Tools
  '/tools': '/pages/tools/index',
  '/tools/conditions': '/pages/tools/condition',
  '/tools/QuickRecording': '/pages/words/pronunciations/upload?id={word}',
  '/tools/QuickRecording/RecordRank': '/pages/words/pronunciations/ranking',
  '/tools/characters': '/pages/words/characters/details',
  '/tools/DailyExpressions': '/pages/tools/daily-expression/index',
  '/tools/RecordConfirming': '/pages/words/pronunciations/ranking', // No equivalent in mobile
  '/tools/WordConfirming': '/pages/words/details', // No equivalent in mobile
  '/tools/Relative': '/pages/tools/relative',
  '/pinyin': '/pages/tools/pinyin',

  // Words
  '/words/Create': '/pages/words/details', // No create page in mobile
  '/words/{id}': '/pages/words/details?id={id}',
  '/words/{id}/edit': '/pages/words/details?id={id}', // No edit page in mobile
  '/application/{id}': '/pages/words/details?id={id}', // No application page in mobile

  // Dictionary
  '/Dictionary': '/pages/tools/dictionary',

  // Quiz (additional)
  '/Quiz': '/pages/quizzes/index',

  // Music
  '/music': '/pages/music',

  // Translation (no mobile equivalent)
  '/Translation': '/pages/index',
  '/ptxTranslation': '/pages/index',
  '/xtpTranslation': '/pages/index',

  // About (no mobile equivalent)
  '/About': '/pages/index',

  // Error pages
  '/NotFound': '/pages/error/not-found',
  '/Forbidden': '/pages/error/not-found',
};

/**
 * Get query parameter value from URL
 * @param {string} name - Parameter name
 * @returns {string|null} - Parameter value or null if not found
 */
function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substring(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

/**
 * Get path parameter value from URL pathname
 * @param {string} pattern - Route pattern (e.g., '/articles/{id}')
 * @param {string} pathname - Actual pathname (e.g., '/articles/123')
 * @returns {Object} - Object with parameter names as keys and values
 */
function getPathParams(pattern, pathname) {
  const params = {};
  const patternParts = pattern.split('/');
  const pathnameParts = pathname.split('/');

  if (patternParts.length !== pathnameParts.length) {
    return params;
  }

  patternParts.forEach((part, index) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const paramName = part.substring(1, part.length - 1);
      params[paramName] = pathnameParts[index];
    }
  });

  return params;
}

/**
 * Find matching route pattern for current pathname
 * @param {string} pathname - Current pathname
 * @returns {Object|null} - Object with pattern and params, or null if not found
 */
function findMatchingRoute(pathname) {
  // First try exact match
  if (pc2mobRouters[pathname]) {
    return { pattern: pathname, params: {} };
  }

  // Try pattern match with parameters
  for (const pattern in pc2mobRouters) {
    if (pattern.includes('{')) {
      // Check if pattern matches pathname structure
      const patternParts = pattern.split('/');
      const pathnameParts = pathname.split('/');

      if (patternParts.length !== pathnameParts.length) {
        continue;
      }

      let matches = true;
      for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const pathnamePart = pathnameParts[i];

        if (!patternPart.startsWith('{') && patternPart !== pathnamePart) {
          matches = false;
          break;
        }
      }

      if (matches) {
        const params = getPathParams(pattern, pathname);
        return { pattern, params };
      }
    }
  }

  return null;
}

/**
 * Convert web route to mobile app route and redirect
 * Handles both path parameters (in patterns) and query parameters
 */
export default function pc2mob() {
  const currentPath = window.location.pathname;
  const matchResult = findMatchingRoute(currentPath);

  // If no mapping found, redirect to mobile index page
  if (!matchResult) {
    window.location.href = `${MOBILE_BASE_URL}/pages/index`;
    return;
  }

  let target = pc2mobRouters[matchResult.pattern];
  const pathParams = matchResult.params;

  // Replace path parameters in target with actual values
  Object.keys(pathParams).forEach((paramName) => {
    const paramValue = pathParams[paramName];
    target = target.replace(`{${paramName}}`, paramValue);
  });

  // Check if there are still unresolved parameters in target
  const unresolvedParams = target.match(/\{[A-Za-z0-9_]+\}/g);
  if (unresolvedParams) {
    // Try to resolve from query string
    unresolvedParams.forEach((param) => {
      const paramName = param.substring(1, param.length - 1);
      const queryValue = getQueryString(paramName);
      if (queryValue) {
        target = target.replace(param, queryValue);
      }
    });
  }

  // Validate that all path parameters have been resolved
  if (UNRESOLVED_PARAM_PATTERN.test(target)) {
    // Some parameters couldn't be resolved, redirect to mobile index
    console.warn('pc2mob: unresolved parameters in target URL:', {
      target,
      originalUrl: window.location.href,
      message: 'Redirecting to mobile index due to missing required parameters',
    });
    window.location.href = `${MOBILE_BASE_URL}/pages/index`;
    return;
  }

  // Handle additional query parameters from current URL
  const searchParams = new URLSearchParams(window.location.search);
  const targetUrl = new URL(target, MOBILE_BASE_URL);
  
  // Add query parameters that aren't already in target
  searchParams.forEach((value, key) => {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.append(key, value);
    }
  });

  // Build final URL
  const finalPath = targetUrl.pathname + (targetUrl.search || '');

  // Redirect to the mobile version
  window.location.href = `${MOBILE_BASE_URL}${finalPath}`;
}
