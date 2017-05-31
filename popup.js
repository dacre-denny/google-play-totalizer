 

document.addEventListener('DOMContentLoaded', function() {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    
    var tab = tabs[0];
    
    chrome.tabs.sendMessage(tab.id, {command: "append"}, function(response) {
      
      document.getElementById('earning').innerText = response.totalEarnings
      document.getElementById('installs').innerText = response.totalInstalls
      document.getElementById('downloads').innerText = response.totalDownloads
      
    });
    
  });
});
