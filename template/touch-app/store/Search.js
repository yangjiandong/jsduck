/**
 * Store for keeping search results.
 */
Ext.define('TouchDocs.store.Search', {
    extend: 'Ext.data.Store',

    config: {
        model: 'TouchDocs.model.SearchResult'
    }
});
