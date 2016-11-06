$('#bloodhound .typeahead').typeahead({
    source:  function (query, process) {
        return $.get('/search?key=' + query , { query: query }, function (data) {
            data = $.parseJSON(data);
            return process(data);
        });
    }
});

$(".searchButton").click(function(){
    $("#output").text("Loading...");
    var query = $('#bloodhound .typeahead').val();
    function getOutput(query) {
        return $.get('/city?key=' + query, {query: query}, function(data) {
            data = $.parseJSON(data);
            addTable(data);
            return data;
        });
    }
    output = getOutput(query);
});

function addTable(data) {
    console.log(data);
    var temp = data.main.temp - 273.15;
    temp = temp.toFixed(2);
    var time = getTime(data.dt);
    var city_name = $('#bloodhound .typeahead').val();
    var content = "<table class=\"center\">";
    //content += '<tr><th> ' + 'City' + ' </th><th> ' + 'Temperature' + ' </th></tr>';
    content += '<tr><td> ' + city_name + ' </td><td> ' + temp + ' </td><td> ' + time + ' </tr>';
    content += "</table>"
    $("#tableDiv").append(content);
    $("#output").text("Search for a city");
}

function getTime(unixTime) {
    var t = new Date(unixTime*1000);
    var hour = t.getHours();
    var min = t.getMinutes();
    var options = { timeZone: 'UTC', timeZoneName: 'short' };
    return t.toLocaleTimeString('en-GB',options);
}
