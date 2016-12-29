(function () {
    "use strict";
    var navcontainer;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var filename = "settings.txt";

    WinJS.UI.Pages.define("/src/taskpage.html", {
        ready: function (element, options) {

            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.getElementById("createButton").addEventListener("click", addAppointment, false);
            document.body.querySelector('#saveButton').addEventListener('click', this.createTask.bind(this));
            document.body.querySelector('#cancelButton').addEventListener('click', this.goToList.bind(this));

            var navBarContainerEl = document.body.querySelector('#globalNav');
            if (navBarContainerEl) {
                this.setupNavBarContainer();
            } else {
                var navBarEl = document.getElementById('navBar');
                navBarEl.addEventListener('childrenprocessed', this.setupNavBarContainer.bind(this));
            }
        },


        createTask: function (ev) {
            var taskName = document.getElementById("taskname").value;
            var taskType = document.getElementById("tasktype").value;
            var startDate = document.getElementById("startdate").value;
            var endDate = document.getElementById("enddate").value;
            var repeat = document.getElementById("repeat").value;
            var beginTime = document.getElementById("begintime").value;
            var endTime = document.getElementById("endtime").value;
            var description = document.getElementById("description").value;
            var token = "";
            var time = {
                "date": repeat,
                "starttime": beginTime,
                "endtime": endTime
            };

            roamingFolder.getFileAsync(filename)
                .then(function (file) {
                    return token = Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (error) {
                    //Handle erors encounterd during read
                    console.log("Error reading file.")
                });
            //TODO
            var httpClient = new Windows.Web.Http.HttpClient();
            var uri = new Windows.Foundation.Uri("http://localhost:8080/task?token=" + token + "&&taskname=" + taskName +"&&description=" + description + "&&time=" + time.toString());
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
                    self.localtion = "/src/taskpage.html";
                    return;
                }
            }
            catch (ex) {
                self.location = "/src/taskpage.html";
                return;
            }
            
            self.location = "/src/tasklist.html";
        },

        goToList: function (ev) {
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

    function addAppointment(e) {
        // Create an Appointment that should be added the user's appointments provider app.
        var appointment = new Windows.ApplicationModel.Appointments.Appointment();

        // Get the selection rect of the button pressed to add this appointment
        var boundingRect = e.srcElement.getBoundingClientRect();
        var selectionRect = { x: boundingRect.left, y: boundingRect.top, width: boundingRect.width, height: boundingRect.height };

        // ShowAddAppointmentAsync returns an appointment id if the appointment given was added to the user's calendar.
        Windows.ApplicationModel.Appointments.AppointmentManager.showAddAppointmentAsync(appointment, selectionRect, Windows.UI.Popups.Placement.default)
            .done(function (appointmentId) {
                if (appointmentId) {
                    document.getElementById('removeIcon').hidden = true;
                    document.getElementById('checkmarkIcon').hidden = false;
                } else {
                    document.getElementById('removeIcon').hidden = false;
                    document.getElementById('checkmarkIcon').hidden = true;
                }
            });
    }
})();