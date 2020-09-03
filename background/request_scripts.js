//进入record页面
function openRecord(tabs) {
    var cid;
    if (tabs.length == 0) {
        browser.tabs.create({
            "url": browser.extension.getURL("record/record.html")
        });
    } else {
        cid = tabs[0].id
            browser.tabs.move(tabs[0].id, {
            "index": 0
        });
        browser.tabs.highlight({
            "tabs": tabs[0].index
        });
    }

}

function browserActionListener(tab) {
    var record = browser.extension.getURL("record/record.html");
    let querying = browser.tabs.query({
        "url": record
    });
    querying.then(openRecord, record);

}
//监听工具按钮
browser.browserAction.onClicked.addListener(browserActionListener);

//插入记录
function save(url) {
    var datenow = new Date();
    console.log(datenow.getTime());
    var mm = datenow.getTime();
    //插入之前查询，然后加入数组中
    browser.storage.local.get("myRecord").then((results) => {
        var arr = results.myRecord;
        if (arr) {
            var p = {
                "mm": mm,
                "url": url
            };
            arr.push(p);
            browser.storage.local.set({
                "myRecord": arr
            });
        } else {
            arr = [];
            var p = {
                "mm": mm,
                "url": url
            };
            arr.push(p);
            browser.storage.local.set({
                "myRecord": arr
            });

        }

    });

}

function logURL(requestDetails) {

    if (requestDetails.url.indexOf(".m3u8") != -1) {
        save(requestDetails.url);
    }
    if (requestDetails.url.indexOf(".mp4") != -1) {
        save(requestDetails.url);
    }
    if (requestDetails.url.indexOf(".flv") != -1) {
        save(requestDetails.url);
    }
    //Access-Control-Allow-Origin: <origin> | *
}

//监听所有url请求
chrome.webRequest.onBeforeRequest.addListener(
    logURL, {
    urls: ["<all_urls>"]
});


function remain() {
    //browser.runtime.getURL
    //browser.tabs.create({
    //url: browser.extension.getURL("record.html")
    //});
    //displayNote(noteKey,curValue);
    //browser.tabs.executeScript(tid,{"code":'document.body.style.border = "5px solid green"'});
    //var execode="var div=document.createElement(\"div\");div.className=\"page-choice\";div.textContent=\"ssssssss\";document.body.appendChild(div);";
    //browser.tabs.executeScript(tid,{"code":execode});

    //let executing=browser.tabs.executeScript(tabId,{"code":'document.body.style.border = "5px solid green"'});
    //var exturl=browser.extension.getURL("popup/main.js");
    //console.log(exturl+"--------------");


    //let executing=browser.tabs.executeScript(tabId,{"file":"popup/main.js"});

    // executing.then(()=>{
    // browser.tabs.sendMessage(id,{"url": url});
    // });
    // .then(response=>{
    // console.log(response);
    // }).catch(error=>{
    // console.log(error+"------error----");
    // });
}
