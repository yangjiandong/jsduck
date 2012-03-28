//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'Docs': 'app',
    'TouchDocs': 'touch-app'
});
//</debug>

Ext.application({
    name: 'TouchDocs',
    appFolder: 'touch-app',

    eventPublishers: {
        touchGesture: {
            recognizers: {
                offscreenswipe: {
                    xclass: 'TouchDocs.recognizer.OffscreenSwipe'
                }
            }
        }
    },

    requires: [
        'Ext.MessageBox',
        'Docs.ClassRegistry'
    ],

    views: [
        'Main',
        'LeftNav',
        'Content',
        'search.Dropdown'
    ],

    stores: [
        'NavigationTree',
        'Search'
    ],

    models: [
        'TreeItem',
        'SearchResult'
    ],

    controllers: [
        'LeftNav',
        'Search'
    ],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },

    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        Ext.getStore('NavigationTree').setNavigationData(Docs.data);

        // Initialize the main view
        Ext.Viewport.add(Ext.create('TouchDocs.view.Main'));

        // setInterval(function(){
        //     Ext.DomQuery.select('link')[0].href = "resources/css/app.css?" + Math.ceil(Math.random() * 100000000)
        // }, 1000);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
