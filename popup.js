
async function setup() {}

async function login() {}

async function getList() {}


async function getUrl() {
  try {
    let tabs = await chrome.tabs.query({ 
      active: true, 
      // currentWindow: true, 
      lastFocusedWindow: true,
    });

    if ( tabs[0] && tabs[0].url ) {
      let url = new URL( tabs[0].url );
      let pieces = url.hostname.split( '.');
      if ( pieces.length > 3 ) {
        return pieces[ pieces.length - 2 ];
      }
      else if ( pieces.length === 3 ) {
        return pieces[1];

      }
      else if ( pieces.length === 2 ) {
        return pieces[0] 
      }
      else {
        return '';
      }
    }
  }
  catch(e) {
    console.error(e);
  }
}


// onOpenPopup().catch(console.error )





// Initialize butotn with users's prefered color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// The body of this function will be execuetd as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }