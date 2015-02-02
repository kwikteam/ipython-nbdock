# -*- coding: utf-8 -*-

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(
    name='nbdock',
    version='0.1',
    description='',
    author='Cedric GESTES',
    author_email='cedric.gestes@gmail.com',
    license='BSD License',
    url='https://github.com/kwikteam/ipython-nbdock',
    keywords='interactive interaction python ipython widgets widget dock dockable float floating window ide',
    classifiers=['Development Status :: 4 - Beta',
                 'Programming Language :: Python :: 2.7',
                 'License :: OSI Approved :: BSD License'],
    packages=['nbdock'],
    package_data={'': ['static/*.js',
                       'static/dockspawn/*.js',
                       'static/dockspawn/css/*.css',
                       'static/dockspawn/css/*.png']}
)
