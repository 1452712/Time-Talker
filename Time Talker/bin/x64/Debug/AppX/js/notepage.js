(function () {
    "use strict";
    var navcontainer;
    var editor;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    KindEditor.ready(function (K) {
        editor = K.create('#editor_id', {
            allowFileManager: true
        });

    });

    WinJS.UI.Pages.define("/src/notepage.html", {
        ready: function (element, options) {

            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#saveButton').addEventListener('click', this.createNote.bind(this));
            document.body.querySelector('#cancelButton').addEventListener('click', this.goToList.bind(this));


            var navBarContainerEl = document.body.querySelector('#globalNav');
            if (navBarContainerEl) {
                this.setupNavBarContainer();
            } else {
                var navBarEl = document.getElementById('navBar');
                navBarEl.addEventListener('childrenprocessed', this.setupNavBarContainer.bind(this));
            }

        },

        createNote: function (ev) {
            editor.sync();
            var html = document.getElementById('editor_id').value;
            var taskName = document.getElementById('taskname').value;
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
            var uri = new Windows.Foundation.Uri("http://localhost:8080@para?token=" + token + "&&taskname=" + taskName+"&&text="+html);
            var httpMethod = new Windows.Web.Http.HttpMethod.post;
            var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(httpMethod, uri);

            var httpResponse = new Windows.Web.Http.HttpResponseMessage();
            var httpResponseBody = "";

            try {
                httpResponse = /*await*/ httpClient.sendRequestAsync(httpRequestMessage);
                httpResponse.EnsureSuccessStatusCode();
                httpResponseBody = /*await*/ httpResponse.Content.ReadAsStringAsync();

                var resJson = JSON.parse(httpResponseBody);
                if (resJson.result == false) {
                    self.localtion = "/src/notepage.html";
                    return;
                }
            }
            catch (ex) {
                httpResponseBody = "Error: " + ex.HResult.ToString("X") + " Message: " + ex.Message;
                self.location = "/src/notepage.html";
                httpResponse.close();
                httpRequestMessage.close();
                httpClient.close();
            }

            httpResponse.close();
            httpRequestMessage.close();
            httpClient.close();
            self.location = "/src/notelist.html";
        },

        goToList: function (ev) {
            self.location = "/src/notelist.html";
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