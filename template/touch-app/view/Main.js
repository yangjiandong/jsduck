Ext.define("TouchDocs.view.Main", {
    extend: 'TouchDocs.view.SlideNav',
    xtype: 'mainContainer',

    config: {
        sideContainer: {
            xtype: 'leftNav',
            width: 260
        },

        container: {
            xtype: 'content'
        }
    }

});
