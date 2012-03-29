/**
 * Renders search results list.
 */
Ext.define('Docs.view.search.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.searchcontainer',
    requires: [
        'Docs.view.search.Field',
        'Docs.view.search.Dropdown'
    ],

    initComponent: function() {
        if (Docs.data.search.length) {
            this.cls = 'search-container';

            this.items = [
                {
                    xtype: 'searchfield'
                },
                {
                    xtype: 'searchdropdown'
                }
            ];
        }

        this.callParent();
    }
});
