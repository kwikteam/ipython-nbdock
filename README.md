ipython-nbdock
==============

Add support for dockable windows in the notebook.

This extension is experimental and should not be used as is.

Installation
------------
To install it use:

```sh
# creates a symlink in .ipython/nbextensions
$ cd ipython-nbdock
$ ipython install-nbextension --symlink . --user
```

Then you need to have ipython-nbdock in PYTHONPATH when launching ipython.


nbdock activation in a notebook
-------------------------------
In a notebook add the following code:
```python
import nbdock
nbdock.nbdockmode()
```
