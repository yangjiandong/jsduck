Ext.define("TouchDocs.view.SlideNav", {
    extend: 'Ext.Container',

    config: {
        layout: 'fit',
        open: false,
        sideContainer: null,
        container: null
    },

    applySideContainer: function(config) {
        return Ext.factory(config);
    },

    updateSideContainer: function(newSideContainer, oldSideContainer) {
        if (newSideContainer) {
            this.add(newSideContainer);
        }

        if (oldSideContainer) {
            this.remove(oldSideContainer);
        }
    },

    applyContainer: function(config) {
        return Ext.factory(config);
    },

    updateContainer: function(newContainer, oldContainer) {
        if (newContainer) {
            newContainer.setZIndex(100);
            this.add(newContainer);

            newContainer.element.on({
                tap: this.onContainerTap,
                dragstart: this.onDragStart,
                drag: this.onDrag,
                dragend: this.onDragEnd,
                scope: this
            });
        }

        if (oldContainer) {
            this.remove(oldContainer);
        }
    },

    toggle: function() {
        if (this.getOpen()) {
            this.setOpen(false);
        } else {
            this.setOpen(true);
        }
    },

    onContainerTap: function(e) {
        if (!this.getOpen()) {
            return;
        }

        this.setOpen(false);
        e.stopEvent();
    },

    onDragStart: function(e) {
        var touch = e.changedTouches[0],
            startX = touch.pageX;

        if (startX < 50 && !this.getOpen()) {
            this.canOpen = true;
        } else {
            this.canOpen = false;
            this.onContainerTap(e);
        }
    },

    onDrag: function(e) {
        var touch = e.changedTouches[0],
            startX = Math.min(touch.pageX, this.getSideContainer().getWidth());

        if (this.lastX && startX > this.lastX) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
        this.lastX = startX;

        if (this.canOpen) {
            this.getContainer().element.dom.style.setProperty('-webkit-transform', 'translateX(' + startX + 'px)', 'important');
        }
    },

    onDragEnd: function(e) {
        if (this.canOpen === false) {
            return;
        }

        this.canOpen = false;

        var touch = e.changedTouches[0],
            sideContainerWidth = this.getSideContainer().getWidth(),
            startX = Math.min(touch.pageX, sideContainerWidth);

        if ((this.direction === 'right') || startX > (sideContainerWidth / 2)) {
            this.setOpen(true);
        } else {
            this.setOpen(false);
            this.updateOpen(false);
        }
    },

    updateOpen: function(newOpen) {
        // don't animate when initially closed
        if (!this.initialized && !newOpen) {
            return;
        }

        this.animate(newOpen);
    },

    animate: function(open) {
        Ext.Animator.run({
            element: this.getContainer().element,
            easing: 'ease-out',
            duration: 250,
            to: {
                transform: {
                    translateX: open ? this.getSideContainer().getWidth() : 0
                }
            },
            preserveEndState: true
        });
    }
});
