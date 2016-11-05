$('#bloodhound .typeahead').typeahead({
    source:  function (query, process) {
        console.log('u');
        return $.get('/search?key=' + query , { query: query }, function (data) {
                data = $.parseJSON(data);
              return process(data);
        });
    }
});

$(".searchButton").click(function(){
  var query = $('#bloodhound .typeahead').val();
  console.log(query);
  function getOutput(query) {
      return $.get('/city?key=' + query, {query: query}, function(data) {
          data = $.parseJSON(data);
          console.log(data);
          return data;
      });
}
output = getOutput(query);
    console.log(output);
    console.log(output.responseText);
});
