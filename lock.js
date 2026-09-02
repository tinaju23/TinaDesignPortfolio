/* Site-wide password gate. Client-side only — a soft gate to keep the
   site out of casual view, not a security boundary. Unlock persists across
   tabs (case studies open via target="_blank") via localStorage, so it
   only asks again after site data is cleared. */
(function () {
  var PASSWORD = 'angellist';
  var STORAGE_KEY = 'site-unlocked';

  if (localStorage.getItem(STORAGE_KEY) === '1') return;

  document.write(
    '<style>' +
    'html.is-locked, html.is-locked body{ height:100%; overflow:hidden; }' +
    '#lock-screen{ position:fixed; inset:0; z-index:9999; background:var(--paper,#FAFAF7);' +
      ' display:flex; align-items:center; justify-content:center; padding:24px; }' +
    '#lock-screen .lock-box{ width:100%; max-width:340px; text-align:center; }' +
    '#lock-screen .lock-eyebrow{ font-family:var(--font-mono,monospace); font-size:12px;' +
      ' letter-spacing:0.12em; text-transform:uppercase; color:var(--verified,#0F6FA8);' +
      ' display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:22px; }' +
    '#lock-screen .lock-eyebrow::before, #lock-screen .lock-eyebrow::after{ content:""; width:16px; height:1px; background:var(--verified,#0F6FA8); }' +
    '#lock-screen h1{ font-family:var(--font-display,sans-serif); font-weight:600;' +
      ' font-size:clamp(24px,4vw,32px); letter-spacing:-0.01em; color:var(--ink,#14171B); margin-bottom:12px; }' +
    '#lock-screen p{ font-size:14px; color:var(--slate,#5B616B); margin-bottom:32px; line-height:1.6; }' +
    '#lock-screen form{ display:flex; flex-direction:column; gap:16px; }' +
    '#lock-screen input{ font-family:var(--font-mono,monospace); font-size:14px;' +
      ' background:transparent; border:none; border-bottom:1px solid var(--line,#E3E1DB);' +
      ' padding:10px 2px; color:var(--ink,#14171B); text-align:center; letter-spacing:0.08em;' +
      ' outline:none; transition:border-color .15s ease; }' +
    '#lock-screen input:focus{ border-color:var(--verified,#0F6FA8); }' +
    '#lock-screen .lock-error{ font-family:var(--font-mono,monospace); font-size:12px; color:var(--flag,#C97A3E);' +
      ' min-height:16px; margin-top:14px; opacity:0; transition:opacity .15s ease; }' +
    '#lock-screen .lock-error.is-visible{ opacity:1; }' +
    '</style>' +
    '<div id="lock-screen" role="dialog" aria-modal="true" aria-label="Password required">' +
      '<div class="lock-box">' +
        '<div class="lock-eyebrow">Restricted</div>' +
        '<h1>This site is locked</h1>' +
        '<p>Enter the password to continue.</p>' +
        '<form id="lock-form" autocomplete="off">' +
          '<input type="password" id="lock-input" placeholder="Password" aria-label="Password" autofocus>' +
          '<button type="submit" class="btn">Unlock</button>' +
        '</form>' +
        '<div class="lock-error" id="lock-error">Incorrect password. Try again.</div>' +
      '</div>' +
    '</div>'
  );

  document.documentElement.classList.add('is-locked');

  document.addEventListener('DOMContentLoaded', function () {
    var screen = document.getElementById('lock-screen');
    var form = document.getElementById('lock-form');
    var input = document.getElementById('lock-input');
    var error = document.getElementById('lock-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, '1');
        document.documentElement.classList.remove('is-locked');
        screen.parentNode.removeChild(screen);
      } else {
        error.classList.add('is-visible');
        input.value = '';
        input.focus();
      }
    });
  });
})();
