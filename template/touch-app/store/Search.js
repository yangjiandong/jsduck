/**
 * Store for items shown in search results dropdown.
 */
Ext.define('TouchDocs.store.Search', {
    extend: 'Ext.data.Store',

    config: {
        model: 'TouchDocs.model.SearchResult'
    }
});
