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
      files: ['remodal.min.js']
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
      files: ['remodal.css', 'remodal-default-theme.css']
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
    this.import('vendor/remodal.min.js');
    this.import('vendor/remodal.css');
    this.import('vendor/remodal-default-theme.css');
    this.import('vendor/style.css');
  }
};
