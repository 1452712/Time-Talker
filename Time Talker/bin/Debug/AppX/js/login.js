(function () {
    "use strict";

    WinJS.UI.Pages.define("/src/login.html", {
        ready: function (element, options) {
            //btn1.onclick = function (e) {
            //    WinJS.xhr({ url: "http://www.microsoft.com", responseType: "document" }).then(function (xhr) {
            //        var img = document.createElement("img");

            //        img.src = xhr.response.querySelector("img[Alt='Microsoft']").src;
            //        results1.appendChild(img);
            //    });
            //};

            //btn2.onclick = function (e) {
            //    WinJS.xhr({ url: "/demos/xhr/fetchme.html", responseType: "document" }).then(function (xhr) {
            //       results2.innerText = xhr.response.querySelector("#fetchText").innerText;
            //    });
            //};

            //btn3.onclick = function(e) {
            //    WinJS.xhr({ url: "http://services.odata.org/V4/TripPinServiceRW.svc/Airlines", headers: { Accept: "application/json" } })
            //        .then(function (xhr) {
            //            results3.innerText = JSON.parse(xhr.response).document
            //                .map(function (i) { return i.Name; })
            //                .join(",");
            //        }, function (error) { debugger; });
            //};

            // Navigation
            WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("button").addEventListener("click", goToHomepage, false);

            document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToHomepage() {
                var destinationUrl = "ms-appx-web:///src/navbar.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }
            }
            
            function navigationToHomepage(eventObject) {
                var url = eventObject.detail.location;
                var host = document.getElementById("box");

                WinJS.Utilities.empty(host);
                //WinJS.UI.Pages.render(url, host);
                //WinJS.UI.Pages.
                WinJS.UI.Pages.render(url, host, eventObject.detail.state);
                // Call unload method on current scenario, if there is one
                // host.winControl && host.winControl.unload && host.winControl.unload();
                //eventObject.detail.setPromise(WinJS.UI.Pages.render(url, host, eventObject.detail.state).then(function () {
                ///    WinJS.Application.sessionState.lastUrl = url;
                //}));
            }

            function changeHover() {
                layer.tips("click to change", '.verify', {
                    time: 6000,
                    tips: [2, "#3c3c3c"]
                })
            }

            function changeHoverLayer() {
                layer.closeAll('tips');
            }

            function clickHover() {
                var hover = document.getElementById("imgcode");
                // TODO
                //hover.attr('src', 'http://zrong.me/home/index/imgcode?id=' + Math.random());
                hover.alt = "";
            }

            function isRemember() {
                var n = document.getElementById("remember-me").checked;
                var zt = document.getElementById("zt");
                if (n) {
                    zt.style.display = "";
                } else {
                    zt.style.display = "none";
                }
            }
        }
    });
})();
