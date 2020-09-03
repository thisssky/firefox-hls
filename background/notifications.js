//通知
function notificationListener(message) {
	if(message.createNotification=="createNotification"){
		createNotification(message.url);
	}
}

function createNotification(url){
	browser.notifications.create({
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

browser.runtime.onMessage.addListener(notificationListener);
browser.notifications.onShown.addListener(closeNotification);