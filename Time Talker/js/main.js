// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
            //args.setPromise(WinJS.UI.processAll());

            args.setPromise(WinJS.UI.processAll().then(function completed() {

                /*WinJS.Navigation.addEventListener("navigated", navigationToLogin, true);
                WinJS.Navigation.navigate("ms-appx:///src/login.html");
                */
                
                var webviewControl = document.getElementById("contentHost");
                //webviewControl.addEventListener("activate", updateTile);
                webviewControl.addEventListener("activate", tileNotificationExpiration);
                webviewControl.addEventListener("navigated", navigationToLogin);

                var uriPage = "ms-appx-web:///src/login.html";
                //var uriPage = "ms-appx-web:///demos/tileupdate/tileupdate.html"
                webviewControl.navigate(uriPage);

                // declarition
                //var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
                //initTileTextSection();

                // Appointment Component
                /* Example
                var button1 = document.getElementById("button1");
                button1.addEventListener("click", basics1, false);
                var button2 = document.getElementById("button2");
                button2.addEventListener("click", basics2, false);

                var runtimeButton1 = document.getElementById("runtimeButton1");
                runtimeButton1.addEventListener("click", runtime1, false);
                var runtimeButton2 = document.getElementById("runtimeButton2");
                runtimeButton2.addEventListener("click", runtime2, false);
                */
            }));
		}

		isFirstActivation = false;
    };

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };

    ///////////////////////////////////

    function navigationToLogin(eventObject) {
        var url = eventObject.detail.location;
        var host = document.getElementById("contentHost");

        //WinJS.UI.Pages.render(url, host);
        // Call unload method on current scenario, if there is one
       // host.winControl && host.winControl.unload && host.winControl.unload();
        WinJS.Utilities.empty(host);
        eventObject.detail.setPromise(WinJS.UI.Pages.render(url, host, eventObject.detail.state).then(function () {
           WinJS.Application.sessionState.lastUrl = url;
        }));
    }

    function initTileTextSection() {
        var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();

        //q("button.sendText", element).onclick = function (e) {
            // build and send the tile notification

            //tileContent.textHeadingWrap.text = q("#tileText", element).value;
            var squareTileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileSquare150x150Text04();
            //squareTileContent.textBodyWrap.text = q("#tileText", element).value;
            squareTileContent.textBodyWrap.text = "test";
            //tileContent.squareContent = squareTileContent;
            //updater.enableNotificationQueue(q("#enableQueueing", element).winControl.checked);
            updater.enableNotificationQueue(true);
            updater.update(squareTileContent.createNotification());
        //};

        //q("button.clear", element).onclick = function (e) {
            //updater.clear();
        //};
    }

    //Appointment Compoennt
    /* Example
    var ex;

    function basics1() {
        document.getElementById('output').innerHTML =
            AppointmentComponent.Example.getAnswer();

        ex = new AppointmentComponent.Example();

        document.getElementById('output').innerHTML += "<br/>" +
            ex.sampleProperty;

    }

    function basics2() {
        ex.sampleProperty += 1;
        document.getElementById('output').innerHTML += "<br/>" +
            ex.sampleProperty;
    }

    var propertysetstats;

    function runtime1() {
        document.getElementById('output').innerHTML = "";

        propertysetstats = new AppointmentComponent.PropertySetStats();
        var propertyset = propertysetstats.propertySet;

        propertyset.addEventListener("mapchanged", onMapChanged);

        propertyset.insert("FirstProperty", "First property value");
        propertyset.insert("SuperfluousProperty", "Unnecessary property value");
        propertyset.insert("AnotherProperty", "A property value");

        propertyset.insert("SuperfluousProperty", "Altered property value")
        propertyset.remove("SuperfluousProperty");

        document.getElementById('output').innerHTML +=
            propertysetstats.displayStats();
    }

    function onMapChanged(change) {
        var result
        switch (change.collectionChange) {
            case Windows.Foundation.Collections.CollectionChange.reset:
                result = "All properties cleared";
                break;
            case Windows.Foundation.Collections.CollectionChange.itemInserted:
                result = "Inserted " + change.key + ": '" +
                    change.target.lookup(change.key) + "'";
                break;
            case Windows.Foundation.Collections.CollectionChange.itemRemoved:
                result = "Removed " + change.key;
                break;
            case Windows.Foundation.Collections.CollectionChange.itemChanged:
                result = "Changed " + change.key + " to '" +
                    change.target.lookup(change.key) + "'";
                break;
            default:
                break;
        }

        document.getElementById('output').innerHTML +=
            "<br/>" + result;
    }

    function runtime2() {
        try {
            propertysetstats.addMore();
        }
        catch (ex) {
            document.getElementById('output').innerHTML +=
                "<br/><b>" + ex + "<br/>";
        }

        document.getElementById('output').innerHTML +=
            propertysetstats.displayStats();
    }
    */
    function updateTile() {
        // Need to get new Info
        var from = "Jennifer Parker";
        var subject = "Photos from our trip";
        var body = "Check out these awesome photos I took while in New Zealand!";

        try {
            var tile = new AppointmentComponent.Tile(from, subject, body);
            //var tile = AppointmentComponent.tile();
            tile.send();
        }
        catch (ex) {
            return;
        }
    }

    function tileNotificationExpiration() {
        var Notifications = Windows.UI.Notifications;
        var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150Text02);

        var seconds = 60;
        var delayMin = 1;
        var currentTime = new Date();
        var dueTime = new Date(currentTime.getTime() + seconds * delayMin * 1000);
        var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.

        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode("Time Talker"));
        tileTextAttributes[1].appendChild(tileXml.createTextNode("Plan"));

        // Create the notification object.
        var futureTile = new Notifications.ScheduledTileNotification(tileXml, dueTime);
        futureTile.id = "Tile" + idNumber;

        // Set the expiration time on the notification
        var expiryTime = new Date(dueTime.getTime() + seconds * 1000);
        futureTile.expirationTime = expiryTime;

        // Add to the schedule.
        Notifications.TileUpdateManager.createTileUpdaterForApplication().addToSchedule(futureTile);
    }


    ///////////////////////////////////

	app.start();

})();
