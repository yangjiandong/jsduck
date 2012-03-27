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
                        xtype: 'searchfield',
                        placeHolder: 'Search',
                        width: 170
                    }
                ]
            }
        ],

        scrollable: 'vertical'
    },

    initialize: function() {
        this.callParent();
        this.setHtml(document.getElementById('welcome-content').innerHTML);

        this.element.addListener('tap', function(cmp, el) {
            Ext.get(el).up('.member').toggleCls('open');
        }, this, {
            preventDefault: true,
            delegate: '.expandable'
        });

        // Do nothing when clicking on not-expandable items
        this.element.addListener('click', Ext.emptyFn, this, {
            preventDefault: true,
            delegate: '.not-expandable'
        });
    }

});
