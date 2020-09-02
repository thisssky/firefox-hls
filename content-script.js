
function notifyExtension(e) {
  var target = e.target;
  while ((target.tagName != "A" || !target.href) && target.parentNode) {
    target = target.parentNode;
  }
  if (target.tagName != "A")
    return;

  browser.runtime.sendMessage({"createNotification":"createNotification","url": target.href});
}
window.addEventListener("click", notifyExtension);


//content-script<-------sendmessage----->backgroundjs
//content_script<--------window.postMessage--->个人页面
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json