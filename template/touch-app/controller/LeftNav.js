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
            TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
                url: '!/home'
            }));
        }
        else if (itemType === 'guide') {
            TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
                url: '!/guide/' + record.get('name')
            }));
        }
        else if (record.get('className')) {
            TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
                url: '!/api/' + record.get('className')
            }));
        }
        else if (itemType === 'video') {
            TouchDocs.app.getHistory().add(Ext.create('Ext.app.Action', {
                url: '!/video/' + record.get('name')
            }));
        }

        this.getMainContainer().setOpen(false);
    }

});
