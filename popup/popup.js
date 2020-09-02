document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("page-choice")) {
    return;
  }

  var chosenPage = "https://" + e.target.textContent;
  browser.tabs.create({
    url: chosenPage
  });
  
  
  	// var exturl=browser.extension.getURL("");

   // browser.tabs.create({
     // "url": exturl+"popup/popup.html"
   // });
});
//browser.runtime.sendMessage({"xxxx":"sdfasdfasdfasdfa","url":"test"});
// var mdoc=document;
// (function () {
	
// console.log("自启动");
//insertDiv("试一试

// } ());

// var div=document.createElement("div");
	// div.className="page-choice";
	// div.textContent="ssssssss";
	//document.body.appendChild(div);
	
function insertDiv(text){
	var div=document.createElement("div");
	div.className="page-choice";
	div.textContent=text;
	document.body.appendChild(div);
}
function openTab(){
	console.info("opentab");
	 browser.tabs.create({
     "url": "popup.html"
   });
}

// function acceptInsertss(message){
	// console.info("---------------acceptInsert-----------");
	// console.info(message);
// }
// browser.runtime.onMessage.addListener(acceptInsertss);

//browser.runtime.sendMessage({"xxx":"xxsesads"});
//.browserAction.onClicked.addListener((tab) => {
  // disable the active tab
//browser.browserAction.disable(tab.id);
  // requires the "tabs" or "activeTab" permission
  //console.log(tab.url);
//});