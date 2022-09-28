let isAttached = false;
chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  // console.log(tab);
  // let attached;
  // chrome.debugger.getTargets((targetInfo) => {
  //   attached = targetInfo.attached;
  //   console.log(targetInfo);
  // });
  if (tab?.url?.includes("https://media.istockphoto.com/photos/chihuahua-sitting-looking-at-the-camera-5-year-old-isolated-on-white-picture-id889640780?k=20&m=889640780&s=612x612&w=0&h=kelR7wgaxM-Im_eCMdRFVcFMSrFYxBy92Wkt2l0W4ew=") && isAttached === false) {
    chrome.debugger.attach({ tabId }, "1.0", () => {
      isAttached = true;
      chrome.debugger.sendCommand({ tabId }, "Network.enable"); // after attached, enable network tracking

      // chrome.debugger.onDetach.addListener(() => {
      //   chrome.debugger.onEvent.removeListener(() => {});
      //   console.log("detached!!!");
      //   detached = true;
      // });

      chrome.debugger.onEvent.addListener((debuggeeId, message, params) => {
        if (tabId != debuggeeId.tabId) {
          return;
        }
        if (message == "Network.requestWillBeSent") {
          console.log('sending request: ', params.request)
        }
        if (message == "Network.responseReceived") {
          chrome.debugger.sendCommand(
            { tabId },
            "Network.getResponseBody",
            { requestId: params.requestId },
            (response) => {
              console.log(response);
              console.log(JSON.stringify(response?.body));
              // isAttached = false;
              // console.log('setting isAttached to ', isAttached);
              // chrome.debugger.detach({ tabId });
              // console.log('debugger detached.');
            }
          );
        }
      });
    });
  }
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// (async () => {
//   const tab = await getCurrentTab();
//   if (tab) {
//     console.log(tab);
//   }
// })();
