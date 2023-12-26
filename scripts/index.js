const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

const skipAd = () => {
  // 再生中の動画が広告なのか判断し、広告の場合のみ後続の処理を続行させます
  const videoAdsElements = document.getElementsByClassName('ytp-ad-player-overlay');
  if (!videoAdsElements.length) {
    return;
  }

  const videoElements = document.getElementsByTagName('video');
  if (videoElements.length) {
    videoElements[0].currentTime = 999;
  }
  const clickButton = document.querySelector('.ytp-ad-skip-button-text');
  if (clickButton) {
    clickButton.click();
  }
}

const observer = new MutationObserver(async (mutations) => {
  for (const mutation of mutations) {
    // 広告がある場合のみ処理を実行します
    if (mutation.addedNodes.length &&
        mutation.addedNodes[0].parentNode &&
        mutation.addedNodes[0].parentNode.className == 'ytp-ad-text'
    ) {
      // 広告スキップ後に通常の動画もスキップしてしまう時があるので待ち時間を設けます
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
