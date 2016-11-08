$('#bloodhound .typeahead').typeahead({
    source:  function (query, process) {
        return $.get('/search?key=' + query , { query: query }, function (data) {
            data = $.parseJSON(data);
            return process(data);
        });
    }
});

var app = angular.module("WeatherTable",[]);
app.controller("TableController", function($scope) {
    $scope.cities = [];
    $scope.search = function () {
        $("#output").text("Loading...");
        var query = $('#bloodhound .typeahead').val();
        function getOutput(query) {
            if (query=="") {
                $("#output").text("Please enter a valid city");
                return;
            }
            return $.get('/city?key=' + query, {query: query}, function(data) {
                data = $.parseJSON(data);
                var city = addTable(data);
                $scope.cities.push(city);
                $scope.$apply();
                return data;
            });
        }
        output = getOutput(query);
    }
});


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
        var city = new Cities(city_name, temp, time);
        //list_of_citys.push(city);
        var content = "<table class=\"center\">";
        //content += '<tr><th> ' + 'City' + ' </th><th> ' + 'Temperature' + ' </th></tr>';
        content += '<tr><td> ' + city_name + ' </td><td> ' + temp + ' </td><td> ' + time + ' </tr>';
        content += "</table>"
        $("#tableDiv").append(content);
        $("#output").text("Search for a city");
        return city;
    } catch(err) {
        $("#output").text("Please enter a valid city");
        return;
    }
}

function getTime(unixTime) {
    var t = new Date(unixTime*1000);
    var hour = t.getHours();
    var min = t.getMinutes();
    var options = { timeZone: 'UTC', timeZoneName: 'short' };
    return t.toLocaleTimeString('en-GB',options);
}

class Cities {
    constructor(name,temp,time) {
        this.temp = temp;
        this.name = name;
        this.time = time;
    }
}
