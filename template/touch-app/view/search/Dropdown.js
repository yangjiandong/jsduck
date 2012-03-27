Ext.define('TouchDocs.view.search.Dropdown', {
    extend: 'Ext.Panel',
    xtype: 'search',

    config: {
        layout: 'fit',

        width: 300,
        height: 300,
        modal: true,
        hideOnMaskTap: true,
        // Ensure the panel stays on top.
        // 99 is not enough, 100 seems to work.
        zIndex: 100,

        items: [
            {
                xtype: 'list',
                itemTpl: '{name}',
                store: 'Search'
            }
        ]
    }
});
