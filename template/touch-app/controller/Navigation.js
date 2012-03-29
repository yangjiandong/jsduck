/**
 * Handles navigation to different pages in app when browser history
 * is navigated.
 */
Ext.define('TouchDocs.controller.Navigation', {
    extend: 'Ext.app.Controller',

    config: {
        routes: {
            '!/api/:cls': {
                action: 'showClass',
                conditions: {
                    ':cls': "[0-9a-zA-Z\.]+"
                }
            },
            '!/api/:method': {
                action: 'showClassMember',
                conditions: {
                    ':method': "[0-9a-zA-Z\.\-]+"
                }
            },
            '!/guide/:name': {
                action: 'showGuide',
                conditions: {
                    ':name': "[0-9a-zA-Z_]+"
                }
            },
            '!/guide/:name:section': {
                action: 'showGuideSection',
                conditions: {
                    ':section': "-section-[0-9]+"
                }
            },
            '!/video/:name': 'showVideo',
            '!/home': 'showHome'
        },

        refs: {
            content: 'content'
        }
    },

    showGuide: function(name, callback) {
        if (this.currentContent === name) {
            if (callback) {
                callback();
            }
            return;
        }

        this.currentContent = name;

        Ext.Viewport.setMasked({ xtype: 'loadmask' });
        Ext.data.JsonP.request({
            url: "guides/" + name + "/README.js",
            callbackName: name,
            success: function(json) {
                this.getContent().setTitle(json.title);
                this.getContent().setHtml('<div class="guide-container">' + json.guide + '</div>');
                this.getContent().getScrollable().getScroller().scrollTo(0, 0);
                Ext.Viewport.setMasked(false);
                if (callback) {
                    callback();
                }
            },
            failure: function() {
                Ext.Viewport.setMasked(false);
            },
            scope: this
        });
    },

    showGuideSection: function(name, section) {
        var me = this;
        this.showGuide(name, function() {
            delete Ext.Element.cache[name + section];
            // Scroll to member
            var memberEl = Ext.get(name + section);
            if (memberEl) {
                me.getContent().getScrollable().getScroller().scrollTo(0, memberEl.dom.offsetTop - 10);
            }
        });
    },

    showClass: function(name, callback) {
        if (this.currentContent === name) {
            if (callback) {
                callback();
            }
            return;
        }

        this.currentContent = name;

        Ext.Viewport.setMasked({ xtype: 'loadmask' });
        Ext.data.JsonP.request({
            url: "output/" + name + ".js",
            callbackName: name.replace(/\./g, '_'),
            success: function(json) {
                this.getContent().setTitle(json.name);
                this.getContent().setHtml('<div class="class-overview">' + json.html + '</div>');
                Ext.Viewport.setMasked(false);
                if (callback) {
                    callback();
                }
            },
            failure: function() {
                Ext.Viewport.setMasked(false);
            },
            scope: this
        });
    },

    showClassMember: function(name) {
        var me = this,
            split = name.split('-'),
            cls = split[0],
            memberType = split[1],
            memberName = split[2];

        this.showClass(cls, function() {
            setTimeout(function() {
                // Delete this element from the cache
                delete Ext.Element.cache[split[1] + '-' + split[2]];
                // Scroll to member
                var memberEl = Ext.get(split[1] + '-' + split[2]);
                if (memberEl) {
                    me.getContent().getScrollable().getScroller().scrollTo(0, memberEl.dom.offsetTop - 5);
                    memberEl.toggleCls('open');
                }
            }, 150);
        });
    },

    showVideo: function(name) {
        var idx = Ext.getStore('NavigationTree').findBy(function(record, id) {
            if (record.get) {
                return record.get('type') === 'video' && record.get('name') === name;
            } else {
                return false;
            }
        });
        var record = Ext.getStore('NavigationTree').getAt(idx);

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
