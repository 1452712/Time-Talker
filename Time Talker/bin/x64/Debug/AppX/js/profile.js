(function () {
    "use strict";
    var navcontainer;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/src/profile.html", {
        ready: function (element, options) {

            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#saveButton').addEventListener('click', this.saveInfo.bind(this));

            var navBarContainerEl = document.body.querySelector('#globalNav');
            if (navBarContainerEl) {
                this.setupNavBarContainer();
            } else {
                var navBarEl = document.getElementById('navBar');
                navBarEl.addEventListener('childrenprocessed', this.setupNavBarContainer.bind(this));
            }

        },

        saveInfo: function (ev) {
            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var token = "";
            
            roamingFolder.getFileAsync(filename)
                .then(function (file) {
                    return token = Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (error) {
                    //Handle erors encounterd during read
                    console.log("Error reading file.")
                });
            //TODO
            var httpClient = new Windows.Web.Http.HttpClient();
            var uri = new Windows.Foundation.Uri("http://localhost:8080/user?token=" + token + "&&nowpassword=" + password);
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
                    self.localtion = "/src/profile.html";
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
                //self.location = "/src/prifile.html";
                //return;
            }

            self.location = "/src/tasklist.html";
        },

        navbarInvoked: function (ev) {
            var navbarCommand = ev.detail.navbarCommand;
            WinJS.log && WinJS.log(navbarCommand.label + " NavBarCommand invoked", "sample", "status");
            //var test = document.querySelector('select').focus();
            self.location = navbarCommand.location;
        },

        setupNavBarContainer: function (ev) {
            var navBarContainerEl = document.body.querySelector('#globalNav');

            navBarContainerEl.addEventListener("splittoggle", function (e) {
                var flyout = document.getElementById("accountFlyout").winControl;
                var navbarCommand = e.detail.navbarCommand;
                if (e.detail.opened) {
                    flyout.show(navbarCommand.element);
                    var subNavBarContainer = flyout.element.querySelector('.win-navbarcontainer');
                    if (subNavBarContainer) {
                        subNavBarContainer.winControl.forceLayout();
                        subNavBarContainer.currentIndex = 0;
                    }
                    flyout.addEventListener('beforehide', go);
                } else {
                    flyout.removeEventListener('beforehide', go);
                    flyout.hide();
                }
                function go() {
                    flyout.removeEventListener('beforehide', go);
                    navbarCommand.splitOpened = false;
                }
            });
        }

    });
})();