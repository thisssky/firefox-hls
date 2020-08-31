function logURL(requestDetails) {
	if(requestDetails.url.indexOf(".m3u8")!=-1){
		console.log(requestDetails.url);
		insert(requestDetails.url);
	}
	if(requestDetails.url.indexOf(".mp4")!=-1){
		console.log(requestDetails.url);
		insert(requestDetails.url);

	}
	if(requestDetails.url.indexOf(".flv")!=-1){
		console.log(requestDetails.url);
		insert(requestDetails.url);

	}
  //Access-Control-Allow-Origin: <origin> | *
}
function insert(url){
	console.log("insert:"+url);
}


chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);


//工具按钮
/**
function openPopup(){
	
  browser.tabs.create({
    url: "https://www.baidu.com"
  });
}
browser.browserAction.onClicked.addListener(openPopup);
*/