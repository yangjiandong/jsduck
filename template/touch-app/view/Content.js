/**
 * Main content area of the app.
 *
 * Also contains toolbar with side navigation toggling button and
 * search field.
 */
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
                        action: 'toggleNavigation'
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
