define(function (require) {
    "use strict";


    var IPython = require('base/js/namespace');
    var $ = require('jquery');
    var events = require("base/js/events");
    var dockspawn = require('/nbextensions/nbdock/static/dockspawn/dockspawn.js');
    var codecell = require('notebook/js/codecell');


    var storeKey = 'lastState';

    var dockManager;





    IPython.toolbar.add_buttons_group([
        {
            id : 'refresh_layout',
            label : 'Refresh Layout',
            icon : 'fa-mortar-board',
            callback : function () {
                localStorage.setItem(storeKey, '');
                location.reload();
            }
        },
    ]);

        IPython.toolbar.add_buttons_group([
        {
            id : 'refresh_layout',
            label : 'Refresh Layout',
            icon : 'fa-mortar-board',
            callback : function () {

                var nb = IPython.notebook; // get the current notebook...
                var cell_options = {
                    events: nb.events,
                    config: nb.config,
                    keyboard_manager: nb.keyboard_manager,
                    notebook: nb,
                    tooltip: nb.tooltip,
                };
                var cell = new codecell.CodeCell(nb.kernel, cell_options);
                cell.set_input_prompt();
                cell.element.find("div.input_prompt").hide();
                cell.element.find("div.output_prompt").hide();
                cell.element.find("div.prompt").hide();

                var mycell = $('<div></div>');
                $('body').append(mycell);
                $('<a>exec</a>')
                    .appendTo(mycell)
                    .on('click', function() {
                        cell.execute();
                        cell.element.find("div.output_prompt").hide();
                    });
                $('<a>toggle</a>')
                    .appendTo(mycell)
                    .on('click', function() {
                        cell.element.find("div.input").toggle('show');
                    });

                mycell.append(cell.element);




                //if(this._insert_element_at_index(cell.element,index)) {

                var nbp = new dockspawn.PanelContainer(mycell[0], dockManager);
                dockManager.floatDialog(nbp, 100, 100);

                cell.render();
                //this.events.trigger('create.Cell', {'cell': cell, 'index': index});
                cell.refresh();
                //nb.set_dirty(true);
            }
        },
    ]);

    var createWindows = function() {


        // Convert a div to the dock manager. Panels can then be docked on to it
        //var divDockManager = document.getElementById('ipython-main-app');
        var divDockManager = document.getElementById('sited');
        dockManager = new dockspawn.DockManager(divDockManager);
        dockManager.initialize();


        var lastState = localStorage.getItem(storeKey);
        if (lastState) {
            dockManager.loadState(lastState);
        }

        // Let the dock manager element fill in the entire screen
        window.onresize = function () {
            dockManager.resize(
                window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft),
                window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop)
            );
        };
        window.onresize();

        dockManager.addLayoutListener({
            onDock: function(self, dockNode){
                console.log('onDock: ', self, dockNode);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onUndock:function(self, dockNode){
                console.log('onUndock: ', self, dockNode);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onCreateDialog:function(self, dialog){
                console.log('onCreateDialog: ', self, dialog);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onChangeDialogPosition:function(self, dialog, x, y){
                console.log('onCreateDialog: ', self, dialog, x, y);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onResumeLayout:function(self){
                console.log('onResumeLayout: ', self);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onClosePanel:function(self, panel){
                console.log('onClosePanel: ', self, panel);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onHideDialog:function(self, dialog){
                console.log('onHideDialog: ', self, dialog);
                localStorage.setItem(storeKey, dockManager.saveState());
            },
            onShowDialog:function(self, dialog){
                console.log('onShowDialog: ', self, dialog);
                localStorage.setItem(storeKey, dockManager.saveState());
            }
        });


        if (!lastState) {
            // Convert existing elements on the page into "Panels".
            // They can then be docked on to the dock manager
            // Panels get a titlebar and a close button, and can also be
            // converted to a floating dialog box which can be dragged / resized
            var solution = new dockspawn.PanelContainer(document.getElementById("solution_window"), dockManager);
            var properties = new dockspawn.PanelContainer(document.getElementById("properties_window"), dockManager);
            var toolbox = new dockspawn.PanelContainer(document.getElementById("toolbox_window"), dockManager);
            var outline = new dockspawn.PanelContainer(document.getElementById("outline_window"), dockManager);
            var problems = new dockspawn.PanelContainer(document.getElementById("problems_window"), dockManager);
            var output = new dockspawn.PanelContainer(document.getElementById("output_window"), dockManager);
            var editor1 = new dockspawn.PanelContainer(document.getElementById("editor1_window"), dockManager);
            var editor2 = new dockspawn.PanelContainer(document.getElementById("editor2_window"), dockManager);
            var infovis = new dockspawn.PanelContainer(document.getElementById("infovis"), dockManager);
            var nb = new dockspawn.PanelContainer(document.getElementById("notebook_panel"), dockManager);

            // Dock the panels on the dock manager
            var documentNode = dockManager.context.model.documentManagerNode;
            var outlineNode = dockManager.dockLeft(documentNode, outline, 0.15);
            var solutionNode = dockManager.dockFill(outlineNode, solution);
            var propertiesNode = dockManager.dockDown(outlineNode, properties, 0.6);
            var outputNode = dockManager.dockDown(documentNode, output, 0.2);
            var problemsNode = dockManager.dockRight(outputNode, problems, 0.40);
            var toolboxNode = dockManager.dockRight(documentNode, toolbox, 0.20);
            var editor1Node = dockManager.dockFill(documentNode, editor1);
            var editor2Node = dockManager.dockFill(documentNode, editor2);
            var infovisNode = dockManager.dockFill(documentNode, infovis);
            dockManager.floatDialog(nb, 100, 100);
        }
    }


    var setupDockUi = function() {

        $("#header-container").css("width", "100%");
        $("#menubar-container").css("width", "100%");
        $('#notebook_panel').appendTo($('body'));
        $('#ipython-main-app').remove();
        $('#site').attr('id', 'sited');
        $('div#sited').css('height', '100%');
        $('div#sited').css('width', '100%');
        $('div#sited').css('clear', 'both');
        $('#notebook_panel').css('overflow', 'auto');
        $('#notebook-container').css('width', '100%');
        $('#notebook-container').css('height', '100%');

        $('body').css('position', 'fixed');
        $('body').append('<div id="solution_window" data-panel-caption="Solution Explorer" data-panel-icon="fa fa-arrow-right" class="solution-window"> <ul> <li id="solution_window_1"> <a href="#">Test Project</a> <ul> <li id="phtml_2"><a href="#">Source File 1</a></li> <li id="phtml_3"><a href="#">Header File 1</a></li> </ul> </li> <li id="solution_window_2"> <a href="#">My Project 2</a> </li> </ul> </div>');

        $('body').append(' <div id="properties_window" data-panel-caption="Properties" class="properties-window"></div>');
        $('body').append('<div id="problems_window" data-panel-caption="Problems" class="problems-window"></div>');
        $('body').append('<div id="editor1_window" data-panel-caption="Notebook" class="editor1-window editor-host"></div>');
        $('body').append('<div id="editor2_window" data-panel-caption="Notebook2" class="editor2-window editor-host"></div>');
        $('body').append('<div id="infovis" data-panel-caption="Notebook3" class="editor2-window editor-host"></div>');
        $('body').append('<div id="output_window" data-panel-caption="Output" class="output-window editor-host"></div>');
        $('body').append('<div id="outline_window" data-panel-caption="Outline" class="outline-window"></div>');
        $('body').append('<div id="toolbox_window" data-panel-caption="Toolbox" class="toolbox-window"> <ul> <li id="toolbox_window_1"><a href="#">Tool 1</a></li> <li id="toolbox_window_2"><a href="#">Tool 2</a></li> </ul> </div>');
        //TODO: base/js/page.js
    //      Page.prototype._resize_site = function() {
    //          // Update the site's size.
    // -        $('div#site').height(window.innerHeight - $('#header').height());
    // +        //$('div#site').height(window.innerHeight - $('#header').height());
    // +        $('div#site').height('100%');

        //TODO: inject JS
        // <link rel="stylesheet" href="{{static_url("components/dockspawn/css/dock-manager.css") }}" type="text/css"/>
        // <link rel="stylesheet" href="{{static_url("components/dockspawn/css/demo.css") }}" type="text/css"/>

        // <script src="{{static_url("components/dockspawn/dockspawn.js") }}" type="text/javascript" charset="utf-8"></script>


    }

    // var load_css = function (name) {
    //     var link = document.createElement("link");
    //     link.type = "text/css";
    //     link.rel = "stylesheet";
    //     link.href = require.toUrl(name);
    //     console.log(link);
    //     document.getElementsByTagName("head")[0].appendChild(link);
    //   };

    // load_css('/nbextensions/testing/exercise/main.css');

    setupDockUi();
    createWindows();

});
