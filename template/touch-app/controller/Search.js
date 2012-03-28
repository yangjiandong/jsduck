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
            },
            'search list': {
                itemtap: 'onItemTap'
            }
        }
    },

    onSearch: function(field) {
        var results = this.filter(field.getValue());
        Ext.getStore('Search').setData(results);

        this.showSearch();
    },

    filter: function(query) {
        if (query === "") {
            return [];
        }
        else {
            return Docs.ClassRegistry.search(query).slice(0, 10);
        }
    },

    showSearch: function() {
        if (!this.searchDropdown) {
            this.searchDropdown = Ext.create('TouchDocs.view.search.Dropdown');
        }

        if (Ext.getStore('Search').getData().length > 0) {
            this.searchDropdown.showBy(this.getSearchField());
        }
        else {
            this.searchDropdown.hide();
        }
    },

    onItemTap: function(list, idx, target, record) {
        var url = record.get('url').replace(/^#/, '');
        TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
            url: url
        }));
        this.searchDropdown.hide();
    }
});
