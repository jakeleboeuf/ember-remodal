/* jshint node: true */
'use strict';
var path = require('path');
var resolve = require('resolve');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-remodal',

  treeForVendor(defaultTree) {
    var remodalPath = path.dirname(resolve.sync('remodal'));
    var remodalTree = new Funnel(remodalPath, {
      files: ['remodal.min.js'],
      destDir: '/remodal/dist'
    });

    remodalTree = map(
      remodalTree,
      content => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    return defaultTree
      ? new MergeTrees([defaultTree, remodalTree])
      : remodalTree;
  },

  treeForStyles: function(defaultTree) {
    var remodalPath = path.dirname(resolve.sync('remodal'));
    var remodalTree = new Funnel(remodalPath, {
      files: ['remodal.css', 'remodal-default-theme.css'],
      destDir: '/remodal/dist'
    });

    remodalTree = map(
      remodalTree,
      content => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    return defaultTree
      ? new MergeTrees([defaultTree, remodalTree])
      : remodalTree;
  },

  included: function(app) {
    this._super.included(app);

    // In ember-cli < 2.7, this.import is not available, so fall back to use app.import
    var importShim = typeof this.import !== 'undefined' ? this : app;

    importShim.import('vendor/remodal/dist/remodal.min.js');
    importShim.import('vendor/remodal/dist/remodal.css');
    importShim.import('vendor/remodal/dist/remodal-default-theme.css');
    importShim.import('vendor/style.css');
  }
};
