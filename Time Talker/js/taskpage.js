﻿(function () {
    "use strict";
    var navcontainer;

    // Figure 1
    var svg = d3.select("body").append("svg").append("g")

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    var width = 960 / 3, height = 450 / 3, radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function (d) { return d.data.label; };

    var color = d3.scale.ordinal()
        .domain(["Lorem ipsum", "dolor sit", "dsfsd", "dfsertsd"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    function randomData() {
        var labels = color.domain();
        return labels.map(function (label) {
            return { label: label, value: Math.random() }
        });
    }

    change(randomData());

    d3.select(".randomize")
        .on("click", function () {
            change(randomData());
        });


    function change(data) {

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function (d) { return color(d.data.label); })
            .attr("class", "slice");

        slice
            .transition().duration(1000)
            .attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.label;
            });

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")";
                };
            })
            .styleTween("text-anchor", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start" : "end";
                };
            });

        text.exit()
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline.exit()
            .remove();
    };

    WinJS.UI.Pages.define("/src/taskpage.html", {
        ready: function (element, options) {

            document.body.querySelector('#navBar').addEventListener('invoked', this.navbarInvoked.bind(this));
            document.body.querySelector('#accountFlyout').addEventListener('invoked', this.navbarInvoked.bind(this));
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
            var description = document.getElementById("description").value;
            //TODO

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
})();