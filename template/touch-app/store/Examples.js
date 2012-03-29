/**
 * Store for examples list.
 */
Ext.define('TouchDocs.store.Examples', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['title', 'section', 'description', 'icon', 'url'],
        groupField: 'section'
    },

    loadExamples: function() {
        var data = [], examples;
        Ext.Array.each(Docs.data.examples, function(section) {
            Ext.Array.each(section.items, function(example) {
                example.section = section.title;
                data.push(example);
            });
        });
        this.setData(data);
    }
});
