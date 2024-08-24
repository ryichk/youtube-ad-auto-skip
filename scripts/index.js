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

const skipAlert = () => {
  const errorSupportedRenderers = document.querySelector('yt-playability-error-supported-renderers');
  if (errorSupportedRenderers) {
    errorSupportedRenderers.remove();
    // TODO: I want to be able to skip without reloading.
    location.reload();
  }
}

const addEventListenerOnce = (target, event, handler) => {
  if (!target[`_${event}_listenerRegistered`]) {
    target.addEventListener(event, handler);
    target[`_${event}_listenerRegistered`] = true;
  }
}

const playVideo = () => {
  const videoElements = document.getElementsByTagName('video');
  if (videoElements.length) {
    const videoEle = videoElements[0]
    const handler = async () => {
      try {
        await videoEle.play();
        if (videoEle.currentTime === 0) {
          videoEle.click();
        }
      } catch (error) {
        console.error(error);
      }
    }
    addEventListenerOnce(videoEle, 'canplay', handler)
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
      skipAlert();
    }
  }
});

const targetElement = document.querySelector('body');
if (targetElement) {
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(targetElement, config);
}
