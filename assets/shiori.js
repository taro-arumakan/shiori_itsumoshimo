function checkStorageSupport() {
    var test = "test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function getTotalHeight() {
    var body = document.body,
        html = document.documentElement;
    var height = Math.max(
            body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    return height;
}

function getSavedPercent() {
    var percent = storageSupported ? loadFromStorage() : loadFromCookie();
    return (percent == null || percent == "") ? 0 : percent;
}


/******* Save *******/

function getClosestElementByTagName(tag_name) {
    var elements = document.getElementsByTagName(tag_name);
    // TODO fine tune that 300px - derive from the screen size?
    var res = Array.from(elements).filter(elem => elem.getBoundingClientRect().y <= 300);
    return res[res.length - 1];
}

function saveInStorage(ypos) {
    localStorage.setItem("scrollPercent", (ypos / getTotalHeight()));
}

function saveCookie(ypos) {
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + 7); // start over if it's been more than ___ days
    document.cookie = "scrollPercent=" + (ypos / getTotalHeight())
        + "; " + expDate;
}


/******* Load *******/

function loadFromStorage() {
    return localStorage.getItem("scrollPercent");
}

function loadFromCookie() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)scrollPercent\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}


/******* Remove *******/

function removeFromStorage() {
    localStorage.removeItem("scrollPercent");
}

function removeCookie() {
    document.cookie = "scrollPercent=''";
}


/******* Handler *******/

var saveButton = document.getElementById("mobile-shiori");

saveButton.onclick = function () {
    var h2 = getClosestElementByTagName('h2');
    h2top = h2.offsetTop;

    storageSupported ? saveInStorage(h2top) : saveCookie(h2top);
    alert(`"${h2.firstElementChild.textContent}" にしおりを挟みました！`);
};


/******* Logic *******/

var storageSupported = checkStorageSupport(),
    percent = getSavedPercent();

if (percent > 0) {
    if (confirm("挟んだしおりから読みますか?")) {
        // with jQuery, $("html, body").animate({ scrollTop: position });
        // TODO 47.98px is height of the header. Change on other devices accordingly.
        document.documentElement.scrollTop = percent * getTotalHeight() - 47.98
    }
    storageSupported ? removeFromStorage() : removeCookie();
}


