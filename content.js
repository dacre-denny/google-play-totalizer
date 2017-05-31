

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
debugger
    const parsePrice = str => {
        
        if(!str) return

        const m = str.match(/[0-9\.]+/i)
        return parseFloat(m)
    }

    const parseInstall = str => {

        if(!str) return
            
        const m = str.replace(',', '').match(/[0-9,]+/gi)
        if(!m) return
        
        return m
        .map(s => parseFloat(s))
        .map(s => isNaN(s) ? 0 : s)
    }

    const table = document.querySelector('[role=article] table');
    var installs = -1, 
        price = -1;
    var totalActive = 0;
    var totalEver = 0;
    var i = 0
    
    table.querySelectorAll('thead tr th').forEach(th => {
        
        const innerText = th.innerText

        if (innerText.match(/active\/total/gi)) 
            installs = i;

        if (innerText.match(/price/gi))
            price = i;

        i++;
    });
        
    table.querySelectorAll('tbody tr').forEach(tr => {
        
        var tds = tr.querySelectorAll('td');

        if(price != -1) {

            const td = tds[price]
            const str = td ? td.innerText : ''
            const price = parsePrice(str)

            if(isNaN(price)) continue
        }

        if(installs != -1) {

            const td = tds[installs]
            const str = td ? td.innerText : ''
            const values = parseInstall(str)

            totalActive += values[0]
            totalEver += values[1]
        }
    });

    console.log('Total active:' + totalActive)
    console.log('Total ever:' + totalEver)


    sendResponse({ result: "success" });
});