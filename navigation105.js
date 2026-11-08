/* Pass 105/106 · native Admin header and the single scrolling room row.
   The 25 website room buttons and their canonical go() handlers remain in
   place; Pass 106 removes only Translate from this website navigation. The
   former family map/drawer is not loaded by the deterministic builder. */
(function () {
  'use strict';
  if (window.IVNAV105) return;
  var desk, ribbon, observer, queued = false;

  function leave() {
    if (typeof window.ivLeaveDesk === 'function') window.ivLeaveDesk();
  }
  function header() {
    desk = document.getElementById('desk-screen');
    ribbon = document.getElementById('dk-ribbon');
    if (!desk || !ribbon) return false;
    var menu = document.getElementById('dk-menu');
    if (menu) {
      var back = document.createElement('button');
      back.type = 'button';
      back.className = 'dk-icon n105-back';
      back.id = 'dk-back';
      back.setAttribute('aria-label', 'Leave Admin');
      back.title = 'Back';
      back.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      back.addEventListener('click', leave);
      menu.parentNode.replaceChild(back, menu);
    }
    var name = desk.querySelector('.dk-name');
    if (name) name.textContent = 'ADMIN';
    var drawer = document.getElementById('dk-drawer');
    var veil = document.getElementById('dk-veil');
    if (drawer) { drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); }
    if (veil) veil.classList.remove('on');
    desk.classList.add('n105-admin');
    return true;
  }
  function paint() {
    queued = false;
    if (!desk || !ribbon || !header()) return;
    var tabs = Array.prototype.slice.call(ribbon.querySelectorAll('.dk-tab'));
    var active = null;
    tabs.forEach(function (tab) {
      var on = tab.classList.contains('on');
      if (on) active = tab;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.setAttribute('tabindex', on ? '0' : '-1');
      /* Reassigning identical text still emits childList mutations.  The
         observer watches this subtree, so write only when the label changes;
         otherwise FRAMES can schedule an endless paint loop in WebKit. */
      if (tab.getAttribute('data-k') === 'frames' && tab.textContent.trim() !== 'FRAMES') tab.textContent = 'FRAMES';
    });
    if (active) {
      desk.setAttribute('data-room', active.getAttribute('data-k') || '');
      ribbon.setAttribute('aria-label', 'Admin rooms');
      /* The house already centres a newly selected tab. This second, quiet
         alignment also covers restoration and WebKit's delayed first paint. */
      if (document.body.classList.contains('on-desk') && active.getAttribute('data-n105-seen') !== '1') {
        active.setAttribute('data-n105-seen', '1');
        setTimeout(function () {
          if (!active.isConnected) return;
          var left = active.offsetLeft - (ribbon.clientWidth - active.offsetWidth) / 2;
          try { ribbon.scrollTo({ left: Math.max(0, left), behavior: 'smooth' }); }
          catch (e) { ribbon.scrollLeft = Math.max(0, left); }
        }, 30);
      }
    }
    Array.prototype.forEach.call(ribbon.querySelectorAll('.dk-ico,.soon'), function (n) { n.remove(); });
  }
  function later() {
    if (queued) return;
    queued = true;
    setTimeout(paint, 0);
  }
  function keys(e) {
    if (!document.body.classList.contains('on-desk')) return;
    var tab = e.target && e.target.closest && e.target.closest('#dk-ribbon .dk-tab');
    if (!tab || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End')) return;
    var tabs = Array.prototype.slice.call(ribbon.querySelectorAll('.dk-tab'));
    var at = tabs.indexOf(tab), next = at;
    if (e.key === 'ArrowLeft') next = Math.max(0, at - 1);
    if (e.key === 'ArrowRight') next = Math.min(tabs.length - 1, at + 1);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== at && tabs[next]) { e.preventDefault(); tabs[next].focus(); tabs[next].click(); }
  }
  function boot() {
    if (!header()) return;
    if (observer) observer.disconnect();
    observer = new MutationObserver(later);
    observer.observe(ribbon, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    observer.observe(document.getElementById('dk-pane'), { childList: true, subtree: false });
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('#dk-ribbon .dk-tab')) later();
    }, true);
    document.addEventListener('keydown', keys);
    paint();
  }
  window.IVNAV105 = { paint: paint, rooms: 25 };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
