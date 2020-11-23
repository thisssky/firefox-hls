Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

function getDateTime(mm, fmt) {
    var d = new Date(mm);
    var ymd = d.format(fmt);
    return ymd;
}

function swap(A, i, j) {
    const t = A[i];
    A[i] = A[j];
    A[j] = t;
}

function divide(A, p, r) {
    const x = A[r - 1];
    let i = p - 1;
    for (let j = p; j < r - 1; j++) {
        if (A[j] <= x) {
            i++;
            swap(A, i, j);
        }
    }
    swap(A, i + 1, r - 1);
    return i + 1;
}

function quickSort(A, p = 0, r) {
    r = r || A.length;
    if (p < r - 1) {
        const q = divide(A, p, r);
        quickSort(A, p, q);
        quickSort(A, q + 1, r);
    }
    return A;
}

function updateRowIndex(obj) {
    var tr = obj.parentNode.parentNode;
    var next = tr.nextSibling;
    while (null != next) {
        var trfirsttd = next.firstChild;
        trfirsttd.innerHTML = trfirsttd.innerHTML - 1;
        next = next.nextSibling;
    }
}

function removeOpt(obj) {
    var table = obj.parentNode.parentNode.parentNode;
    var tr = obj.parentNode.parentNode;
    table.removeChild(tr);
    //删除存储
	var ad="ad";
	browser.storage.local.get(ad).then((results) => {
		var robj=results[ad];
		if(undefined!=robj){
			var durl=obj.getAttribute("url");
			if(robj.hasOwnProperty(durl)){
				delete robj[durl];
			}
			browser.storage.local.set({ad:robj});		
		}
	});
	
    //是否显示无数据
    if (table.childNodes.length == 2) {
        document.getElementById("noContentContainer").style.display = "block";
    }
}

function addTR(index, ws, url, mm) {
	var table = document.getElementById("datagrid");
    var tr = document.createElement("tr");
    tr.className = "rowDiv";
    table.appendChild(tr);
	
	var indexTd = document.createElement("td");
    indexTd.style.textAlign = "right";
    indexTd.innerHTML = index;
	tr.appendChild(indexTd);

    var websiteTd = document.createElement("td");
	//websiteTd.style.position = "relative";
	websiteTd.innerHTML=ws;
	//websiteTd.style.whiteSpace = "nowrap";
	//websiteTd.style.overflow = "hidden";
	websiteTd.style.width = "100px";
	var wbDiv = document.createElement("div");
    wbDiv.className = "showURL";
    wbDiv.innerHTML = ws;
	//websiteTd.appendChild(wbDiv);
    tr.appendChild(websiteTd);
	
    var urlDiv = document.createElement("div");
    urlDiv.className = "showURL";
    urlDiv.innerHTML = url;
    var urlTd = document.createElement("td");
    urlTd.style.position = "relative";
    urlTd.appendChild(urlDiv);
    tr.appendChild(urlTd);

	var timeTd = document.createElement("td");
    timeTd.style.textAlign = "left";
	timeTd.style.whiteSpace="nowrap";
	timeTd.style.paddingLeft="5px";
	timeTd.style.paddingRight="5px";
    var datetime = getDateTime(mm, "yyyy-MM-dd hh:mm:ss:S");
    timeTd.innerHTML = datetime.substring(11);
	timeTd.title=datetime.substring(0,11);
	tr.appendChild(timeTd);

    var deleteDiv = document.createElement("div");
    deleteDiv.innerHTML = "删除";
    deleteDiv.setAttribute("url", url);
    deleteDiv.className = "removeButton";
    deleteDiv.addEventListener("click", function () {
        updateRowIndex(this);
        removeOpt(this);
    });
    var deleteTd = document.createElement("td");
    deleteTd.appendChild(deleteDiv);
    tr.appendChild(deleteTd);
}


function clearAllContent() {
	var removeButton = document.getElementsByClassName("removeButton");
    for (var i = 0; i < removeButton.length; i++) {
		var table = removeButton[i].parentNode.parentNode.parentNode;
		var tr = removeButton[i].parentNode.parentNode;
		table.removeChild(tr);
		//是否显示无数据
		if (table.childNodes.length == 2) {
			document.getElementById("noContentContainer").style.display = "block";
		}
        i = i - 1;
    }
}

function getAll() {
	clearAllContent();
    document.getElementById("noContentContainer").style.display = "none";

	var ad="ad";
    var gettingAllStorageItems = browser.storage.local.get(ad);
    gettingAllStorageItems.then((results) => {
		if(results.hasOwnProperty(ad)){
			var urls = Object.keys(results[ad]);
			if (urls.length == 0) {
				document.getElementById("noContentContainer").style.display = "block";
			}
			//ad {ad:{ws:{js:mm}}}

			var arr = [];
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				var sobj = results[ad][url];//{js:mm}
				for(k in sobj){
					var obj={};
					obj.ws=url;
					obj.url=k;
					obj.mm=sobj[k];
					arr.push(obj);
				}
			}
			
			for (var i = 0; i < arr.length; i++) {
				//index ws url mm
				addTR(i + 1, arr[i].ws,arr[i].url,arr[i].mm);
			}
		}else{
			document.getElementById("noContentContainer").style.display = "block";
		}
    });
}

function clearAll() {
    browser.storage.local.remove("ad");
    clearAllContent();
}

function resizeContent(){
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	document.getElementById("noContentContainer").style.height=h-130-2+"px";
	document.getElementById("noContent").style.marginTop=(h-130-2)/2-50+"px";
	document.getElementById("noContent").style.marginLeft=(w-2)/2-180+"px";
}

window.onresize = function(){
 resizeContent();
}

function init() {
    document.getElementById("queryButton").addEventListener("click", getAll);
    document.getElementById("clearButton").addEventListener("click", clearAll);
	resizeContent();
	getAll();
}
//初始化
init();