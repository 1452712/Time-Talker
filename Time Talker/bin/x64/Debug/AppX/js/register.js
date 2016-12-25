(function () {
    "use strict";

    WinJS.UI.Pages.define("/src/register.html", {
        ready: function (element, options) {

            WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("button").addEventListener("click", goToHomepage, false);

            //document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            ////document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            //document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToHomepage() {
                var user = document.getElementById("student_id").value;
                var email = document.getElementById("user").value;
                var password = document.getElementById("password").value;
                var password1 = document.getElementById("password1").value;
                var verify = document.getElementById("verify").value;
                //WinJS.xhr({ url: "/demos/xhr/fetchme.html", responseType: "json" });

                // $.ajax({
                // url: 'http://www.zrong.me/home/index/userLogin',
                // type: 'post',
                // jsonp: 'jsonpcallback',
          //       jsonpCallback: "flightHandler",
                // async: false,
                // data: {
                // 	'email':email,
                // 	'password':password,
                // 	'verify':verify
                // },
                // success: function(data){
                // 	info = data.status;
                // 	layer.msg(info);
                // }
                // })

                var destinationUrl = "ms-appx-web:///src/login.html";
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
                $(this).attr('src', 'http://zrong.me/home/index/imgcode?id=' + Math.random());
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