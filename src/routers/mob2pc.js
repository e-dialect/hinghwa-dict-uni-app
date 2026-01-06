// Mapping from mobile app routes (portrait) to web routes (landscape)
// Mobile routes use uni-app pages structure, web routes use Vue Router paths
const mob2pcRouters = {
  // Home and main pages
  '/': '/Home',
  '/pages/index': '/Home',
  '/pages/home': '/Home',
  '/pages/search': '/search?key={key}',

  // Articles
  '/pages/articles/index': '/articles',
  '/pages/articles/details': '/articles/{id}',
  '/pages/articles/edit': '/articles/edit/{id}', // When id is present; for create (id=0), use /articles/create
  '/pages/articles/comments/details': '/articles/{article}', // Web shows comment context via parent article; {article} is parent article ID

  // Login
  '/pages/login/login': '/login',
  '/pages/login/register': '/register',
  '/pages/login/register/wechat': '/register?platform=wechat',
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
  '/pages/words/pronunciations': '/words/{word}?tab=pronunciations',
  '/pages/words/characters/details': '/tools/characters',
  '/pages/words/pronunciations/upload': '/tools/QuickRecording?word={id}',
  '/pages/words/pronunciations/ranking': '/tools/QuickRecording/RecordRank',

  // Word Lists
  '/pages/lists/index': '/wordlist',
  '/pages/lists/upload': '/wordlist/editor?id={id}',
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

  // Mails (no direct equivalent in web, redirect to notification)
  '/pages/mails/index': '/notification?context=mail',
  '/pages/mails/details': '/notification?context=mail&id={id}',
  '/pages/mails/send': '/notification?context=mail&action=send',

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

  // Special handling for article edit/create
  // When editing articles with id=0 or no id, it's a create operation
  if (currentPath === '/pages/articles/edit') {
    const articleId = getQueryString('id');
    if (!articleId || articleId === '0') {
      target = '/articles/create';
    } else {
      target = `/articles/edit/${articleId}`;
    }
  }

  // Special handling for word list editor
  // If id is present, pass it as a query parameter for editing
  if (currentPath === '/pages/lists/upload') {
    const listId = getQueryString('id');
    if (listId && listId !== '0') {
      target = `/wordlist/editor?id=${listId}`;
    } else {
      target = '/wordlist/editor';
    }
  }

  // Find all path parameters in the target route (e.g., {id}, {article})
  const paramMatches = target.match(/\{[A-Za-z0-9_]+\}/g);
  const usedParams = new Set(); // Track which query params were used for path params

  if (paramMatches) {
    // Replace each parameter with its corresponding query string value
    paramMatches.forEach((param) => {
      const paramName = param.substring(1, param.length - 1); // Remove braces
      const queryValue = getQueryString(paramName);

      if (queryValue) {
        target = target.replace(param, queryValue);
        usedParams.add(paramName);
      } else if (paramName !== 'id') {
        // If required parameter is missing, try to get 'id' as fallback
        // Only use this fallback if the parameter isn't 'id' itself
        const idValue = getQueryString('id');
        if (idValue) {
          target = target.replace(param, idValue);
          usedParams.add('id');
        }
      }
    });
  }

  // Validate that all path parameters have been resolved
  if (/\{[A-Za-z0-9_]+\}/.test(target)) {
    // Some path parameters couldn't be resolved, redirect to home
    console.warn('mob2pc: unresolved path parameters in target URL:', {
      target,
      originalUrl: window.location.href,
      message: 'Redirecting to home page due to missing required parameters',
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
