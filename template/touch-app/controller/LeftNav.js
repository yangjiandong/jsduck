/**
 * Handles loading the page when item selected in LeftNav.
 *
 * Also toggles the LeftNav when button on main toolbar clicked.
 */
Ext.define('TouchDocs.controller.LeftNav', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
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
            this.addUrlToHistory('!/home');
        }
        else if (itemType === 'guide') {
            this.addUrlToHistory('!/guide/' + record.get('name'));
        }
        else if (record.get('className')) {
            this.addUrlToHistory('!/api/' + record.get('className'));
        }
        else if (itemType === 'video') {
            this.addUrlToHistory('!/video/' + record.get('name'));
        }
        else if (itemType === 'examples') {
            this.addUrlToHistory('!/example');
        }

        this.getMainContainer().setOpen(false);
    },

    addUrlToHistory: function(url) {
        TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
            url: url
        }));
    }

});
