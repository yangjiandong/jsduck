Ext.define('TouchDocs.view.search.Dropdown', {
    extend: 'Ext.Panel',
    xtype: 'search',

    config: {
        layout: 'fit',

        width: 300,
        height: 300,
        modal: true,
        hideOnMaskTap: true,

        items: [
            {
                xtype: 'list',
                itemTpl: '{name}',
                store: 'Search'
            }
        ]
    }
});
