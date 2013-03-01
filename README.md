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

* Upload the PHP script to your site (remember where!)
* Upload the JavaScript plugin file to your site and include it in your page
* Make a folder on your server for the images to use in the captcha system
* Update the PHP script with your images and the text the user should see for each


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

* _numImages_: How many images to show the user (providing there are at least that many defined in the script file) _(default: `5`)_
* _textClass_: Class to look for to place the text for the correct captcha image. _(default: `"captchaText"`)_
* _introText_: Text to place above captcha images (can contain html). __IMPORTANT__ You should probably include a tag with the textClass name on it, for example: `<span id='captchaText'></span>` _(default: `"<p>To make sure you are a human, we need you to click on the <span class='captchaText'></span>.</p>"`)_
* _inputName_: Name to use for the captcha hidden input, this is what you will need to check on the receiving end of the form submission. _(default: `"captchaSelection"`)_
* _scriptPath_: Path to the script file to use for the initial AJAX call (can be a relative path to the current page). _(default: `"simpleCaptcha.php"`)_
* _introClass_: Class to use for the captcha introduction text container. _(default: `"captchaIntro"`)_
* _imageBoxClass_: Class to use for the captchas images container. _(default: `"captchaImages"`)_
* _imageClass_: Class to use for each captcha image. _(default: `"captchaImage"`)_

Events
------

* _loaded.simpleCaptcha_: Called when the captcha has been loaded in the page
* _error.simpleCaptcha_: Called when there is an error loading the captcha
* _select.simpleCaptcha_: Called when the user selects a captcha image (this is NOT when the form is submitted)

Event Example
-------------

```javascript
$('#captcha')
  .bind('select.simpleCaptcha', function() {
    // do something when the user selects a captcha image
  })
  .simpleCaptcha({});
```


How it Works
------------

_What Happens_
When you call $("#someDivInYourForm").simpleCaptcha({...}) the plug-in will make an XMLHttpRequest (AJAX call) to the PHP script which will then randomly select the number of images you specify (or a default) and from those, one to be the "correct" option. The script places a hash of the image text of the correct option (and some random characters) into the session and sends back the hashes - as well as the file locations - for all options. The hash is placed in the "alt" text of the image tag, and when a user clicks on an image, its hash is placed in the value of the hidden input.

_Telling humans from machines_
When a user submits the form that the simpleCaptcha UI is in, they will also submit the simpleCaptcha hidden form input, __you must check this input to see if they got the answer right__. All you do is compare their answer (a hash) against what is in the session variable. [Check the examples](http://jordankasper.com/jquery/captcha/examples.php) to see how to do this.

_Advanced Stuff_
There are other options and possibilities with this plug-in. For example, the PHP script also places a timestamp of when the captcha was generated into the session ("simpleCaptchaTimestamp"). This allows you to check - when the form is submitted - to see how long the "user" took.

There are also classes that you can specify to allow you to hook into the UI easier, events that are triggered when the captcha is loaded and when a selection is made, and of course the ability to tinker with the location of the script, or even rewrite the script in the language of your choice.
