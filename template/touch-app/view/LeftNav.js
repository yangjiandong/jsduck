/**
 * Left-side navigation component.
 *
 * Displays the content of NavigationTree store.
 */
Ext.define('TouchDocs.view.LeftNav', {
    extend: 'Ext.dataview.NestedList',
    xtype: 'leftNav',

    config: {
        title: 'Sencha Touch Docs',

        store: 'NavigationTree',
        useTitleAsBackText: false,

        listConfig: {
            cls: 'navList',
            itemTpl: [
                '<span class="{iconCls}"></span>{text}'
            ]
        }
    },

    /**
     * Sets the active node in the Navigation tree
     * @param {Object/Ext.data.Node} node  Either a node, or an object with which to search the treestore.
     * If an object, searches the treestore for a node matching each key -> value pair.
     */
    setActiveNode: function(node) {
        if (node && !node.isModel) {
            var nodes = Ext.Array.filter(this.getStore().getData().all, function(record, id) {
                if (record.get) {
                    return Ext.Array.every(Object.keys(node), function(k) {
                        return record.get(k) === node[k];
                    });
                } else {
                    return false;
                }
            });
            node = nodes[0];
        }
        if (node) {
            this.goToNode(node.parentNode);
            this.goToLeaf(node);
            this.getActiveItem().select(node); // Fine the active item (the list containing the node), then select the node.
        }
    }
});
