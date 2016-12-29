(function () {
    "use strict";
    var navcontainer;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/src/tasklist.html", {
        ready: function (element, options) {

            document.body.querySelector('#tasklist').addEventListener('beforeactivate', this.getNote.bind(this));
            //document.body.querySelectorAll('').addEventListener('click', this.deleteNote.bind(this));
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
            var uri = new Windows.Foundation.Uri("http://localhost:8080/task?finished=true&&token=" + token);
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
                var count = 1;
                for(var note in resJson){
                    var state = "undone";
                    if (resJson.finished === 1) state = "done";
                    html = html + "<div class=\"row\"><div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1\">" 
                    + count + "</div><div id=\"topAD\" class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\" role=\"button\" data-parent=\"#accordion\" aria-expanded=\"true\" aria-controls=\"collapseOne\"><span>" 
                    + resJson.taskname + "</span></div><div class=\"col-lg-5 col-md-5 col-sm-5 col-xs-5\">"
                    + state + "</div><div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2\"><button name=\"delete\" class=\"btn btn-danger btn-xs\" data-toggle=\"modal\" data-target=\"#deleteSource\" style=\"width:70px;margin-top:.5em\">Delete</button></div></div>";
                    count = count + 1;

                    var Notifications = Windows.UI.Notifications;
                    var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150Text02);

                    var seconds = 3600;
                    var dueTime = new Date(resJson.starttime);
                    var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.

                    var tileTextAttributes = tileXml.getElementsByTagName("text");
                    tileTextAttributes[0].appendChild(tileXml.createTextNode("Time Talker"));
                    tileTextAttributes[1].appendChild(tileXml.createTextNode("It's time for " + resJson.taskname));

                    // Create the notification object.
                    var futureTile = new Notifications.ScheduledTileNotification(tileXml, dueTime);
                    futureTile.id = "Tile" + idNumber;

                    // Set the expiration time on the notification
                    var expiryTime = new Date(dueTime.getTime() + seconds * 1000);
                    futureTile.expirationTime = expiryTime;

                    // Add to the schedule.
                    Notifications.TileUpdateManager.createTileUpdaterForApplication().addToSchedule(futureTile);
                }

                window.onload = function() {
                    document.getElementById("tasklist").innerHTML = html;
                }
            }
            catch (ex) {
                return;
            }
            return;
        },

        deleteNote: function (ev) {

        },

        createInvoked: function (ev) {
            var navbarCommand = ev.detail.navbarCommand;
            WinJS.log && WinJS.log(navbarCommand.label + " AppBarCommand invoked", "sample", "status");
            //var test = document.querySelector('select').focus();
            self.location = "/src/taskpage.html";
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