// Google AdSense configuration.
// Paste your own values from your AdSense account to start serving real ads.
// Until both are filled in, ad slots render a quiet placeholder instead.
export const ADSENSE_CLIENT = "ca-pub-4214672773373438";
export const ADSENSE_SLOT = ""; // the ad unit's data-ad-slot

export const adsConfigured = () => Boolean(ADSENSE_CLIENT && ADSENSE_SLOT);

let loading = null;

// The AdSense loader script is in index.html (it carries the publisher id).
// Wait for it before pushing an ad slot; ad blockers just leave the space empty.
export const loadAdSense = () => {
  if (window.adsbygoogle) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const script = document.querySelector(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (!script) return resolve();
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", resolve, { once: true });
  });
  return loading;
};