document.addEventListener('DOMContentLoaded', function() {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    
    var tab = tabs[0];
    if(!tab) return

    //Run content script on current tab
    chrome.tabs.sendMessage(tab.id, {command: "append"}, function(response) {
      
      //Protect against undefined error
      response = response || {}

      //Update the view with totals recieved from content script
      document.getElementById('earning').innerText = response.totalEarnings || 'Not found'
      document.getElementById('installs').innerText = response.totalInstalls || 'Not found'
      document.getElementById('downloads').innerText = response.totalDownloads || 'Not found'
      
    });
    
  });
});
