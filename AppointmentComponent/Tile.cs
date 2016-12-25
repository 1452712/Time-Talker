using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Notifications;
using Microsoft.Toolkit.Uwp.Notifications; // Notifications library


namespace AppointmentComponent
{
    public sealed class Tile
    {
        private TileContent content;
        //public string From { get; set; }
        //public string Subject { get; set; }
        //public string Body { get; set; }

        public Tile(string from, string subject, string body)
        {
            content = new TileContent()
            {
                Visual = new TileVisual()
                {
                    TileMedium = new TileBinding()
                    {
                        Content = new TileBindingContentAdaptive()
                        {
                            Children =
                    {
                        new AdaptiveText()
                        {
                            Text = from,
                            HintStyle = AdaptiveTextStyle.Subtitle
                        },

                        new AdaptiveText()
                        {
                            Text = subject,
                            HintStyle = AdaptiveTextStyle.CaptionSubtle
                        },

                        new AdaptiveText()
                        {
                            Text = body,
                            HintStyle = AdaptiveTextStyle.CaptionSubtle
                        }
                    }
                        }
                    }/*,

                TileWide = new TileBinding()
                {
                    Content = new TileBindingContentAdaptive()
                    {
                        Children =
                    {
                        new AdaptiveText()
                        {
                            Text = from,
                            HintStyle = AdaptiveTextStyle.Subtitle
                        },

                        new AdaptiveText()
                        {
                            Text = subject,
                            HintStyle = AdaptiveTextStyle.CaptionSubtle
                        },

                        new AdaptiveText()
                        {
                            Text = body,
                            HintStyle = AdaptiveTextStyle.CaptionSubtle
                        }
                    }
                    }
                }*/
                }
            };
        }
        public void Send()
        {
            var notification = new TileNotification(content.GetXml());

            // Will be deleted after 10 mins
            notification.ExpirationTime = DateTimeOffset.UtcNow.AddMinutes(30);

            // Send the notification to the primary tile
            TileUpdateManager.CreateTileUpdaterForApplication().Update(notification);
        }
    }
}
