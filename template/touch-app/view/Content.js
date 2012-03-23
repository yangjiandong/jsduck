Ext.define('TouchDocs.view.Content', {

    extend: 'Ext.Container',
    xtype: 'content',

    config: {

        id: 'center-container',
        style: 'border-left: 1px solid black',

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'Welcome',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'searchfield'
                    }
                ]
            }
        ],

        scrollable: 'vertical'
    }
})
