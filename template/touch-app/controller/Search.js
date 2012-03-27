Ext.define('TouchDocs.controller.Search', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            searchField: 'searchfield'
        },
        control: {
            'searchfield': {
                keyup: 'onSearch'
            }
        }
    },

    onSearch: function(field) {
        var results = Docs.ClassRegistry.search(field.getValue()).slice(0, 10);
        Ext.getStore('Search').setData(results);

        if (!this.searchDropdown) {
            this.searchDropdown = Ext.create('TouchDocs.view.search.Dropdown');
        }
        this.searchDropdown.showBy(this.getSearchField());
    }
});
