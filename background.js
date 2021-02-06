
chrome.runtime.onInstalled.addListener(function() {
  console.log( 'Setup: Do nothing' );
});

function ublockTopnewsshow() {
  console.log( 'Unblocking topnewsshow.com');
  // https://topnewsshow.com/
  let blocker = document.getElementById('abrgvhkc-blanket');
  if ( blocker ) {
    blocker.style.display = 'none';
    document.body.style.overflowY = "auto";
  }
  else {
    console.log( 'Not topnewsshow.com Do Nothing.')
  }
}

function unblock(e) {
  console.log( 'Extenstion button clicked');
  chrome.scripting.executeScript({
    function: ublockTopnewsshow,
    target: {tabId: e.id, allFrames: false},
  });
};

// chrome.action.onClicked.addListener(unblock);