using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation.Collections;

namespace AppointmentComponent
{
    public sealed class PropertySetStats
    {
        private PropertySet _ps;
        public PropertySetStats()
        {
            _ps = new PropertySet();
            _ps.MapChanged += this.MapChangedHandler;
        }

        public PropertySet PropertySet { get { return _ps; } }

        int[] counts = { 0, 0, 0, 0 };
        private void MapChangedHandler(IObservableMap<string, object> sender,
            IMapChangedEventArgs<string> args)
        {
            counts[(int)args.CollectionChange] += 1;
        }

        public string DisplayStats()
        {
            StringBuilder report = new StringBuilder("<br/>Number of changes:<ul>");
            for (int i = 0; i < counts.Length; i++)
            {
                report.Append("<li>" + (CollectionChange)i + ": " + counts[i] + "</li>");
            }
            return report.ToString() + "</ul>";
        }

        public void AddMore()
        {
            _ps.Add("NewProperty", "New property value");
            _ps.Add("AnotherProperty", "A property value");
        }

    }
}
