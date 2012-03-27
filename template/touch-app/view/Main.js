/**
 * The main viewport of the app.
 *
 * A concrete use of the SlideNav component containing
 * TouchDocs.view.Content and TouchDocs.view.LeftNav.
 */
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
