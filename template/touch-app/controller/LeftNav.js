Ext.define('TouchDocs.controller.LeftNav', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            leftNav: 'leftNav',
            content: 'content',
            slideNav: 'mainContainer',
            mainTitleBar: 'content toolbar'
        },
        control: {
            'leftNav': {
                leafitemtap: 'onItemTap'
            },
            'content button[action=slideNav]': {
                tap: function(btn, e) {
                    Ext.getCmp('slideNav').toggle();
                    e.stopEvent();
                    return false;
                }
            }
        }
    },

    onItemTap: function(nestedlist, list, idx, target, record) {
        var itemType = record.get('type'),
            name = record.get('name');

        if (itemType === 'home') {
            this.showHome();
        }
        else if (itemType === 'guide') {
            this.showGuide(name);
        }
        else if (record.get('className')) {
            this.showClass(record.get('className'));
        }
        else if (itemType === 'video') {
            this.getMainTitleBar().setTitle(record.get('title'));
            this.getContent().setHtml([
                '<div class="guide-container">',
                    '<iframe src="http://player.vimeo.com/video/' + record.get('videoId') + '" width="640" height="480" frameborder="0"></iframe>',
                    '<p>' + record.get('description') + '</p>',
                '</div>'
            ].join(''));
        }

        this.getSlideNav().setOpen(false);
    },

    showGuide: function(name) {
        Ext.data.JsonP.request({
            url: "guides/" + name + "/README.js",
            callbackName: name,
            success: function(json) {
                this.getMainTitleBar().setTitle(json.title);
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
                this.getMainTitleBar().setTitle(json.name);
                this.getContent().setHtml('<div class="class-overview">' + json.html + '</div>');
            },
            scope: this
        });
    },

    showHome: function() {
        this.getContent().setHtml(document.getElementById('welcome-content').innerHTML);
    }
});
