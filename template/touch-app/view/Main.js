Ext.define("TouchDocs.view.Main", {

    extend: 'Ext.Container',
    xtype: 'mainContainer',

    config: {

        layout: 'card',

        items: [
            {
                xtype: 'leftNav',
                docked: 'left',
                width: 260
            },
            {
                xtype: 'content',
                flex: 1
            }
        ]
    }
});
