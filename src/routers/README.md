# Router Documentation

## Overview

This directory contains router utilities for cross-platform navigation between the mobile app (portrait mode) and web app (landscape mode) of the Hinghwa Dictionary.

## Files

### mob2pc.js
Converts mobile app routes to web app routes and handles automatic redirection from mobile to web (portrait to landscape).

**Usage:**
```javascript
import mob2pc from '@/routers/mob2pc';

// Call when detecting landscape orientation
mob2pc(); // Automatically converts current URL and redirects to web version
```

**Features:**
- Complete route mapping from all mobile pages to web pages
- Path parameter conversion (e.g., `?id=123` → `/articles/123`)
- Query parameter preservation
- Special handling for article create/edit distinction
- Special handling for word list editor
- Fallback to home page for unmapped routes or missing parameters

### pc2mob.js
Converts web app routes to mobile app routes and handles automatic redirection from web to mobile (landscape to portrait).

**Usage:**
```javascript
import pc2mob from '@/routers/pc2mob';

// Call when detecting portrait orientation
pc2mob(); // Automatically converts current URL and redirects to mobile version
```

**Features:**
- Complete route mapping from web pages to mobile pages
- Pattern matching for parameterized routes (e.g., `/articles/:id`)
- Path parameter extraction and conversion to query parameters
- Query parameter preservation
- Graceful handling of web-only pages (redirects to equivalent mobile page)
- Fallback to mobile index page for unmapped routes

## Route Mapping

### Mobile to Web (mob2pc)

| Mobile Route | Web Route | Notes |
|-------------|-----------|-------|
| `/pages/index` | `/Home` | Main home page |
| `/pages/search?key={key}` | `/search?key={key}` | Search functionality |
| `/pages/articles/details?id={id}` | `/articles/{id}` | Article details |
| `/pages/articles/edit?id={id}` | `/articles/edit/{id}` | Edit existing article |
| `/pages/articles/edit?id=0` | `/articles/create` | Create new article |
| `/pages/words/details?id={id}` | `/words/{id}` | Word details |
| `/pages/users/details?id={id}` | `/users/{id}` | User profile |
| `/pages/quizzes/details?id={id}` | `/PuxianExam/{id}` | Quiz details |
| `/pages/lists/details?id={id}` | `/wordlist/{id}` | Word list details |
| `/pages/products/details?id={id}` | `/rewards/detail/{id}` | Reward details |
| ... | ... | See mob2pc.js for complete mappings |

### Web to Mobile (pc2mob)

| Web Route | Mobile Route | Notes |
|-----------|-------------|-------|
| `/Home` | `/pages/index` | Main home page |
| `/search?key={key}` | `/pages/search?key={key}` | Search functionality |
| `/articles/{id}` | `/pages/articles/details?id={id}` | Article details |
| `/articles/create` | `/pages/articles/edit?id=0` | Create new article |
| `/articles/edit/{id}` | `/pages/articles/edit?id={id}` | Edit existing article |
| `/words/{id}` | `/pages/words/details?id={id}` | Word details |
| `/users/{id}` | `/pages/users/details?id={id}` | User profile |
| `/PuxianExam/{id}` | `/pages/quizzes/details?id={id}` | Quiz details |
| `/wordlist/{id}` | `/pages/lists/details?id={id}` | Word list details |
| `/rewards/detail/{id}` | `/pages/products/details?id={id}` | Reward details |
| ... | ... | See pc2mob.js for complete mappings |

## Special Cases

### Article Creation vs Editing
- Mobile: `/pages/articles/edit?id=0` or `/pages/articles/edit` (no id) → Web: `/articles/create`
- Mobile: `/pages/articles/edit?id=123` → Web: `/articles/edit/123`

### Word List Creation vs Editing
- Mobile: `/pages/lists/upload` (no id) → Web: `/wordlist/editor`
- Mobile: `/pages/lists/upload?id=123` → Web: `/wordlist/editor?id=123`

### Mail System
Mobile has dedicated mail pages, but web uses a unified notification page:
- Mobile: `/pages/mails/index` → Web: `/notification?context=mail`
- Mobile: `/pages/mails/details?id=123` → Web: `/notification?context=mail&id=123`

### Web-Only Pages
Some web pages don't have direct mobile equivalents and redirect to similar pages:
- `/About` → `/pages/index` (mobile homepage)
- `/Translation` → `/pages/index`
- `/tools/RecordConfirming` → `/pages/words/pronunciations/ranking`
- `/tools/WordConfirming` → `/pages/words/details`
- `/admin/rewards` → `/pages/products/index`

### Mobile-Only Pages
Some mobile pages (like WeChat-specific registration) map to general web pages:
- `/pages/login/register/wechat` → `/register?platform=wechat`

## Testing

Test cases are available in `__test_cases__/mob2pc-test-cases.js`. These describe expected behavior for various route conversions.

To manually test:
1. Set up a mock for `window.location`
2. Call `mob2pc()` or `pc2mob()`
3. Verify the resulting `window.location.href`

See test case file for detailed examples.

## Parameter Handling

### Path Parameters
Parameters in curly braces `{param}` in target routes are replaced with values from query strings:
- Route: `/articles/{id}` + Query: `?id=123` → Result: `/articles/123`

### Query Parameters
Query parameters are preserved unless they're used as path parameters:
- Route: `/users/{id}` + Query: `?id=100&tab=articles` → Result: `/users/100?tab=articles`

### Missing Parameters
If required path parameters are missing, the function redirects to a safe default:
- `mob2pc`: Redirects to `https://hinghwa.cn/Home`
- `pc2mob`: Redirects to `https://m.hinghwa.cn/pages/index`

## Configuration

Base URLs are defined as constants at the top of each file for easy configuration:

**mob2pc.js:**
- `WEB_BASE_URL`: `'https://hinghwa.cn'` (landscape/web version)

**pc2mob.js:**
- `MOBILE_BASE_URL`: `'https://m.hinghwa.cn'` (portrait/mobile version)

To change these for different environments (e.g., development, staging), simply modify these constants.

## Maintenance

When adding new pages to either platform:

1. Add route mapping in the appropriate router object (`mob2pcRouters` or `pc2mobRouters`)
2. If the route has path parameters, use `{paramName}` syntax
3. Add special handling if needed (see article edit/create example)
4. Add test cases to verify the mapping works correctly
5. Update this README with the new mapping

## Notes

- Both functions perform immediate redirects using `window.location.href`
- Console warnings are logged when parameters can't be resolved
- The functions are designed to be called when screen orientation changes are detected
- All route mappings are maintained manually and should be kept in sync with actual page structures
