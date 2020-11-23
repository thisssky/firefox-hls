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
function hideOpt(msg){
	var datenow = new Date();
	var mm = datenow.getTime();
	var li=msg.pageUrl.indexOf("://");
	var pre=msg.pageUrl.substring(0,li+3);
	var suffix=msg.pageUrl.substring(li+3);
	var li2=suffix.indexOf("/");
	var ws="";
	if(-1!=li2){
		ws+=pre;
		ws+=suffix.substring(0,li2);
	}
	
	document.body.style.border="green 2px solid";

	var sobj={};
	// var dscripts=document.body.getElementsByTagName("script");
	// for(var i=0,len=dscripts.length;i<len;i++){
		// console.log(dscripts[i]);
		// sobj[scripts[i].src]=mm;
	// }
	
	var scripts=document.scripts;
	console.log(scripts.length+"个<script>");
	//ad {ad:{ws:{js:mm}}}
	for(var i=0,len=scripts.length;i<len;i++){
		if(scripts[i].src!=""){
			console.log(scripts[i]);
			if((scripts[i].src.indexOf("http://")!=-1)||(scripts[i].src.indexOf("https://")!=-1)){
				console.log(scripts[i]);
				console.log("================");
				sobj[scripts[i].src]=mm;
				console.log(sobj);
			}
		}
	}
	var obj = {};
	obj[ws]=sobj;
	browser.storage.local.set({"ad":obj});
}

//接收从background.js发送的消息
function getMessage(msg){
	if(msg.type=="hidden"){
		hideOpt(msg);
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