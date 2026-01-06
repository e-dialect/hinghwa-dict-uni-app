// Mapping from mobile app routes (portrait) to web routes (landscape)
// Mobile routes use uni-app pages structure, web routes use Vue Router paths
const mob2pcRouters = {
  // Home and main pages
  '/': '/Home', // Root path redirect
  '/pages/index': '/Home',
  '/pages/home': '/Home',
  '/pages/search': '/search?key={key}',
  
  // Articles
  '/pages/articles/index': '/articles',
  '/pages/articles/details': '/articles/{id}',
  '/pages/articles/edit': '/articles/edit/{id}',
  '/pages/articles/comments/details': '/articles/{article}', // Web shows comment context via the parent article details page; {article} is the parent article ID
  
  // Login
  '/pages/login/login': '/login',
  '/pages/login/register': '/register',
  '/pages/login/forget': '/forget',
  
  // Quizzes/Exam
  '/pages/quizzes/index': '/PuxianExam',
  '/pages/quizzes/random': '/PuxianExam',
  '/pages/quizzes/search': '/PuxianExam/Research',
  '/pages/quizzes/details': '/PuxianExam/{id}',
  '/pages/quizzes/tests/score': '/PuxianExam?view=score',
  '/pages/quizzes/tests/answer': '/PuxianExam?view=answer',
  '/pages/quizzes/quizset/index': '/PuxianExam?section=quizset',
  '/pages/quizzes/quizset/detail': '/PuxianExam/{id}?section=quizset',
  '/pages/quizzes/quizset/records/index': '/PuxianExam?section=records',
  '/pages/quizzes/quizset/records/detail': '/PuxianExam/{id}?section=records',
  '/pages/quizzes/quizset/questionCard': '/PuxianExam/{id}?view=questionCard',
  
  // Users
  '/pages/users/me': '/users/{id}',
  '/pages/users/details': '/users/{id}',
  '/pages/users/settings/information': '/settings?section=information',
  '/pages/users/settings/username': '/settings?section=username',
  '/pages/users/settings/nickname': '/settings?section=nickname',
  '/pages/users/settings/email': '/settings?section=email',
  '/pages/users/settings/password': '/settings?section=password',
  '/pages/users/settings/telephone': '/settings?section=telephone',
  '/pages/users/pronunciations': '/users/{id}?tab=pronunciations',
  '/pages/users/words': '/users/{id}?tab=words',
  '/pages/users/me/likedarticles': '/users/{id}?tab=likedarticles',
  '/pages/users/me/articles': '/users/{id}?tab=articles',
  '/pages/users/me/comments': '/users/{id}?tab=comments',
  
  // Words
  '/pages/words/details': '/words/{id}',
  '/pages/words/pronunciations': '/words/{id}?tab=pronunciations',
  '/pages/words/characters/details': '/tools/characters',
  '/pages/words/pronunciations/upload': '/tools/QuickRecording',
  '/pages/words/pronunciations/ranking': '/tools/QuickRecording/RecordRank',
  
  // Word Lists
  '/pages/lists/index': '/wordlist',
  '/pages/lists/upload': '/wordlist/editor',
  '/pages/lists/details': '/wordlist/{id}',
  
  // Tools
  '/pages/tools/index': '/tools',
  '/pages/tools/dictionary': '/Dictionary',
  '/pages/tools/condition': '/tools/conditions',
  '/pages/tools/pinyin': '/pinyin',
  '/pages/tools/relative': '/tools/Relative',
  '/pages/tools/daily-expression/index': '/tools/DailyExpressions',
  
  // Products/Rewards
  '/pages/products/index': '/rewards',
  '/pages/products/upload': '/rewards',
  '/pages/products/details': '/rewards/detail/{id}',
  '/pages/products/history': '/rewards/transactions',
  
  // Mails (no direct equivalent in web, redirect to notification with context)
  '/pages/mails/index': '/notification?feature=mail-index',
  '/pages/mails/details': '/notification?feature=mail-details',
  '/pages/mails/send': '/notification?feature=mail-send',
  
  // Music
  '/pages/music': '/music',
  
  // Error pages
  '/pages/error/not-found': '/NotFound',
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
 * Convert mobile app route to web route and redirect
 * Handles both path parameters (in braces) and query parameters
 */
export default function mob2pc() {
  const currentPath = window.location.pathname;
  let target = mob2pcRouters[currentPath];
  
  // If no mapping found, redirect to home page
  if (!target) {
    window.location.href = 'https://hinghwa.cn/Home';
    return;
  }
  
  // Find all path parameters in the target route (e.g., {id}, {article})
  const paramMatches = target.match(/\{[A-Za-z0-9]+\}/g);
  const usedParams = new Set(); // Track which query params were used for path params
  
  if (paramMatches) {
    // Replace each parameter with its corresponding query string value
    paramMatches.forEach((param) => {
      const paramName = param.substring(1, param.length - 1); // Remove braces
      const queryValue = getQueryString(paramName);
      
      if (queryValue) {
        target = target.replace(param, queryValue);
        usedParams.add(paramName);
      } else {
        // If required parameter is missing, try to get 'id' as fallback
        const idValue = getQueryString('id');
        if (idValue) {
          target = target.replace(param, idValue);
          usedParams.add('id');
        }
      }
    });
  }
  
  // Validate that all path parameters have been resolved
  if (/\{[A-Za-z0-9]+\}/.test(target)) {
    // Log error for diagnostics and redirect to home page as fallback
    console.error('mob2pc: unresolved path parameters in target URL:', {
      target,
      originalUrl: window.location.href,
    });
    window.location.href = 'https://hinghwa.cn/Home';
    return;
  }
  
  // Handle query parameters that should be preserved
  // But exclude parameters that were already used as path parameters
  const searchParams = new URLSearchParams(window.location.search);
  const unusedParams = new URLSearchParams();
  
  // Only keep query params that weren't used as path params
  searchParams.forEach((value, key) => {
    if (!usedParams.has(key)) {
      unusedParams.append(key, value);
    }
  });
  
  // Append unused query parameters if any exist
  const hasQueryInTarget = target.includes('?');
  if (unusedParams.toString()) {
    if (hasQueryInTarget) {
      target = `${target}&${unusedParams.toString()}`;
    } else {
      target = `${target}?${unusedParams.toString()}`;
    }
  }
  
  // Redirect to the web version
  window.location.href = `https://hinghwa.cn${target}`;
}
