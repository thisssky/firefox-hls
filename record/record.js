/*
启动，连接原生应用
*/
var port="";

function downloadOpt(obj){
	if(""==port){
		port = browser.runtime.connectNative("m3u8");
	}
	var url=obj.getAttribute("url");
	port.postMessage({"type":"download","url":url});
}

function init() {
    document.getElementById("queryButton").addEventListener("click", getAll);
    //document.getElementById("copyButton").addEventListener("click", copy);
    document.getElementById("clearButton").addEventListener("click", clearAll);
	//document.getElementById("dwo").addEventListener("click", downloadOpt);
    getAll();
}
//初始化
init();

function setItem(obj, key, value) {
    obj[key] = value;
    return obj;
}
function getValue(obj, key) {
    var v = obj[key];
    return v;
}

function getAll() {
    document.getElementById("noContent").style.display = "none";

    var removeButton = document.getElementsByClassName("removeButton");
    for (var i = 0; i < removeButton.length; i++) {
        clearContent(removeButton[i])
        i = i - 1;
    }
    var gettingAllStorageItems = browser.storage.local.get();
    gettingAllStorageItems.then((results) => {
        //{"sss":{mm:mm,url:url},"yyy":{mm:mm,url:url}}
        var arr = Object.keys(results);
        if (arr.length == 0) {
            document.getElementById("noContent").style.display = "table-row";
        }
        var obj = {};
        var mms = [];
        for (var i = 0; i < arr.length; i++) {
            var uid = arr[i];
            setItem(obj, results[uid].mm, results[uid].url);
            mms.push(results[uid].mm);
        }
        quickSort(mms, 0, mms.length);
		mms.reverse();
        for (var i = 0; i < mms.length; i++) {
            addTR(i + 1, getValue(obj, mms[i]), mms[i]);
        }

    });
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
        document.getElementById("noContent").style.display = "table-row";
    }
}

function clearContent(obj) {
    var table = obj.parentNode.parentNode.parentNode;
    var tr = obj.parentNode.parentNode;
    table.removeChild(tr);
}

function clearAll() {
    browser.storage.local.clear();
    getAll();
}

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
