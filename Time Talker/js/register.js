(function () {
    "use strict";
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/src/register.html", {
        ready: function (element, options) {

            WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("buttonRegister").addEventListener("click", goToHomepage, false);

            //document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            ////document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            //document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToHomepage() {
                var user = document.getElementById("student_id").value;
                var email = document.getElementById("user").value;
                var password = document.getElementById("password1").value;
                var password1 = document.getElementById("password2").value;
                var verify = document.getElementById("verify").value;
                if (password != password1) {
                    self.location = "/src/register.html";
                    return;
                }

                /*
                WinJS.xhr({ url: "/demos/xhr/fetchme.html", responseType: "json" });
                var destinationUrl = "ms-appx:///src/login.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }*/

                var httpClient = new Windows.Web.Http.HttpClient();
                var uri = new Windows.Foundation.Uri("http://localhost:8080@para?username="+user+"&&email="+email+"&&password="+password);
                var httpMethod = new Windows.Web.Http.HttpMethod.put;
                var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(httpMethod, uri);
 
                /*
                //Add a user-agent header to the GET request.var headers = httpClient.DefaultRequestHeaders;

                //The safe way to add a header value is to use the TryParseAdd method and verify the return value is true,
                //especially if the header value is coming from user input.
                
                var header = "ie";
                if (!headers.UserAgent.TryParseAdd(header)) {
                    throw new Exception("Invalid header value: " + header);
                }

                header = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)";
                if (!headers.UserAgent.TryParseAdd(header)) {
                    throw new Exception("Invalid header value: " + header);
                }*/

                //Send the GET request asynchronously and retrieve the response as a string.
                var httpResponse = new Windows.Web.Http.HttpResponseMessage();
                var httpResponseBody = "";

                try {
                    //Send the GET request
                    httpResponse = /*await*/ httpClient.sendRequestAsync(httpRequestMessage);
                    httpResponse.EnsureSuccessStatusCode();
                    httpResponseBody = /*await*/ httpResponse.Content.ReadAsStringAsync();
                    var resJson = JSON.parse(httpResponseBody);
                    if (resJson.result == false) {
                        self.localtion = "/src/register.html";
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
                    httpResponseBody = "Error: " + ex.HResult.ToString("X") + " Message: " + ex.Message;
                    self.location = "/src/register.html";
                    httpResponse.close();
                    httpRequestMessage.close();
                    httpClient.close();
                }

                self.location = "/src/tasklist.html";
                httpResponse.close();
                httpRequestMessage.close();
                httpClient.close();
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

    WinJS.UI.Pages.define("/index.html", {
        ready: function (element, options) {

            //WinJS.Navigation.addEventListener("navigated", navigationToHomepage, true);
            document.getElementById("buttonRegister").addEventListener("click", goToHomepage, false);
            document.getElementById("loginPage2").addEventListener("click", goToLogin, false);
            document.getElementById("registerPage2").addEventListener("click", goToRegister, false);  

            //document.getElementById("imgcode").addEventListener("hover", changeHover, false);
            ////document.getElementById("imgcode").addEventListener("hover", changeHoverLayer, false);
            //document.getElementById("imgcode").addEventListener("click", clickHover, false);
            document.getElementById("remember-me").addEventListener("click", isRemember, false);

            function goToHomepage() {
                var user = document.getElementById("student_id").value;
                var email = document.getElementById("user").value;
                var password = document.getElementById("password1").value;
                var password1 = document.getElementById("password2").value;
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

                /*
                var destinationUrl = "ms-appx:///src/login.html";
                try {
                    WinJS.Navigation.navigate(destinationUrl);
                } catch (error) {
                    WinJS.log && WinJS.log("\"" + destinationUrl + "\" is not a valid absolute URL.\n", "sdksample", "error");
                    return;
                }
                */
                self.location = "/src/login.html";
            }

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

            function navigationToHomepage(eventObject) {
                var url = eventObject.detail.location;
                var host = document.getElementById("contentHost");

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