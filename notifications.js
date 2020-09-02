function notify(message) {
  //console.log(message+"-------------------------------notify()-----");
  console.log(JSON.stringify(message)+"-------------------------------notify()-----");
  
  if(message.createNotification=="createNotification"){
	createNotification(message.url);
  }

}

function createNotification(url){
	var creating=browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/icon.png"),
    "title": "",
    "message": url
  });
}


function closeNotification(id){
	//console.log(id+"-------------close");
	setTimeout(function noticlear(){
		//console.log(id+"-------------noticlear");
		browser.notifications.clear(id);
		},3000);
	
}
/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);
browser.notifications.onShown.addListener(closeNotification)
