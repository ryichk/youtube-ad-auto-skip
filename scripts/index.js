
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // 広告がある場合のみ処理を実行
    if (mutation.addedNodes.length &&
        mutation.addedNodes[0].parentNode &&
        mutation.addedNodes[0].parentNode.className == 'ytp-ad-text'
    ) {
      const videoElements = document.getElementsByTagName('video');
      if (videoElements.length) {
        videoElements[0].currentTime = 999;
      }
      const clickButton = document.querySelector('.ytp-ad-skip-button-text');
      if (clickButton) {
        clickButton.click();
      }
    }
  }
});

const targetElement = document.getElementById('movie_player');
if (targetElement) {
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(targetElement, config);
}
