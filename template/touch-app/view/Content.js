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
        this.loadWelcomePage();
    },

    /**
     * Loads the initial welcome page.
     */
    loadWelcomePage: function() {
        this.setTitle("Welcome");
        this.setHtml(document.getElementById('welcome-content').innerHTML);
    },

    /**
     * Sets the title of toolbar.
     * @param {String} title
     */
    setTitle: function(title) {
        this.down("toolbar").setTitle(title);
    }

});
