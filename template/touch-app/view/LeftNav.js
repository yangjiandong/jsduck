Ext.define('TouchDocs.view.LeftNav', {
    extend: 'Ext.dataview.NestedList',
    xtype: 'leftNav',

    config: {
        title: 'Sencha Touch Docs',

        store: 'NavigationTree',
        useTitleAsBackText: false,

        listConfig: {
            cls: 'navList',
            itemTpl: [
                '<span class="{iconCls}"></span>{text}'
            ]
        }
    }
});
