/**
 * A search result model.
 */
Ext.define('TouchDocs.model.SearchResult', {
    extend: 'Ext.data.Model',

    config: {
        fields: ['name', 'fullName', 'icon', 'url', 'meta', 'sort']
    }
});

