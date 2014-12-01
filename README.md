jquerySimpleCaptcha
===================

SimpleCaptcha allows you to drop in an easy-to-use and understand captcha implementation for helping to curb spambots on your system. The plug-in makes things very easy for you with a limited amount of setup required and standard xhtml and css classes in place to make changing the appearance super easy.

Features
--------

* __Simple to Use:__ This CAPTCHA implementation is easy to use by both the developer and the user!
* __User Experience Focused:__ Uses human-understandable images instead of hard to read text
* __Events:__ Events are triggered at various points so you can hook into the processing if you need to
* __Standard HTML and CSS:__ Standard-compliant xhtml with extensive classes used to allow for easy UI manipulation through CSS


The Setup
---------

There are three pieces to this plug-in: (1) the JavaScript file, (2) the PHP script, and (3) the images. Here are the steps you need to take to get things working:

* Upload the PHP script (src/simpleCaptcha.php) to your site (remember where, and what you named it!)
* Upload the JavaScript plugin file (src/jquery.simpleCaptcha.js) to your site and include it in your page (after you include the jQuery core)
* Make a folder on your server for the images to use in the captcha system (and optionally upload the sample images to that folder)
* Update the PHP script (src/simpleCaptcha.php) with your image filenames and the text the user should see for each
* (Optional) Upload (or copy) the CSS and "refresh" image to your server


Basic Usage
-----------

```html
<form ...>
  ...
  <div id="captcha"></div>
  ...
</form>

<script>
  $('#captcha').simpleCaptcha({
    // any options you want to set
  });
</script>
```

When your form is submitted, you just need to check one variable to see if the form was submitted by a human:

```php
<?php
// This is the PHP code you need to use on form submission to see if the user got the 
// captcha right. Note that this is for "POST" requests, and you may need to alter the 
// code to suit your needs.

if (isset($_SESSION['simpleCaptchaAnswer']) && $_POST['captchaSelection'] == $_SESSION['simpleCaptchaAnswer']) {
  // They're human! Continue processing the rest of the form
}
?>
```

__Note that the element you call `simpleCaptcha()` on should be in a `<form>`!__


Options
-------

* _allowRefresh_: Whether the user should see a UI element allowing them to refresh the captcha choices _(default: `true`)_
* _numImages_: How many images to show the user (providing there are at least that many defined in the script file) _(default: `5`)_
* _textClass_: Class to look for to place the text for the correct captcha image. _(default: `"captchaText"`)_
* _introText_: Text to place above captcha images (can contain html). __IMPORTANT__ You should probably include a tag with the textClass name on it, for example: `<span id='captchaText'></span>` _(default: `"<p>To make sure you are a human, we need you to click on the <span class='captchaText'></span>.</p>"`)_
* _refreshButton_: Html to use for the "refresh" button/content. Note that you can make this whatever you like, but it will be placed AFTER the "introText", and a click handler will be attached to initiate the refresh, so best to make it something "clickable". _(default: `"<input type='button' value='Refresh Options' />"`)_
* _refreshClass_: Class to use for the captcha refresh block (if there is one) _(default: `"refreshCaptcha"`)_
* _inputName_: Name to use for the captcha hidden input, this is what you will need to check on the receiving end of the form submission. _(default: `"captchaSelection"`)_
* _scriptPath_: Path to the script file to use for the initial AJAX call (can be a relative path to the current page). _(default: `"simpleCaptcha.php"`)_
* _introClass_: Class to use for the captcha introduction text container. _(default: `"captchaIntro"`)_
* _imageBoxClass_: Class to use for the captchas images container. _(default: `"captchaImages"`)_
* _imageClass_: Class to use for each captcha image. _(default: `"captchaImage"`)_


Events
------

* _init.simpleCaptcha_: The basic UI container, form element and event handlers have been added to the page. Note that at this point the captcha images, hashes, and answer text will NOT have been laoded, see the "dataload" and ready" events below. You should only ever receive ONE of these events per page load. _(Arguments: `captcha` (`SimpleCaptcha` object))_
* _dataload.simpleCaptcha_: The captcha images, hashes, and text have been loaded via the server script (although the UI may not yet be updated). _(Arguments: `returnData` (object))_
* _ready.simpleCaptcha_: The captcha images, hashes, and answer text have been loaded in the UI and everything is ready to go. Note that you may receive multiple of these if the user requests a "refresh", see below. _(Arguments: `captcha` (`SimpleCaptcha` object))_
* _select.simpleCaptcha_: The user has selected a captcha image (this is NOT when the form is submitted). Note that this is called EACH time, not just on the initial selection (in other words, they may change their selection). _(Arguments: `captcha` (`SimpleCaptcha` object), `hash` (string))_
* _refresh.simpleCaptcha_: The user has requested that the captcha images be reloaded. Note that you shoul also receive "dataload" and "ready" events after this. _(Arguments: `captcha` (`SimpleCaptcha` object))_
* _error.simpleCaptcha_: There is an error during any part of the process. _(Arguments: `errorMessage` (string))_


Event Example
-------------

```javascript
$('#captcha')
  .bind('select.simpleCaptcha', function(hashSelected) {
    // do something when the user selects a captcha image
  })
  .simpleCaptcha({});
```


How it Works
------------

_What Happens_
When you call $("#someDivInYourForm").simpleCaptcha({...}) the plug-in will make an XMLHttpRequest (AJAX call) to the PHP script which will then randomly select the number of images you specify (or a default) and from those, one to be the "correct" option. The script places a hash of the image text of the correct option (and some random characters) into the session and sends back the hashes - as well as the file locations - for all options. The hash is placed in the "alt" text of the image tag, and when a user clicks on an image, its hash is placed in the value of the hidden input.

_Telling humans from machines_
When a user submits the form that the simpleCaptcha UI is in, they will also submit the simpleCaptcha hidden form input, __you must check this input to see if they got the answer right__. All you do is compare their answer (a hash) against what is in the session variable. [Check the examples](http://jordankasper.com/jquery/captcha/examples) to see how to do this.

_Advanced Stuff_
There are other options and possibilities with this plug-in. For example, the PHP script also places a timestamp of when the captcha was generated into the session ("simpleCaptchaTimestamp"). This allows you to check - when the form is submitted - to see how long the "user" took.

There are also classes that you can specify to allow you to hook into the UI easier, events that are triggered when the captcha is loaded and when a selection is made, and of course the ability to tinker with the location of the script, or even rewrite the script in the language of your choice.

Known Issues
------------

* You can only have one simpleCaptcha instance per page (really its that you can only have one <em>active</em> captcha per session)
* Inaccessible to the visually impaired
* No keyboard controls
* Requires PHP and sessions (although other languages should be easy enough to port to, send them to me if you have one!)
