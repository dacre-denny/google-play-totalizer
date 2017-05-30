
 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)    {
    
    var table = document.querySelector('[role=article] table');
    var th = table.querySelectorAll('thead tr th');
    var tr = table.querySelectorAll('tbody tr');
    
var col = -1;
for(var i = 0; i < th.length; i++) {
 if(th[i].innerText.match(/active\/total/gi)) {
col = i;
break;
 }
}

if(col != -1) {

var totalActive = 0;
var totalEver = 0;

    for(var j =0; j<tr.length; j ++) {

        var cell = tr[j].querySelectorAll('td')[col];
        if(!cell) continue;
        var txt = cell.innerText;
 
        var values = txt
        .replace(',', '')
        .split(/\//gi)
        .map(v => v.trim())
        .map(v => parseInt(v))

        totalActive += values[0]
        totalEver += values[1]

    }
}
    // console.log(request.command);

    // var div = document.createElement('div');
    // var label = document.createElement('span');
    // label.textContent = "Hello, world";
    // div.appendChild(label);
    // document.body.appendChild(div);

        alert('Total active:' + totalActive)
        alert('Total ever:' + totalEver)


    sendResponse({result: "success"});
});