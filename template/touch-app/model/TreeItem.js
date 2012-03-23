Ext.define('TouchDocs.model.TreeItem', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'text',
            'type',
            'name',
            'description',
            'videoId',
            'className'
        ]
    }
});
