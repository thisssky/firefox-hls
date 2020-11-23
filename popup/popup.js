function init(){
	document.getElementById("record").addEventListener("click", openRecord);
	document.getElementById("advertisement").addEventListener("click", openAdvertisement);
}
//初始化
init();
function openTab(path,index){
	var tabUrl = browser.extension.getURL(path);
    browser.tabs.query({
		currentWindow: true,
        "url": tabUrl
    }).then((tabs)=>{
		if(tabs.length==0){
			browser.tabs.create({
				"url": tabUrl,
				"index" : index
			});
		}else{
			browser.tabs.query({
				currentWindow: true,
				"url": tabUrl
			}).then((tabs)=>{
				browser.tabs.highlight({
					"tabs": tabs[0].index
				});
				browser.tabs.move(tabs[0].id,{
					"index": index
				});
			});
		}
	});
}
function openRecord(){
	openTab("record/record.html",0);
}

function openAdvertisement(){
	openTab("advertisement/advertisement.html",1);
}