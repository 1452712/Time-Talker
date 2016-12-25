
/*
var alarmApplicationManager = Windows.ApplicationModel.Background.AlarmApplicationManager;

var alarmAccessStatus = alarmApplicationManager.getAccessStatus();

if (alarmAccessStatus.unspecified != null || alarmAccessStatus.denied != null) {
    alarmAccessStatus = alarmApplicationManager.requestAccessAsync();
}

if (alarmAccessStatus.allowedWithWakeupCapability != null) {

} else if (alarmAccessStatus.allowedWithoutWakeupCapability != null) {

}
*/
var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();

//q("button.sendText", element).onclick = function (e) {
    // build and send the tile notification

    //tileContent.textHeadingWrap.text = q("#tileText", element).value;
    var squareTileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileSquare150x150Text04();
    squareTileContent.textBodyWrap.text = q("#tileText", element).value;
    //tileContent.squareContent = squareTileContent;
    updater.enableNotificationQueue(q("#enableQueueing", element).winControl.checked);
    updater.update(squareTileContent.createNotification());
//};