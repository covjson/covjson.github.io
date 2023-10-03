// adapted from http://stackoverflow.com/a/13067009
(function(document, history, location) {
  var HISTORY_SUPPORT = !!(history && history.pushState);

  var anchorScrolls = {
    ANCHOR_REGEX: /^#[^ ]+$/,
    OFFSET_HEIGHT_PX: 70,

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function() {
      this.scrollIfAnchor(location.hash);
      document.body.addEventListener('click', this.delegateAnchors.bind(this));
      window.addEventListener('hashchange', this.scrollOnHashChange.bind(this));
    },

    /**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
    getFixedOffset: function() {
      return this.OFFSET_HEIGHT_PX;
    },
    
    /**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
    scrollIfAnchor: function(href, pushToHistory) {
      var match, rect, anchorOffset;

      if(!this.ANCHOR_REGEX.test(href)) {
        return false;
      }

      match = document.getElementById(href.slice(1));

      if(match) {
        rect = match.getBoundingClientRect();
        anchorOffset = window.pageYOffset + rect.top - this.getFixedOffset();
        window.scrollTo(window.pageXOffset, anchorOffset);

        // Add the state to history as-per normal anchor links
        if(HISTORY_SUPPORT && pushToHistory) {
          history.pushState({}, document.title, location.pathname + href);
        }
      }

      return !!match;
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     */
    delegateAnchors: function(e) {
      var elem = e.target;

      if(
        elem.nodeName === 'A' &&
        this.scrollIfAnchor(elem.getAttribute('href'), true)
      ) {
        e.preventDefault();
      }
    },
    
    /**
     * Listen to any hash changes and fix the scroll position.
     * Hash changes may happen when traversing through history.
     * 
     * In the event of a click then this function is also unnecessarily invoked, but it doesn't hurt
     * and there's no easy way to know that the original trigger was a click.
     */
    scrollOnHashChange: function(e) {
      this.scrollIfAnchor(location.hash)
    }
  };

  window.addEventListener(
    "DOMContentLoaded", anchorScrolls.init.bind(anchorScrolls)
  );
})(window.document, window.history, window.location);
