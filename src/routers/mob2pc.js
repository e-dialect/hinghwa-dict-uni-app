const mob2pcRouters = {
  '/pages/articles/details': '/articles/{id}',
  '/pages/articles/edit': "/articles/edit/{id}'",
  '/pages/login/forget': '/forget',
  '/pages/login/login': '/login',
  '/pages/login/register': '/register',
  '/pages/quizzes/random': '/PuxianExam',
  '/pages/quizzes/search': '/PuxianExam/Research',
  '/pages/quizzes/details': '/PuxianExam/{id}',
  '/pages/users/details': '/users/{id}',
  '/pages/users/settings/information': '/settings',
  '/pages/words/details': '/words/{id}',
  '/pages/words/pronunciations/upload': '/tools/QuickRecording',
  '/pages/words/pronunciations/ranking': '/tools/QuickRecording/RecordRank',
};

function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substring(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

export default function mob2pc() {
  let target = mob2pcRouters[window.location.pathname];
  if (!target) {
    window.location.href = 'https://hinghwa.cn';
    return;
  }
  const params = /\{[A-Za-z0-9]+}/g.exec(target);
  if (params) {
    params.forEach((param) => {
      const query = getQueryString(param.substring(1, param.length - 1));
      target = target.replace(param, query);
    });
  }
  window.location.href = `https://hinghwa.cn${target}`;
}
