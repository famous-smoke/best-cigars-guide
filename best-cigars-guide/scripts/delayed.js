// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

function onError(tagName) {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error(`The ${tagName} script failed to load.`);
}

function onGALoad() {
  /* global dataLayer */
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GT-M6QM788');
  gtag('set', 'linker', { domains: ['www.famous-smoke.com'] });
}

function loadGoogleAnalytics() {
  // Load the Google Analytics library
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=GT-M6QM788';
  document.head.appendChild(tag);
  // Configuration script
  tag.onload = onGALoad;
  tag.onerror = () => onError('Google Analytics');
}

// Check if Google Analytics is loaded
function isGALoaded() {
  return window.dataLayer && Array.isArray(window.dataLayer);
}

function loadiZooto() {
  // iZooto initialization script
  const iZootoInit = document.createElement('script');
  iZootoInit.innerHTML = 'window._izq = window._izq || []; window._izq.push(["init"]);';
  document.head.appendChild(iZootoInit);
  // iZooto library script
  const iZootoLib = document.createElement('script');
  iZootoLib.async = true;
  iZootoLib.src = 'https://cdn.izooto.com/scripts/cea9e5a4539423a917b8cc1f6090b064fc3c2ba5.js';
  iZootoLib.onerror = () => onError('iZooto');
  document.head.appendChild(iZootoLib);
}

// Load Scripts
if (window.location.hostname !== 'localhost') {
  if (!isGALoaded()) {
    loadGoogleAnalytics();
  }
  loadiZooto();
}
