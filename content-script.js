function notifyExtension(e) {
    var target = e.target;
    while ((target.tagName != "A" || !target.href) && target.parentNode) {
        target = target.parentNode;
    }
    if (target.tagName != "A")
        return;

    browser.runtime.sendMessage({
        "createNotification": "createNotification",
        "url": target.href
    });
}
//window.addEventListener("click", notifyExtension);

//隐藏操作
function hideOpt(info){
	var datenow = new Date();
	var mm = datenow.getTime();
	var li=info.pageUrl.indexOf("://");
	var pre=info.pageUrl.substring(0,li+3);
	var suffix=info.pageUrl.substring(li+3);
	var li2=suffix.indexOf("/");
	var ws="";
	if(-1!=li2){
		ws+=pre;
		ws+=suffix.substring(0,li2);
	}
	
	// document.body.style.border="green 2px solid";

	var sobj={};
	// var dscripts=document.body.getElementsByTagName("script");
	// for(var i=0,len=dscripts.length;i<len;i++){
		// console.log(dscripts[i]);
		// sobj[scripts[i].src]=mm;
	// }
	
	var scripts=document.scripts;
	// console.log(scripts.length+"个<script>");
	//ad {ad:{ws:{js:mm}}}
	for(var i=0,len=scripts.length;i<len;i++){
		if(scripts[i].src!=""){
			//console.log(scripts[i]);
			if((scripts[i].src.indexOf("http://")!=-1)||(scripts[i].src.indexOf("https://")!=-1)){
				//console.log(scripts[i]);
				//console.log("================");
				sobj[scripts[i].src]=mm;
			}
		}
	}
	// console.log(sobj);
	
	browser.storage.local.get("ad").then((result)=>{
		if(result.hasOwnProperty("ad")){
			//console.log(result.ad);
			if(result.ad.hasOwnProperty(ws)){
				//update
				//console.log(result.ad.hasOwnProperty(ws));
				for(k in sobj){
					result.ad[ws][k]=sobj[k];
				}
			}else{
				result.ad[ws]=sobj;
			}
			//console.log(result);
			browser.storage.local.set(result);
		}else{
			var obj = {};
			obj[ws]=sobj;
			browser.storage.local.set({"ad":obj});
		}
		//及时通知backgroun.js,使得blockjs做出改变
		browser.runtime.sendMessage({"type":"change"});
	});
}

//接收从background.js发送的消息
function getMessage(info){
	if(info.type=="hidden"){
		hideOpt(info);
	}
}
browser.runtime.onMessage.addListener(getMessage);


function getBySrc(src){
	var imgs=document.images;
	var parents=[];
	for(var i=0,len=imgs.length;i<len;i++){
		if(src==imgs[i].src){
			var pn=getParent(imgs[i]);
			pn.style.display="none";
			break;
		}
	}
}
function getByHref(href){
	var links=document.links;
	var parents=[];
	for(var i=0,len=links.length;i<len;i++){
		if(href==links[i].href){
			var pn=getParent(links[i]);
			pn.style.display="none";
			break;
		}
	}
}

function getParent(node){
	var bn=document.body;
	while(node.parentNode!=bn){
		node=node.parentNode;
	}
	return node;
}