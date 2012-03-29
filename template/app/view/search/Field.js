/**
 * The field for typing in search query.
 *
 * Forwards the triggerclick callback as event to be handled in controller.
 */
Ext.define('Docs.view.search.Field', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.searchfield',
    cls: 'search-field',

    triggerCls: 'reset',
    emptyText: 'Search',
    width: 170,
    enableKeyEvents: true,
    hideTrigger: true,

    onTriggerClick: function() {
        /**
         * @event triggerclick
         * Fired when trigger clicked.
         * @param {Ext.form.field.Trigger} this
         */
        this.fireEvent("triggerclick", this);
    }
});
