/**
 * Handles typing a query to search field.
 */
Ext.define('TouchDocs.controller.Search', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            searchField: 'searchfield'
        },
        control: {
            'searchfield': {
                keyup: 'onSearch',
                focus: 'showSearch'
            }
        }
    },

    onSearch: function(field) {
        var results = this.filter(field.getValue());
        Ext.getStore('Search').setData(results);

        if (!this.searchDropdown) {
            this.searchDropdown = Ext.create('TouchDocs.view.search.Dropdown');
        }

        if (results.length > 0) {
            this.searchDropdown.showBy(this.getSearchField());
        }
        else {
            this.searchDropdown.hide();
        }
    },

    filter: function(query) {
        if (query === "") {
            return [];
        }
        else {
            return Docs.ClassRegistry.search(query).slice(0, 10);
        }
    }
});
