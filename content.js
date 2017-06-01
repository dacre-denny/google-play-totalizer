/*
Helper function, attempts to parse price string
Returns undefined or NaN if fails
*/
const parsePrice = str => {
    
    if(!str) return

    const m = str.match(/[0-9\.]+/i)
    const f = parseFloat(m)

    //Got NaN? Assume this is a Free app, costing zero dollars
    return isNaN(f) ? 0 : f
}

/*
Helper function, attempts to parse install data string
Returns undefined fails. Returns array tuple with current installs and total downloads if success
*/
const parseInstall = str => {

    if(!str) return
        
    const m = str.replace(',', '').match(/[0-9,]+/gi)
    if(!m) return
    
    return m
    .map(s => parseFloat(s))
    .map(s => isNaN(s) ? 0 : s)
}

/*
Listen for message from popup, which are fired when user clicks extension button in toolbar. Message handler
fires the summation logic
*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    //Take a stab at identifying the table containg app list
    const table = document.querySelector('[role=article] table');
    if(!table) return sendResponse()

    var colInstall = ''
    var colPrice = ''
    
    //Assume this table is correct app list. Iterate through th's, look for installs and price columns
    table.querySelectorAll('thead tr th').forEach((th, idx) => {
        
        const innerText = th.innerText || ''

        if (innerText.match(/active\/total/gi)) 
            colInstall = idx;

        if (innerText.match(/price/gi))
            colPrice = idx;
    });
        
    var totalInstalls = 0
    var totalDownloads = 0
    var totalEarnings = 0

    //Iterate tr's, sum up totals
    table.querySelectorAll('tbody tr').forEach(tr => {
        
        //Query td's for current row
        var tds = tr.querySelectorAll('td');

        var appPrice = 0
        var appInstalls = 0
        var appDownloads = 0

        //If price/install column indicies found, try and get corresponding columns in current row
        const cellPrice = (colPrice != '') ? tds[colPrice] : ''
        const cellInstall = (colInstall != '') ? tds[colInstall] : ''

        //If we have a cell for app price, pluck out price value if possible
        if(cellPrice) {

            appPrice = parsePrice(cellPrice.innerText)
        }

        //If we have a cell for app price, parse install/total stats if possible
        if(cellInstall) {

            const values = parseInstall(cellInstall.innerText)

            appInstalls = values[0]
            appDownloads = values[1]
        }

        //Add app stats to totals
        totalEarnings += (appDownloads * appPrice)
        totalDownloads += appDownloads
        totalInstalls += appInstalls
    });

    //Nobody wants pricing in anything other than 2dp, right?
    totalEarnings = totalEarnings.toFixed(2)
    
    //Sign, sealed and delievered. Send the goods back to popup
    sendResponse({ 
        totalEarnings,
        totalDownloads,
        totalInstalls
     });
});