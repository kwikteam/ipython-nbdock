// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    "widgets/js/widget",
    "jqueryui",
    "base/js/utils",
    "bootstrap",
], function(widget, $, utils){
    "use strict";


    var DockView = BoxView.extend({
        render: function(){
            //DockView.__super__.render.apply(this);
            /** create a fake view in $el ..
             *  create a new view with the content and link it to $el
             * this.$box is where child will be added
             **/
            var that = this;

            this.$el.on("remove", function(){
                that.$dock.close();
                that.$window.remove();
            });

            this.$window = $('<div/>')
                .css('width', '300px')
                .css('height', '100px')
                .addClass('widget-area')
                .appendTo($('body'));
                // .mousedown(function(){
                //     that.bring_to_front();
                // });
            this.$box = $('<div />')
                .css('width', '100%')
                .css('height', '100%')
                // .addClass('modal-body')
                // .addClass('widget-modal-body')
                // .addClass('widget-box')
                // .addClass('vbox')
                .appendTo(this.$window);

            // Set the elements array since the this.$window element is not child
            // of this.$el and the parent widget manager or other widgets may
            // need to know about all of the top-level widgets.  The IPython
            // widget manager uses this to register the elements with the
            // keyboard manager.
            this.additional_elements = [this.$window];

            this.children_views.update(this.model.get('children'))

            //create a dock panel
            that.$dock = new dockspawn.PanelContainer(this.$window[0], dockManager);
            dockManager.floatDialog(that.$dock, 100, 100);
        }
    });

    return {
        'DockView': DockView,
    };
});
