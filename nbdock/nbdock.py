from IPython.html.widgets import Box, register
from IPython.utils.traitlets import Unicode
from IPython.display import display, Javascript, HTML
from IPython.html.nbextensions import install_nbextension
import os

@register('IPython.Dock')
class Dock(Box):
    """Displays multiple widgets in a dock"""
    _view_name = Unicode('DockView', sync=True)
    description = Unicode(sync=True)


def get_static_path():
    return os.path.join(os.path.split(__file__)[0], 'static')

def nbdockmode():
    """ Setup the notebook to support docks """

    # Warning: Append to <head> or css/js are linked to the current cell
    #          and some not easy to understand bugs appear when the main notebook
    #          is temporary hidden to be docked
    display(Javascript('$("head").append(\'<link rel="stylesheet" href="/nbextensions/nbdock/static/dockspawn/css/dock-manager.css" type="text/css"/>\')'))
    display(Javascript('$("head").append(\'<link rel="stylesheet" href="/nbextensions/nbdock/static/dockspawn/css/demo.css" type="text/css"/>\')'))
    display(Javascript("$('head').append(\"<script> require(['/nbextensions/nbdock/static/dockui.js']) </script>\")"))


def install():
    install_nbextension(os.path.join(get_static_path(), 'dockui.js'))

def activate():
    IPython.load_extensions('gist');
