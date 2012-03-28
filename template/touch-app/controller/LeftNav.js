/**
 * Handles loading the page when item selected in LeftNav.
 *
 * Also toggles the LeftNav when button on main toolbar clicked.
 */
Ext.define('TouchDocs.controller.LeftNav', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            leftNav: 'leftNav',
            content: 'content',
            mainContainer: 'mainContainer'
        },
        control: {
            'leftNav': {
                leafitemtap: 'onItemTap'
            },
            'content button[action=toggleNavigation]': {
                tap: function(btn, e) {
                    this.getMainContainer().toggle();
                    e.stopEvent();
                    return false;
                }
            }
        }
    },

    onItemTap: function(nestedlist, list, idx, target, record) {
        var itemType = record.get('type');

        if (itemType === 'home') {
            this.showHome();
        }
        else if (itemType === 'guide') {
            this.showGuide(record.get('name'));
        }
        else if (record.get('className')) {
            this.showClass(record.get('className'));
        }
        else if (itemType === 'video') {
            this.showVideo(record);
        }

        this.getMainContainer().setOpen(false);
    },

    showGuide: function(name) {
        Ext.data.JsonP.request({
            url: "guides/" + name + "/README.js",
            callbackName: name,
            success: function(json) {
                this.getContent().setTitle(json.title);
                this.getContent().setHtml('<div class="guide-container">' + json.guide + '</div>');
            },
            scope: this
        });
    },

    showClass: function(name) {
        Ext.data.JsonP.request({
            url: "output/" + name + ".js",
            callbackName: name.replace(/\./g, '_'),
            success: function(json) {
                this.getContent().setTitle(json.name);
                this.getContent().setHtml('<div class="class-overview">' + json.html + '</div>');
            },
            scope: this
        });
    },

    showVideo: function(record) {
        this.getContent().setTitle(record.get('title'));
        this.getContent().setHtml([
            '<div class="guide-container">',
                '<iframe src="http://player.vimeo.com/video/' + record.get('videoId') + '" width="640" height="480" frameborder="0"></iframe>',
                '<p>' + record.get('description') + '</p>',
            '</div>'
        ].join(''));
    },

    showHome: function() {
        this.getContent().loadWelcomePage();
    }
});
