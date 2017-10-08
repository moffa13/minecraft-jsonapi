/**
 * Created by macdja38 on 2017-02-28.
 */
"use strict";
const Docma = require('docma');

let config = {
  app: {
    title: 'minecraft-jsonapi',
    base: '/minecraft-jsonapi/',
    server: Docma.ServerType.GITHUB,
  },
  src: [
    'functionalIndex.js',
    './README.md',
  ],
  dest: './docs',
  jsdoc: {
    plugins: []
  },
  template: {
    // Template-specific options
    options: {
      title: 'Minecraft-JSONapi',
      sidebar: true,
      collapsed: false,
      badges: true,
      search: true,
      navbar: true,
      navItems: [
        {
          label: 'Documentation',
          href: '#',
          iconClass: 'ico-book'
        },
        {
          label: 'Demos',
          href: 'https://github.com/macdja38/pvpcraft/blob/master/modules/minecraft.js',
          iconClass: 'ico-mouse-pointer'
        },
        {
          label: 'GitHub',
          href: 'https://github.com/macdja38/minecraft-jsonapi',
          target: '_blank',
          iconClass: 'ico-md ico-github'
        }
      ]
    }
  },
};

Docma.create()
  .build(config)
  .then(function () {
    console.log('Documentation built successfully.');
  })
  .catch(function (error) {
    console.log(error);
  });