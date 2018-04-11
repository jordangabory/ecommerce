var client = algoliasearch("L3E3RMHJBU", "f5a7555c009dfcabf7e108808f1ff931");
var index = client.initIndex('GigSchema');

autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    
    displayKey: 'name',
    
    templates: {
       
        suggestion: function(suggestion) {
          return '<a href="/service_detail/' + suggestion.objectID + '"><span>' +
            suggestion._highlightResult.title.value + '</span></a>';
        }
    }
});
