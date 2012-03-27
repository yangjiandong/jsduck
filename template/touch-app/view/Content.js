Ext.define('TouchDocs.view.Content', {

    extend: 'Ext.Container',
    xtype: 'content',

    config: {

        id: 'center-container',

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'Welcome',
                items: [
                    {
                        iconCls: 'list',
                        iconMask: true,
                        action: 'slideNav'
                    },
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
    },

    initialize: function() {
        this.callParent();
        this.setHtml(document.getElementById('welcome-content').innerHTML);
    }

});
