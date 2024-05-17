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

function loadAccessibe() {
  // Create the script element for the AccessiBe library
  const script = document.createElement('script');
  const head = document.querySelector('head') || document.body;
  script.src = 'https://acsbapp.com/apps/app/dist/js/app.js';
  script.async = true;

  // Define the callback function to initialize AccessiBe
  function initializeAccessibe() {
    // eslint-disable-next-line no-undef
    acsbJS.init({
      statementLink: '',
      feedbackLink: '',
      footerHtml: '',
      hideMobile: false,
      hideTrigger: true,
      language: 'en',
      position: 'right',
      leadColor: '#146FF8',
      triggerColor: '#146FF8',
      triggerRadius: '50%',
      triggerPositionX: 'right',
      triggerPositionY: 'bottom',
      triggerIcon: 'default',
      triggerSize: 'medium',
      triggerOffsetX: 20,
      triggerOffsetY: 20,
      mobile: {
        triggerSize: 'small',
        triggerPositionX: 'right',
        triggerPositionY: 'bottom',
        triggerOffsetX: 0,
        triggerOffsetY: 0,
        triggerRadius: '0',
      },
    });
  }

  // Add event listeners for load and error events
  script.onload = initializeAccessibe;
  script.onerror = () => onError('Accessibe');

  // Append the script to the body or html element
  head.appendChild(script);
}

function loadTrueVault() {
  window.polarisOptions = {
    GoogleAnalyticsTrackingId: 'G-JNTYD06WGL',
    enableConsentManager: true,
    privacyCenterId: 'OTNJF7CVF',
  };

  const script = document.createElement('script');
  script.src = 'https://polaris.truevaultcdn.com/static/polaris.js';
  script.onload = () => {
    // DOMContentLoaded event is required to initialise polaris
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  };
  document.head.appendChild(script);
}

// Load Scripts
if (window.location.hostname !== 'localhost') {
  if (!isGALoaded()) {
    loadGoogleAnalytics();
  }
  loadiZooto();
  loadAccessibe();
  loadTrueVault();
}
