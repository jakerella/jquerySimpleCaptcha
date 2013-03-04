/* Copyright (c) 2009 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * 
 * Requires: jQuery 1.7+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more usage documentation and examples, visit:
 *  https://github.com/jakerella/jquerySimpleCaptcha
 * 
 */
;(function($) {

  // PRIVATE VARS & METHODS
  var ns = 'simpleCaptcha';


  /**
   * This method will add a captcha to the selected element which includes making an 
   * ajax request for the images & hashes and displaying the information
   * 
   *  Typical usage:
   *   $('#divInForm').simpleCaptcha({
   *     // options
   *   });
   * 
   * Optionally, if a captcha is already on this node you can call the method again with:
   *  - the name of an option to retrieve that option's value (i.e. var num = $('#divInForm').simpleCaptcha('numImages'); )
   *  - "refresh" to reset the images and hashes from a new AJAX call to the PHP script (i.e. $('#divInForm').prefillForm('refresh'); )
   * 
   * @param  {object|string} o If an OBJECT, creates a new simpleCaptcha in the selected element and uses the object as options
   * @return {jQuery} The jQuery object for chain calling (NOTE: If an option was requested then this method returns that option value, not the jQuery chain)
   */
  $.fn.simpleCaptcha = function(o) {
    var n = $(this);
    (o)?o:{};
    var c;

    if (n.length === 1 && n.hasClass(ns) && n.data(ns) && o && o.length) {
      // Get simpleCaptcha option value
      c = n.data(ns);
      if (c && o === 'refresh') {
        c.refresh();
      } else if (c) {
        return c[o];
      }

    } else if (n.length === 1 && !o.node) {
      o.node = n;
      c = new $.jk.SimpleCaptcha(o);
    } else if (o.node) {
      c = new $.jk.SimpleCaptcha(o);
    }

    if (!c) { n.trigger('error.'+ns, ['No node provided for the simpleCaptcha UI']); }

    return n;
  };


  // CONSTRUCTOR
  if (!$.jk) { $.jk = {}; }
  $.jk.SimpleCaptcha = function(o) {
    var t = this;
    t.data = {};

    // Audit options and merge with object
    if (o.numImages && (!Number(o.numImages) || o.numImages < 1)) { o.numImages = t.numImages; }
    $.extend(t, ((o)?o:{}));
    t.allowRefresh = !!t.allowRefresh; // force boolean value

    var n;
    t.node = $( ((o.node)?o.node:null) );
    if (t.node.length){
      n = t.node;
    } else {
      return null;
    }

    n.addClass(ns)
      .html('')  // clear out the container
      .append(
        "<p class='"+t.introClass+"'>"+t.introText+"</p>"+
        "<div class='"+t.imageBoxClass+"'></div>"+
        "<input class='"+ns+"Input' name='"+t.inputName+"' type='hidden' value='' />"
      )
      // set the class as node data
      .data(ns, t)
    
      // handler for selecting images
      .find('.'+t.imageBoxClass)
        .on('click', 'img.'+t.imageClass, function(e) {
          e.preventDefault();
          n.find('img.'+t.imageClass).removeClass(ns+'Selected');
          var hash = $(this).addClass(ns+'Selected').attr('data-hash');
          n.find('.'+ns+"Input").val(hash);

          n.trigger('select.'+ns, [t, hash]);
          return false;
        })
        // handle an "enter" & "space" while an image has focus, emulating a click
        .on('keyup', 'img.'+t.imageClass, function(e) {
          if (e.which == 13 || e.which == 32) {
            $(this).click();
          }
        });

    if (t.allowRefresh) {
      var b = $(t.refreshButton);
      n.find('.'+t.introClass)
        .after("<div class='"+t.refreshClass+"' />")
        .siblings('.'+t.refreshClass)
          .append(b);
      b.on('click', function(e) {
        e.preventDefault();
        t.refresh();
        return false;
      });
    }

    // start it up
    t.loadImageData(function(d) {
      t.addImagesToUI(d);
    });

    n.trigger('init.'+ns, [t]);
  };


  // PUBLIC PROPERTIES (Default options)
  // Assign default options to the class prototype
  $.extend($.jk.SimpleCaptcha.prototype, {
    allowRefresh: true,               // Boolean Whether the user should see a UI element allowing them to refresh the captcha choices
    scriptPath: 'simpleCaptcha.php',  // String Relative path to the script file to use (usually simpleCaptcha.php).
    numImages: 5,                     // Number How many images to show the user (providing there are at least that many defined in the script file).
    introText: "<p>To make sure you are a human, we need you to click on the <span class='captchaText'></span>.</p>",
                                      // String Text to place above captcha images (can contain html). IMPORTANT: You should probably include a tag with the textClass name on it, for example: <span class='captchaText'></span>
    refreshButton: "<input type='button' value='Refresh Options' />",
                                      // String Html to use for the "refresh" button/content. Note that you can make this whatever you like, but it will be placed AFTER the "introText", and a click handler will be attached to initiate the refresh, so best to make it something "clickable".
    refreshClass: 'refreshCaptcha',   // String Class to use for the captcha refresh block (if there is one)
    inputName: 'captchaSelection',    // String Name to use for the captcha hidden input, this is what you will need to check on the receiving end of the form submission.
    introClass: 'captchaIntro',       // String Class to use for the captcha introduction text container.
    textClass: 'captchaText',         // String Class to look for to place the text for the correct captcha image.
    imageBoxClass: 'captchaImages',   // String Class to use for the captchas images container.
    imageClass: 'captchaImage',       // String Class to use for each captcha image.
    node: null                        // Node | String The node (or selector) to use for the captcha UI. If not set, the current node selected bu $(...).simpleCaptcha(); will be used
  });

  
  // PUBLIC METHODS
  $.extend($.jk.SimpleCaptcha.prototype, {
    
    loadImageData: function(cb) {
      var t = this;
      cb = ($.isFunction(cb))?cb:(function(){});

      $.ajax({
        url: t.scriptPath,
        data: { numImages: t.numImages },
        method: 'post',
        dataType: 'json',
        success: function(d, s) {
          if (d && d.images && d.text) {
            t.data = d;
            t.node.trigger('dataload.'+ns, [d]);
            cb(d);
          } else {
            t.node.trigger('error.'+ns, ['Invalid data was returned from the server.']);
          }
        },
        error: function(xhr, s) {
          t.node.trigger('error.'+ns, ['There was a serious problem: '+xhr.status]);
        }
      });
    },

    addImagesToUI: function() {
      var t = this;
      // Add image text to correct place
      t.node.find('.'+t.textClass).text(t.data.text);
      
      var b = t.node.find('.'+t.imageBoxClass).html('');
      // Add images to container
      for (var i=0; i<t.data.images.length; ++i) {
        b.append("<img class='"+t.imageClass+"' src='"+t.scriptPath+'?hash='+t.data.images[i]+"' alt='' data-hash='"+t.data.images[i]+"' />");
      }
      t.node.trigger('ready.'+ns, [t]);
    },

    refresh: function() {
      var t = this;
      t.node.trigger('refresh.'+ns, [t]);
      t.loadImageData(function(d) {
        t.addImagesToUI(d);
      });
    }

  });

  
})(jQuery);