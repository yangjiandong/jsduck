/**
 * Store for items in LeftNav navigation tree.
 */
Ext.define('TouchDocs.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'Docs.view.cls.PackageLogic'
    ],

    config: {
        model: 'TouchDocs.model.TreeItem'
    },

    /**
     * Loads data to store from Docs.data object.  Called from touch-app.js.
     *
     * @param {Object} data An object with properties:
     * @param {Object[]} data.classes
     * @param {Object[]} data.guides
     * @param {Object[]} data.videos
     */
    setNavigationData: function(data) {
        this.setData({
            text: 'Sencha Touch Docs',
            children: [
                { text: 'Home', type: 'home', leaf: true, iconCls: 'icon-sencha' },
                { text: 'Classes', children: this.createClasses(data.classes), iconCls: 'icon-class' },
                { text: 'Guides', children: this.createGuides(data.guides), iconCls: 'icon-guide' },
                { text: 'Videos', children: this.createVideos(data.videos), iconCls: 'icon-video' },
                { text: 'Examples', type: 'examples', leaf: true, iconCls: 'icon-example' }
            ]
        });
    },

    createClasses: function(classes) {
        var logic = Ext.create('Docs.view.cls.PackageLogic', { classes: classes });
        return logic.create().root.children;
    },

    createGuides: function(guides) {
        return this.createSections(guides, function(g) {
            return {
                text: g.title,
                leaf: true,
                type: 'guide',
                name: g.name,
                iconCls: 'icon-guide'
            };
        }, this);
    },

    createVideos: function(videos) {
        return this.createSections(videos, function(v) {
            return {
                text: v.title,
                leaf: true,
                type: 'video',
                videoId: v.id,
                description: v.description,
                name: v.name,
                iconCls: 'icon-video'
            };
        }, this);
    },

    // Helper for creating guides and videos which both have sections
    createSections: function(sectionsList, createNode, scope) {
        return Ext.Array.map(sectionsList, function(section) {
            return {
                text: section.title,
                iconCls: 'icon-pkg',
                children: Ext.Array.map(section.items, createNode, scope||this)
            };
        });
    }
});
