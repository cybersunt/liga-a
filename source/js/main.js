'use strict';

new SimpleBar(document.getElementById('demo'), {
    autoHide: true,
    classNames: {
      content: 'simplebar-content',
      scrollContent: 'simplebar-scroll-content',
      scrollbar: 'simplebar-scrollbar',
      track: 'simplebar-track'
    },
    scrollbarMinSize: 25
})
