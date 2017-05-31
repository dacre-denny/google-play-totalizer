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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    const table = document.querySelector('[role=article] table');
    var colInstall = ''
    var colPrice = ''
    var idx = 0
    
    table.querySelectorAll('thead tr th').forEach(th => {
        
        const innerText = th.innerText

        if (innerText.match(/active\/total/gi)) 
            colInstall = idx;

        if (innerText.match(/price/gi))
            colPrice = idx;

        idx++;
    });
        
    var totalInstalls = 0
    var totalDownloads = 0
    var totalEarnings = 0

    table.querySelectorAll('tbody tr').forEach(tr => {
        
        var tds = tr.querySelectorAll('td');

        var appPrice = 0
        var appInstalls = 0
        var appDownloads = 0

        const cellPrice = (colPrice != '') ? tds[colPrice] : ''
        const cellInstall = (colInstall != '') ? tds[colInstall] : ''

        if(cellPrice) {

            const price = parsePrice(cellPrice.innerText)

            appPrice = isNaN(price) ? 0 : price
        }

        if(cellInstall) {

            const values = parseInstall(cellInstall.innerText)

            appInstalls = values[0]
            appDownloads = values[1]
        }

        totalEarnings += (appDownloads * appPrice)
        totalDownloads += appDownloads
        totalInstalls += appInstalls
    });
    
    sendResponse({ 
        totalEarnings,
        totalDownloads,
        totalInstalls
     });
});