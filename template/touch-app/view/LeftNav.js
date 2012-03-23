Ext.define('TouchDocs.view.LeftNav', {

    extend: 'Ext.dataview.NestedList',
    xtype: 'leftNav',

    config: {
        title: 'Sencha Touch Docs',
        xtype: 'nestedlist',

        displayField: 'text',
        store: 'NavigationTree',
        useTitleAsBackText: false

        // listConfig: {
        //     items: [
        //         {
        //             docked: 'top',
        //             xtype: 'toolbar',
        //             items: [
        //                 {
        //                     xtype: 'searchfield'
        //                 }
        //             ]
        //         }
        //     ]
        // }
    }
});
