(function () {
    "use strict";
    var navcontainer;

    WinJS.UI.Pages.define("/src/navbar.html", {
        ready: function (element, options) {

            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));

            var navBarContainerEl = document.body.querySelector('#globalNav');
            if (navBarContainerEl) {
                this.setupNavBarContainer();
            } else {
                var navBarEl = document.getElementById('navBar');
                navBarEl.addEventListener('childrenprocessed', this.setupNavBarContainer.bind(this));
            }


            /*var addApt = document.getElementById("addApt");
            addApt.addEventListener("click", addAppointment, true);

            function addAppointment() {

                //var addAppointmentOperation = promise.operation;
                //var addAppointmentOperation = new Windows.ApplicationModel.Appointments.AppointmentsProvider.addAppointmentOperation();
                //addAppointmentOperation.dismissUI();
                //var appointment = new Windows.ApplicationModel.Appointments.Appointment();

                //var appointmentManager = Windows.ApplicationModel.Appointments.AppointmentManager;
                //var user = Windows.System.User;
                //appointmentManager.getForUser(user);

                var name = "test";
                var options = Windows.ApplicationModel.Appointments.AppointmentStoreAccessType.appCalendarsReadWrite;
                var apppointmentStore = Windows.ApplicationModel.Appointments.AppointmentManager.requestStoreAsync(options);
                //apppointmentStore.createAppointmentCalendarAsync(name);
                //var value = new Windows.ApplicationModel.Activation.ActivationKind.appointmentsProvider;

            }*/
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