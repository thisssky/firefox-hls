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
}
browser.webRequest.onBeforeRequest.addListener(logURL, {urls: ["<all_urls>"]});

//过滤广告js
function blockJS(requestDetails) {
	return {cancel: true};
}

//初始化广告js
var blockjs=[];
async function initBlockJS(){
	
	var ad="ad";
	await browser.storage.local.get(ad).then(results => {
		if(results.hasOwnProperty(ad)){
			var wss = Object.keys(results[ad]);
			//ad {ad:{ws:{js:mm}}}
			
			for (var i = 0; i < wss.length; i++) {
				var url = wss[i];
				var sobj = results[ad][url];//{js:mm}				
				for(k in sobj){
					blockjs.push(k);
				}
			}
		}
    });
	if(blockjs.length!=0){
		if(browser.webRequest.onBeforeRequest.hasListener(blockJS)){
			browser.webRequest.onBeforeRequest.removeListener(blockJS);
		}
		await browser.webRequest.onBeforeRequest.addListener(blockJS, {urls: blockjs},["blocking"]);
	}
}

initBlockJS();

function changeBlockJS(){
	blockjs.length=0;
	initBlockJS();
}
/*
启动，连接原生应用
*/
var port="";
//接收ad变化消息
function getMessage(msg){
	if(msg.type=="change"){
		changeBlockJS();
	}
	if(msg.type=="download"){
		if(""==port){
			port = browser.runtime.connectNative("m3u8");
			port.onMessage.addListener((res) => {
				if(res.type=="app"){
					port.disconnect();
					port="";
				}
			});
		}
		port.postMessage({"type":"download","url":msg.url});
	}
}
browser.runtime.onMessage.addListener(getMessage);


//进入record页面
function openRecord(tabs) {
    // if (tabs.length == 0) {
        // browser.tabs.create({
            // "url": browser.extension.getURL("record/record.html")
        // });
    // } else {
        // browser.tabs.highlight({
            // "tabs": tabs[0].index
        // });
    // }
	if (tabs.length == 0) {
        browser.tabs.create({
			"index": 0,
            "url": browser.extension.getURL("record/record.html")
        });
    } else {
        browser.tabs.highlight({
            "tabs": tabs[0].index
        });
		browser.tabs.move(tabs[0].id,{"index":0}, function (){});

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
function setProperty(key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
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
    var item = setProperty(url, p);
	// var item={};
	// item[url]=p;
    browser.storage.local.set(item);
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

//创建菜单
browser.contextMenus.create({
    "id" : "hlsHiddenMenu",
    "title" : "HLS",
    "contexts" : ["all"]
});
//监听菜单
function clickMenu(info,tab){
	// var para="";
	// if(""!=info.linkUrl){
		// para+="getByHref(\""+info.linkUrl+"\");";
	// }if(""!=info.srcUrl){
		// para+="getBySrc(\""+info.srcUrl+"\");";
	// }
	// browser.tabs.executeScript({
		// code: myCode+para
	// });
	//info(linkUrl​,pageUrl，srcUrl)
	//browser.tabs.sendMessage(tab.id,{"type":"hidden","pageUrl":info.pageUrl,"linkUrl":info.linkUrl,"srcUrl":info.srcUrl});
	var record = browser.extension.getURL("record/record.html");
    browser.tabs.query({
        "url": record
    },function(tabs){
		if (tabs.length == 0) {
			browser.tabs.create({
				"index": 0,
				"url": browser.extension.getURL("record/record.html")
			});
		} else {
			browser.tabs.highlight({
				"tabs": tabs[0].index
			});
			browser.tabs.move(tabs[0].id,{"index":0}, function (){});
		}
	});
}
browser.contextMenus.onClicked.addListener(clickMenu);

var myCode="function getBySrc(src){var imgs=document.images;var parents=[];	for(var i=0,len=imgs.length;i<len;i++){if(src==imgs[i].src){var pn=getParent(imgs[i]);pn.style.display=\"none\";break;}}}";
myCode+="function getByHref(href){var links=document.links;var parents=[];for(var i=0,len=links.length;i<len;i++){if(href==links[i].href){var pn=getParent(links[i]);pn.style.display=\"none\";break;}}}";
myCode+="function getParent(node){var bn=document.body;	while(node.parentNode!=bn){node=node.parentNode;}return node;}";

function onUpdated(tabId,changeInfo,tabInfo){
	//console.log("New tab Info: "+tabId);
	//console.log(tabInfo);
	
	// var ad="hrefsrc";
    // var gettingAllStorageItems = browser.storage.local.get(ad);
    // gettingAllStorageItems.then((results) => {
		// if(results.hasOwnProperty(ad)){
			// var urls = Object.keys(results[ad]);
			// for (var i = 0; i < urls.length; i++) {
				
				// if(tabInfo.url.indexOf(results[ad][urls[i]].website)!=-1){
					// console.log(urls[i]);
					// console.log(results[ad][urls[i]]);
					// console.log(i);
					// browser.tabs.sendMessage(tabId,{"type":"hidden","href":urls[i],"src":urls[i]});
					
					// var para="getBySrc(\""+urls[i]+"\");"+"getByHref(\""+urls[i]+"\");";
					// browser.tabs.executeScript({
						// code: myCode+para
					// });
				// }
			// }
		// }
	// });
	
}
//browser.tabs.onUpdated.addListener(onUpdated);