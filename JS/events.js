/*jshint esversion: 6 */

$('#bloodhound .typeahead').typeahead({
    source: function(query, process) {
        query = query.replace(/\\/g,"").replace(/"/g, "\\\"").replace(/'/g, "\\'");
        return $.get('/search?key=' + query, {
            query: query
        }, function(data) {
            data = $.parseJSON(data);
            return process(data);
        });
    }
});
var lastClicked = "";
var app = angular.module("WeatherTable", []);
app.controller("TableController", function($scope) {
    $scope.cities = [];
    $scope.search = function() {
        $("#output").text("Loading...");
        var query = $('#bloodhound .typeahead').val();
        query = query.replace(/\\/g,"").replace(/"/g, "\\\"").replace(/'/g, "\\'");
        function getOutput(query) {
            if (query === "") {
                $("#output").text("Please enter a valid city");
                return;
            }
            return $.get('/city?key=' + query, {
                query: query
            }, function(data) {
                data = $.parseJSON(data);
                if (data.hasOwnProperty('main')){
                    var city = addTable(data);
                    $scope.cities.push(city);
                    $scope.$apply();
                } else {
                    $('#output').text("Please enter a valid city");
                }
                return data;
            });
        }
        output = getOutput(query);
    };

    $scope.sortAscend = function(event) {
        if (lastClicked !== "") undoColor();
        $("#" + event.target.id).css("border-top", "7px solid red");
        lastClicked = event;
        var sortParam = getSortParam(event.target.id);
        var cities = sortAscending($scope.cities, sortParam);
        //$scope.$apply();
    };

    $scope.sortDescend = function(event) {
        if (lastClicked !== "") undoColor();
        $("#" + event.target.id).css("border-bottom", "7px solid red");
        lastClicked = event;
        var sortParam = getSortParam(event.target.id);
        var cities = sortDescending($scope.cities, sortParam);
        //console.log(cities);
    };

    $scope.deleteItem = function(x) {
        $scope.cities.splice(x,1);
    };
});

function undoColor() {
    if (lastClicked.target.id.includes("up")) {
        $("#" + lastClicked.target.id).css("border-bottom", "5px solid black");
    } else {
        $("#" + lastClicked.target.id).css("border-top", "5px solid black");
    }
}

function sortAscending(cities, sortParam) {
    cities.sort(function(a, b) {
        if (sortParam !== "name") {
            aProp = parseFloat(a[sortParam]);
            bProp = parseFloat(b[sortParam]);
        } else {
            aProp = a[sortParam];
            bProp = b[sortParam];
        }
        if (aProp > bProp) {
            return 1;
        }
        if (aProp < bProp) {
            return -1;
        }
        return 0;
    });
    return cities;
}
function sortDescending(cities, sortParam) {
    cities.sort(function(a, b) {
        if (sortParam === "name") {
            aProp = a[sortParam].toUpperCase();
            bProp = b[sortParam].toUpperCase();
        } else {
            aProp = parseInt(a[sortParam]);
            bProp = parseInt(b[sortParam]);
        }
        if (aProp < bProp) {
            return 1;
        }
        if (aProp > bProp) {
            return -1;
        }
        return 0;
    });
    return cities;
}

function getSortParam(a) {
    var returnParam = "";
    if (a.includes("city")) {
        returnParam = "name";
    } else if (a.includes("temp")) {
        returnParam = "temp";
    } else if (a.includes("humid")) {
        returnParam = "humidity";
    } else if (a.includes("press")) {
        returnParam = "pressure";
    }
    return returnParam;
}
/*$(".searchButton").click(function(){
    $("#output").text("Loading...");
    var query = $('#bloodhound .typeahead').val();
    function getOutput(query) {
        console.log(query);
        if (query=="") {
            $("#output").text("Please enter a valid city");
            return;
        }
        return $.get('/city?key=' + query, {query: query}, function(data) {
            data = $.parseJSON(data);
            addTable(data);
            return data;
        });
    }
    output = getOutput(query);
});*/


function addTable(data) {
    try {
        var temp = data.main.temp - 273.15;
        temp = temp.toFixed(2);
        var time = getTime(data.dt);
        var city_name = $('#bloodhound .typeahead').val();
        var humidity = data.main.humidity.toFixed(2);
        var pressure = data.main.pressure.toFixed(2);
        var city = new Cities(city_name, temp, time, humidity, pressure);
        $("#output").text("Search for a city");
        return city;
    } catch (err) {
        $("#output").text("Please enter a valid city");
        return;
    }
}

function getTime(unixTime) {
    var t = new Date(unixTime * 1000);
    var hour = t.getHours();
    var min = t.getMinutes();
    var options = {
        timeZone: 'UTC',
        timeZoneName: 'short'
    };
    return t.toLocaleTimeString('en-GB', options);
}

class Cities {
    constructor(name, temp, time, humidity, pressure) {
        this.temp = temp;
        this.name = name;
        this.time = time;
        this.humidity = humidity;
        this.pressure = pressure;
    }
}
