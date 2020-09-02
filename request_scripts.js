var tabId=-1;
var url="";

function logURL(requestDetails) {
	if(requestDetails.url.indexOf(".m3u8")!=-1){
		//console.log(requestDetails.url+"------");
		//sendMessageToContent(tabId,requestDetails.url);
		
	}
	if(requestDetails.url.indexOf(".mp4")!=-1){
		//console.log(requestDetails.url+"------");
		//insert(requestDetails.url);

	}
	if(requestDetails.url.indexOf(".flv")!=-1){
		//console.log(requestDetails.url+"------");
		//insert(requestDetails.url);

	}
  //Access-Control-Allow-Origin: <origin> | *
}

// chrome.webRequest.onBeforeRequest.addListener(
  // logURL,
  // {urls: ["<all_urls>"]}
// );


//创建新标签页时监听
function currentTab(tab){
	console.log(tab+"----------------currentTab-------------");
	console.log(JSON.stringify(tab)+"----------------currentTab-------------");

	tabId=tab.id;


	// chrome.webRequest.onBeforeRequest.addListener(
		// logURL2,
		// {urls: ["<all_urls>"]}
	// );
	//sendMessageToContent(tabId,url);
}
function updateTab(utabId,changeInfo,tab){
	console.log(utabId+"----------------updateTab-------------");
	console.log(JSON.stringify(tab)+"----------------updateTab-------------");
}
//browser.tabs.onCreated.addListener(currentTab);
//browser.tabs.onUpdated.addListener(updateTab);

function sendMessageToContent(id,url){
	console.log(id+",url:"+url+"------------sendMessageToContent-------------");
	browser.tabs.sendMessage(id,{"url": url});
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

function logURL2(requestDetails) {
	if(requestDetails.url.indexOf(".m3u8")!=-1){
		console.log(requestDetails.url+"----logurl2--");
		url=requestDetails.url;
		//sendMessageToContent(tabId,requestDetails.url)
	}
	if(requestDetails.url.indexOf(".mp4")!=-1){
		//console.log(requestDetails.url+"------");
		//insert(requestDetails.url);

	}
	if(requestDetails.url.indexOf(".flv")!=-1){
		//console.log(requestDetails.url+"------");
		//insert(requestDetails.url);

	}
  //Access-Control-Allow-Origin: <origin> | *
}







//工具按钮
/**
function openPopup(){
	
  browser.tabs.create({
    url: "https://www.baidu.com"
  });
}
browser.browserAction.onClicked.addListener(openPopup);
*/