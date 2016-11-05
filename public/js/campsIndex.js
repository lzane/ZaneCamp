var allTimeFromNow = document.querySelectorAll("small.text-muted");
allTimeFromNow.forEach(function (timeFromNow) {
    var createTime = parseInt(timeFromNow.getAttribute("timefromnow"));
    var fromNow = moment(createTime).fromNow();
    timeFromNow.textContent = fromNow;
});