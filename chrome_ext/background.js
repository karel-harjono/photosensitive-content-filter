let detached = false;
chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  console.log(tab);
  // let attached;
  // chrome.debugger.getTargets((targetInfo) => {
  //   attached = targetInfo.attached;
  //   console.log(targetInfo);
  // });
  if (tab?.url?.includes("jsonplaceholder")) {
    chrome.debugger.attach({ tabId }, "1.0", () => {
      chrome.debugger.sendCommand({ tabId }, "Network.enable"); // after attached, enable network tracking

      // chrome.debugger.onDetach.addListener(() => {
      //   chrome.debugger.onEvent.removeListener(() => {});
      //   console.log("detached!!!");
      //   detached = true;
      // });

      chrome.debugger.onEvent.addListener((debuggeeId, message, params) => {
        if (detached || tabId != debuggeeId.tabId) {
          return;
        }

        if (message == "Network.responseReceived") {
          chrome.debugger.sendCommand(
            { tabId },
            "Network.getResponseBody",
            { requestId: params.requestId },
            (response) => {
              console.log(response);

              // // you can close the debugger tips by:
              // chrome.debugger.detach({ tabId });
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
