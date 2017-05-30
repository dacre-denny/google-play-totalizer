
if(chrome.browserAction && chrome.browserAction.onClicked)  {
    

  chrome.browserAction.onClicked.addListener(function() {
    
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
     

if(!tabs.length) return

          chrome.tabs.sendMessage(tabs[0].id, {command: "append"}, function(response) {
     
              console.log(response.result);
          });
      });
  });
}