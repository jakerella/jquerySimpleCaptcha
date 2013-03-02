<?php

session_start();

?><!doctype html>
<html>
  <head>
    <meta charset='UTF-8' />
    <meta http-equiv='content-type' content='text/html; charset=utf-8' />
    
    <title>jQuery.simpleCaptcha Tests</title>

    <meta name='description' content='Tests for jquery.simpleCaptcha plugin' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    
    <link rel='stylesheet' href='../src/jquery.simpleCaptcha.css'></script>

    <script src='lib/jquery-1.7.2.min.js'></script>
    <script src='../src/jquery.simpleCaptcha.js'></script>
  </head>
  <body>
    <div id='wrapper'>
      
      <h1>jQuery.simpleCaptcha Functional Tests - PHP</h1>

      <p>
        TODO: Description...
      </p>

      <?php
      if (isset($_POST['captchaSelection'])) {
        if (isset($_SESSION['simpleCaptchaAnswer']) && $_POST['captchaSelection'] == $_SESSION['simpleCaptchaAnswer']) {
          echo "<p><strong>Correct captcha selection match</strong></p>";
        } else {
          echo "<p><strong>captcha selection does not match expected answer: (selction) ".$_POST['captchaSelection']." != ".$_SESSION['simpleCaptchaAnswer']." (answer).</strong></p>";
        }
      }
      ?>

      <form action='' method='POST'>
        <h3>POST form</h3>
        
        <div class='group'>
          <label for='f1_text'>Text</label>
          <input type='text' id='f1_text' name='text' />
        </div>

        <div id='captcha'></div>

        <div class='group'>
          <input type='submit' id='f1_submit' name='submit' value='Submit' />
        </div>
      </form>

      <script>
        $('#captcha').simpleCaptcha({
          scriptPath: '../src/simpleCaptcha.php'
        });
      </script>

      <h2>$_REQUEST object for debugging:</h2>
      <pre><?=var_dump($_REQUEST)?></pre>

    </body>
</html>