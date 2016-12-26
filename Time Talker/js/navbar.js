(function () {
    "use strict";

    WinJS.UI.Pages.define("/src/navbar.html", {
        ready: function (element, options) {

            var addApt = document.getElementById("addApt");
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

            }
        }
    });
})();