(function () {
    "use strict";

    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/index.html", {
        ready: function (element, options) {

            // Navigation
            WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("buttonLogin").addEventListener("click", goToHomepage, false);
            document.getElementById("loginPage").addEventListener("click", goToLogin, false);
            document.getElementById("registerPage").addEventListener("click", goToRegister, false);           

            document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToRegister() {
                var destinationUrl = "ms-appx:///src/register.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }
            }

            function goToLogin() {
                var destinationUrl = "ms-appx:///src/login.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }
            }

            function goToHomepage() {

                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;
                var verify = document.getElementById("verify").value;

                var httpClient = new Windows.Web.Http.HttpClient();
                var uri = new Windows.Foundation.Uri("http://localhost:8080/session?username=" + email + "&&password=" + password);
                var httpMethod = new Windows.Web.Http.HttpMethod("post");
                var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(httpMethod, uri);

                var httpResponse = new Windows.Web.Http.HttpResponseMessage();
                var httpResponseBody = "";

                try {
                    httpResponse = /*await*/ httpClient.sendRequestAsync(httpRequestMessage);
                    httpResponse.EnsureSuccessStatusCode();
                    httpResponseBody = /*await*/ httpResponse.Content.ReadAsStringAsync();

                    var resJson = JSON.parse(httpResponseBody);
                    if (resJson.result === false){
                        self.localtion = "/src/login.html";
                        return;
                    }

                    //create a file and write token to it.
                    roamingFolder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.replaceExisting)
                        .then(function (filename) {
                            return Windows.Storage.FileIO.writeTextAsync(filename, resJson.token);
                        }).done(function () {
                            //console.log("file created");
                        });                

                }
                catch (ex) {
                    self.location = "/src/login.html";
                    //return;
                }
                self.location = "/src/tasklist.html";
            }
            
            function navigationToHomepage(eventObject) {
                var url = eventObject.detail.location;
                var host = document.getElementById("contentHost");

                WinJS.Utilities.empty(host);
                //WinJS.UI.Pages.render(url, host);
                //WinJS.UI.Pages.
                //WinJS.UI.Pages.render(url, host, eventObject.detail.state);
                // Call unload method on current scenario, if there is one
                // host.winControl && host.winControl.unload && host.winControl.unload();
                eventObject.detail.setPromise(WinJS.UI.Pages.render(url, host, eventObject.detail.state).then(function () {
                    WinJS.Application.sessionState.lastUrl = url;
                }));
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

    WinJS.UI.Pages.define("/src/login.html", {
        ready: function (element, options) {

            // Navigation
            WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("buttonLogin").addEventListener("click", goToHomepage, false);

            document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToHomepage() {
                /*
                var destinationUrl = "ms-appx:///src/navbar.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }*/
                //self.localtion = "/src/navbar.html";
                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;
                var verify = document.getElementById("verify").value;

                var httpClient = new Windows.Web.Http.HttpClient();
                var uri = new Windows.Foundation.Uri("http://localhost:8080/session?username=" + email + "&&password=" + password);
                var httpMethod = new Windows.Web.Http.HttpMethod("post");
                var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(httpMethod, uri);

                var httpResponse = new Windows.Web.Http.HttpResponseMessage();
                var httpResponseBody = "";

                try {
                    httpResponse = /*await*/ httpClient.sendRequestAsync(httpRequestMessage);
                    httpResponse.EnsureSuccessStatusCode();
                    httpResponseBody = /*await*/ httpResponse.Content.ReadAsStringAsync();

                    var resJson = JSON.parse(httpResponseBody);
                    if (resJson.result === false) {
                        self.localtion = "/src/login.html";
                        return;
                    }

                    //create a file and write token to it.
                    roamingFolder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.replaceExisting)
                        .then(function (filename) {
                            return Windows.Storage.FileIO.writeTextAsync(filename, resJson.token);
                        }).done(function () {
                            //console.log("file created");
                        });

                }
                catch (ex) {
                    window.location.href = "/src/login.html";
                }
                window.location.href = "/src/tasklist.html";
            }

            function navigationToHomepage(eventObject) {
                var url = eventObject.detail.location;
                var host = document.getElementById("box");

                WinJS.Utilities.empty(host);
                //WinJS.UI.Pages.render(url, host);
                //WinJS.UI.Pages.
                //WinJS.UI.Pages.render(url, host, eventObject.detail.state);
                // Call unload method on current scenario, if there is one
                // host.winControl && host.winControl.unload && host.winControl.unload();
                eventObject.detail.setPromise(WinJS.UI.Pages.render(url, host, eventObject.detail.state).then(function () {
                    WinJS.Application.sessionState.lastUrl = url;
                }));
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
