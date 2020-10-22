//过滤url
function logURL(requestDetails) {
    if (requestDetails.url.indexOf(".m3u8") != -1) {
        save2(requestDetails.url, "m3u8");
    }
    if (requestDetails.url.indexOf(".mp4") != -1) {
        save2(requestDetails.url, "mp4");
    }
    if (requestDetails.url.indexOf(".flv") != -1) {
        save2(requestDetails.url, "flv");
    }
    //Access-Control-Allow-Origin: <origin> | *
}
//监听所有url请求
chrome.webRequest.onBeforeRequest.addListener(
    logURL, {
    urls: ["<all_urls>"]
});

//进入record页面
function openRecord(tabs) {
    if (tabs.length == 0) {
        browser.tabs.create({
            "url": browser.extension.getURL("record/record.html")
        });
    } else {
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
    var mm = datenow.getTime();
    //插入之前查询，然后加入数组中
    browser.storage.local.get("myRecord").then((results) => {
        var arr = results.myRecord;
        if (arr) {
            if (arr.length > 1) {
                //比较

            }
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
function item(key, value) {
    var item = {};
    item[key] = value;
    return item;
}

var urls = {};
function addUrl(key) {
    urls[key] = key;
}
function deleteUrl(key) {
    delete urls[key];
}

function checkExist(url) {
    var keys = Object.keys(urls);
    if (keys.length > 0) {
        var preurl = url.substring(0, url.lastIndexOf("/"));
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = urls[key];
            var prevalue = value.substring(0, value.lastIndexOf("/"));
            if (preurl.indexOf(prevalue) != -1 || prevalue.indexOf(preurl) != -1) {
                deleteUrl(key);
                browser.storage.local.remove(key);
                break;
            }
        }
        addUrl(url);
    } else {
        addUrl(url);
    }
}

function save2(url, type) {
    var datenow = new Date();
    var mm = datenow.getTime();
    var p = {
        "mm": mm,
        "url": url
    };
    if (type == "m3u8") {
        //去重
        checkExist(url);
    }
    var resu = item(url, p);
    browser.storage.local.set(resu);
}

//创建通知
function createNotification(url) {
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/icon.png"),
        "title": "",
        "message": url
    });
}
//通知
function notificationListener(message) {
    if (message.createNotification == "createNotification") {
        createNotification(message.url);
    }
}
//监听通知消息
//browser.runtime.onMessage.addListener(notificationListener);

//关闭通知
function closeNotification(id) {
    setTimeout(function () {
        browser.notifications.clear(id);
    }, 3000);
}
//监听通知显示事件
//browser.notifications.onShown.addListener(closeNotification);

function remain() {

    //https://github.com/mdn/webextensions-examples/tree/master/quicknote/popup

    //content-script<-------sendmessage----->backgroundjs
    //content_script<--------window.postMessage--->个人页面
    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts
    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
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
