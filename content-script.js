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
window.addEventListener("click", notifyExtension);
