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

//给background.js通信
function downloadOpt(obj){
	var url=obj.getAttribute("url");
	browser.runtime.sendMessage({"type":"download","url":url});
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
    browser.storage.local.remove(obj.getAttribute("url"));
    //是否显示无数据
    if (table.childNodes.length == 2) {
        document.getElementById("noContentContainer").style.display = "block";
    }
}

function addTR(index, url, mm) {
	var indexTd = document.createElement("td");
    indexTd.style.textAlign = "right";
    indexTd.innerHTML = index;
	
	// var pageA = document.createElement("a");
	// pageA.href="http://www.baidu.com";
	// pageA.target="blank";
	// pageA.innerHTML="http://www.baidu.com";
    // var pageTd = document.createElement("td");
    // pageTd.appendChild(pageA);
	
    var urlDiv = document.createElement("div");
    urlDiv.className = "showURL";
    urlDiv.innerHTML = url;
    var urlTd = document.createElement("td");
    urlTd.style.position = "relative";
    urlTd.appendChild(urlDiv);

	var timeTd = document.createElement("td");
    timeTd.style.textAlign = "left";
	timeTd.style.whiteSpace="nowrap";
	timeTd.style.paddingLeft="5px";
	timeTd.style.paddingRight="5px";

    var datetime = getDateTime(mm, "yyyy-MM-dd hh:mm:ss:S");
    timeTd.innerHTML = datetime.substring(11);
	timeTd.title=datetime.substring(0,11);
	
	var downloadDiv = document.createElement("div");
    downloadDiv.innerHTML = "下载";
    downloadDiv.setAttribute("url", url);
    downloadDiv.className = "removeButton";
    downloadDiv.addEventListener("click", function () {
		downloadOpt(this);
    });
    var downloadTd = document.createElement("td");
    downloadTd.appendChild(downloadDiv);
	
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

    var table = document.getElementsByTagName("table")[0];
    var tr = document.createElement("tr");
    tr.className = "rowDiv";
    tr.appendChild(indexTd);
	// tr.appendChild(pageTd);
    tr.appendChild(urlTd);
    tr.appendChild(timeTd);
	tr.appendChild(downloadTd);
    tr.appendChild(deleteTd);
    table.appendChild(tr);
}

function setProperty(obj, key, value) {
    obj[key] = value;
    return obj;
}

function getValue(obj, key) {
    var v = obj[key];
    return v;
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
	
    var gettingAllStorageItems = browser.storage.local.get();
    gettingAllStorageItems.then((results) => {
        //{"sss":{mm:mm,url:url},"yyy":{mm:mm,url:url}}
		//过滤隐藏
		var fh="ad";
		if(results.hasOwnProperty(fh)){
			delete results[fh];
		}
        var arr = Object.keys(results);
        if (arr.length == 0) {
            document.getElementById("noContentContainer").style.display = "block";
        }
        var obj = {};
        var mms = [];
        for (var i = 0; i < arr.length; i++) {
            var uid = arr[i];
            setProperty(obj, results[uid].mm, results[uid].url);
            mms.push(results[uid].mm);
        }
        quickSort(mms, 0, mms.length);
		mms.reverse();
        for (var i = 0; i < mms.length; i++) {
            addTR(i + 1, getValue(obj, mms[i]), mms[i]);
        }

    });
}

function clearAll() {
	var gettingAllStorageItems = browser.storage.local.get();
    gettingAllStorageItems.then((results) => {
		//过滤js
		var fh="ad";
		if(results.hasOwnProperty(fh)){
			delete results[fh];
		}
		
		var arr = Object.keys(results);
		// for (var i = 0; i < arr.length; i++) {
			// browser.storage.local.remove(arr[i]);
		// }
		if(arr.length>0){
			browser.storage.local.remove(arr);
		}
	});
    clearAllContent();
}

function copy() {
    var cv = document.getElementById("copyContent");
    var divs = document.getElementsByClassName("showURL");
    var v = "";
    for (var i = 0; i < divs.length; i++) {
        v += divs[i].innerHTML;
        if (i != divs.length - 1) {
            v += "\r\n";
        }
    }
    cv.value = v;
    cv.select();
    document.execCommand("copy");
    alert("已复制到粘贴板!");
}

var fullSelected = false;
function md(e) {
    if (!e) {
        e = window.event;
    }
    var selection = window.getSelection();
    if (e.target.className == "rowDiv") {
        var range = document.createRange();
        range.selectNodeContents(e.target);
        selection.addRange(range);
    } else {
        if (!fullSelected) {
            var range = document.createRange();
            var se = document.getElementById("container");
            range.selectNodeContents(se);
            selection.addRange(range);
            fullSelected = true;
        } else {
            selection.removeAllRanges();
            fullSelected = false;
        }
    }
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
    //document.getElementById("copyButton").addEventListener("click", copy);
    document.getElementById("clearButton").addEventListener("click", clearAll);
	//document.getElementById("dwo").addEventListener("click", downloadOpt);
	resizeContent();
	getAll();
}

//初始化
init();