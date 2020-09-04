function init() {

    // browser.permissions.getAll().then((permissions) => {
    // document.getElementById('permissions').innerText = permissions.permissions.join(', ');
    // document.body.style.border = "5px solid green";
    // addHTML(permissions.permissions.join(', '));
    // });

    document.getElementById("clear").addEventListener("click", clearAll);
    document.getElementById("all").addEventListener("click", getAll2);
    window.addEventListener("click", md);
    getAll2();
}
//初始化
init();
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

function getAll() {
    var gettingAllStorageItems = browser.storage.local.get("myRecord");
    gettingAllStorageItems.then((results) => {
        var arr = results.myRecord;
        document.getElementById("container").innerHTML = "";
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                var entry = arr[i];
                addHTML(entry.url);
            }
        }

    });
}
function getAll2() {
    var gettingAllStorageItems = browser.storage.local.get();
    gettingAllStorageItems.then((results) => {
        //{123:{mm:mm,url:url},345:{}}
        var arr = Object.keys(results);
        document.getElementById("container").textContent = "";
        for (var i = 0; i < arr.length; i++) {
            var uid = arr[i];
            addHTML(results[uid].url);
        }
    });
}
function clearAll() {
    browser.storage.local.clear();
    getAll2();
}
function addHTML(text) {
    var div = document.createElement("div");
    div.className = "rowDiv";
    div.innerHTML = text;
    document.getElementById("container").appendChild(div);
}
