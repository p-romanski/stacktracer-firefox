var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var clipboard = require("sdk/clipboard");
var simplePrefs = require("sdk/simple-prefs");
var notifications = require("sdk/notifications");

runPageMod = function () {
    pageMod.PageMod({
        include: new RegExp(simplePrefs.prefs.domain),
        contentScriptFile: [
            data.url('jquery-2.1.1.min.js'),
            data.url('jquery-text_decorator.js'),
            data.url('stacktracer.js')
        ],
        contentStyleFile: [
            data.url('stacktracer.css')
        ],
        onAttach: function (worker) {
            worker.port.on("clicked", function (text) {
                clipboard.set(text);
                notifications.notify({
                    text: "File name copied."
                });

                var Request = require("sdk/request").Request;
                Request({
                    url: "http://localhost:8000/open?q=" + text,
                    onComplete: function (response) {
                        console.log(response.text);
                    }
                }).get();
            });

            worker.port.emit("filePatternSet", simplePrefs.prefs.filePattern);
        }
    });
};

simplePrefs.on("domain", function () {
    runPageMod();
});

runPageMod();

var tabs = require("sdk/tabs");
//tabs.open("http://alvinalexander.com/java/edu/pj/pj010009");
//tabs.open("https://issues.jenkins-ci.org/browse/JENKINS-21181");
tabs.open("http://localhost:63342/StackTraceR/stacktracer-firefox/test/sample-pages/idea_stack.html");