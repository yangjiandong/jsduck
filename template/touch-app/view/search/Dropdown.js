/**
 * Search results dropdown.
 *
 * Displays the content from Search store.
 */
Ext.define('TouchDocs.view.search.Dropdown', {
    extend: 'Ext.Panel',
    xtype: 'search',

    config: {
        layout: 'fit',

        width: 300,
        height: 482,
        modal: true,
        hideOnMaskTap: true,
        // Ensure the panel stays on top.
        // 99 is not enough, 100 seems to work.
        zIndex: 100,

        items: [
            {
                cls: 'search-dropdown',
                itemCls: 'item',
                baseCls: 'l',
                xtype: 'list',
                itemTpl: Ext.create('Ext.XTemplate',
                    '<div class="icon {icon}"></div>',
                    '<div class="meta">{[this.getMetaTags(values.meta)]}</div>',
                    '<div class="title {[this.getCls(values.meta)]}">{name}</div>',
                    '<div class="class">{fullName}</div>',
                    {
                        getCls: function(meta) {
                            return meta["private"] ? "private" : (meta.removed ? "removed" : "");
                        },
                        getMetaTags: function(meta) {
                            return Ext.Array.map(Docs.data.signatures, function(s) {
                                return meta[s.key] ? '<span class="signature '+s.key+'">'+(s["short"])+'</span>' : '';
                            }).join(' ');
                        }
                    }
                ),
                store: 'Search'
            }
        ]
    }
});
