const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

const skipAd = () => {
  // If the video being played is not an ad, the process ends.
  const videoAdsElements = document.getElementsByClassName('ytp-ad-player-overlay-layout');
  if (!videoAdsElements.length) {
    return;
  }

  const videoElements = document.getElementsByTagName('video');
  if (videoElements.length) {
    videoElements[0].currentTime = 999;
  }

  const skipAdButton = document.querySelector('.ytp-skip-ad-button');
  if (skipAdButton) {
    skipAdButton.click();
  }

  const skipSurveyButton = document.querySelector('.ytp-ad-skip-button-modern')
  if (skipSurveyButton) {
    skipSurveyButton.click();
  }
}

const observer = new MutationObserver(async (mutations) => {
  for (const mutation of mutations) {
    // Performs processing only if there is an ad.
    if (mutation.addedNodes.length &&
        mutation.addedNodes[0].parentNode &&
        mutation.addedNodes[0].parentNode.className == 'ytp-ad-text'
    ) {
      // After skipping the ad, the normal video may also be skipped, so we will set up a waiting time.
      await sleep(100);
      skipAd();
    }
  }
});

const targetElement = document.querySelector('body');
if (targetElement) {
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(targetElement, config);
}
