(function () {
    "use strict";
    var navcontainer;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/src/notelist.html", {
        ready: function (element, options) {

            document.body.querySelector('#notelist').addEventListener('beforeactivate', this.getNote.bind(this));
            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#createButton').addEventListener('click', this.createInvoked.bind(this));

            var navBarContainerEl = document.body.querySelector('#globalNav');
            if (navBarContainerEl) {
                this.setupNavBarContainer();
            } else {
                var navBarEl = document.getElementById('navBar');
                navBarEl.addEventListener('childrenprocessed', this.setupNavBarContainer.bind(this));
            }
        },

        getNote: function (ev) {
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
            var uri = new Windows.Foundation.Uri("http://localhost:8080/note?token=" + token);
            var httpMethod = new Windows.Web.Http.HttpMethod("get");
            var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(httpMethod, uri);

            var httpResponse = new Windows.Web.Http.HttpResponseMessage();
            var httpResponseBody = "";

            try {
                httpResponse = /*await*/ httpClient.sendRequestAsync(httpRequestMessage);
                httpResponse.EnsureSuccessStatusCode();
                httpResponseBody = /*await*/ httpResponse.Content.ReadAsStringAsync();

                var resJson = JSON.parse(httpResponseBody);
                var html = "";
                for(var note in resJson){
                    html = html + "<div class=\"item\"> <i class=\"large github middle aligned icon\"></i><div class=\"content\"><a class=\"header\">"
                    + note.notename + "</a><i class=\"trash outline icon\"><a class=\"item\"></a></i><div class=\"descriptio\">"
                    + note.text +  "</div></div></div>";
                }
                window.onload = function() {
                    document.getElementById("notelist").innerHTML = html;
                }
            }
            catch (ex) {
                return;
            }
            
        },

        createInvoked: function (ev) {
            var navbarCommand = ev.detail.navbarCommand;
            WinJS.log && WinJS.log(navbarCommand.label + " AppBarCommand invoked", "sample", "status");
            //var test = document.querySelector('select').focus();
            self.location = "/src/notepage.html";
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