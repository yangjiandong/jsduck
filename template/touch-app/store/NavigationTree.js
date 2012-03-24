Ext.define('TouchDocs.store.NavigationTree', {

    extend: 'Ext.data.TreeStore',
    requires: [
        'Docs.view.cls.Logic',
        'Docs.view.cls.PackageLogic'
    ],

    config: {
        model: 'TouchDocs.model.TreeItem'
    },

    setNavigationData: function(data) {

        var guides, videos, logic;
        var tree = {
            text: 'Sencha Touch Docs',
            children: [
                { text: 'Home', type: 'home', leaf: true },
                { text: 'Classes', children: [] },
                { text: 'Guides', children: [] },
                { text: 'Videos', children: [] }
            ]
        };

        Ext.Array.each(data.guides, function(guideSection) {
            guides = [];
            Ext.Array.each(guideSection.items, function(guide) {
                guides.push({ text: guide.title, leaf: true, type: 'guide', name: guide.name });
            });
            tree.children[2].children.push({ text: guideSection.title, children: guides });
        });

        Ext.Array.each(data.videos, function(videoSection) {
            videos = [];
            Ext.Array.each(videoSection.items, function(video) {
                videos.push({ text: video.title, leaf: true, type: 'video', videoId: video.id, description: video.description, name: video.name });
            });
            tree.children[3].children.push({ text: videoSection.title, children: videos });
        });


        logic = Ext.create('Docs.view.cls.PackageLogic', { classes: Docs.data.classes });
        tree.children[1].children = logic.create().root.children;

        this.setData(tree);
    }
});
