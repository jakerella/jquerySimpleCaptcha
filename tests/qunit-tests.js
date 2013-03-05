
// ---------------- Global Settings --------------- //

// trap our namespaced errors and let the individual tests handle it
window.onerror = function ( error, filePath, linerNr ) {
  if (error.namespace == 'simpleCaptcha') {
    console.log('trapped window error on namespace', error);
    return false;
  }
};

// Mockjax settings for image hash requests

var reqHashesGood = {
  url: 'simpleCaptcha.php',
  type: 'post',
  status: 200,
  dataType: 'json',
  response: function(req) {
    console.log('Mockjax request: ', req);
    var resp = { text: "answer", images: [] };
    for (var i=0; i<req.data.numImages; ++i) {
      resp.images.push("randomhash"+i);
    }
    this.responseText = JSON.stringify(resp);
  }
};
var reqHashesGoodDiff = {
  url: 'simpleCaptchaDifferent.php',
  type: 'post',
  status: 200,
  dataType: 'json',
  response: function(req) {
    console.log('Mockjax request: ', req);
    var resp = { text: "diff-answer", images: [] };
    for (var i=0; i<req.data.numImages; ++i) {
      resp.images.push("randomdiffhash"+i);
    }
    this.responseText = JSON.stringify(resp);
  }
};
var reqHashesBad = {
  url: 'simpleCaptcha.php',
  type: 'post',
  status: 400,
  dataType: 'json',
  response: function(req) {
    console.log('Mockjax request: ', req);
    this.responseText = "400 Bad request dude";
  }
};


// ---------------- Test Modules --------------- //

module("Initialize & Option Tests");

test("Default Options Set", function(a) {
  var sc = new $.jk.SimpleCaptcha();

  a.ok(sc.allowRefresh, "allowRefresh option is set correctly");
  a.equal(sc.numImages, 5, "numImages is set correctly");
  a.equal(sc.introText, "<p>To make sure you are a human, we need you to click on the <span class='captchaText'></span>.</p>", "introText is set correctly");
  a.equal(sc.refreshButton, "<img src='refresh.png' class='refreshButton' alt='Refresh' title='Refresh captcha options' />", "refreshButton is set correctly");
  a.equal(sc.refreshClass, 'refreshCaptcha', "refreshClass is set correctly");
  a.equal(sc.inputName, 'captchaSelection', "inputName is set correctly");
  a.equal(sc.introClass, 'captchaIntro', "introClass is set correctly");
  a.equal(sc.textClass, 'captchaText', "textClass is set correctly");
  a.equal(sc.imageBoxClass, 'captchaImages', "imageBoxClass is set correctly");
  a.equal(sc.imageClass, 'captchaImage', "imageClass is set correctly");
  a.equal(sc.node.length, 0, "node is set correctly");
});

test("Default DOM present", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

  var iNode = sc.node.find('.'+sc.introClass);
  var rNode = sc.node.find('.'+sc.refreshClass);

  a.equal(iNode.length, 1, "Intro text container present");
  a.equal(iNode.html(), $(sc.introText).get(0).outerHTML, "Intro content is correct");
  a.equal(rNode.length, 1, "Refresh container present");
  a.equal(rNode.html(), $(sc.refreshButton).get(0).outerHTML, "Refresh content is correct");
  a.equal(sc.node.find('.'+sc.imageBoxClass).length, 1, "Image box present");
  a.equal(sc.node.find('input[name='+sc.inputName+']').length, 1, "Form input present");
});

test("allowRefresh option - true", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    allowRefresh: true
  });

  var rn = sc.node.find('.refreshCaptcha');
  a.equal(rn.length, 1, "Refresh container present");
  a.equal(rn.html(), $(sc.refreshButton).get(0).outerHTML, "Refresh content is correct");
});

test("allowRefresh option - false", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    allowRefresh: false
  });

  var rn = sc.node.find('.refreshCaptcha');
  a.equal(rn.length, 0, "Refresh container not present (which is correct)");
});

test("introClass option - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    introClass: 'theIntroArea',
    allowRefresh: true
  });

  var iNode = sc.node.find('.theIntroArea');
  a.equal(iNode.length, 1, "Intro container present");
  a.equal(iNode.html(), $(sc.introText).get(0).outerHTML, "Intro content is correct");
});

test("introText option - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    introText: "<p>Are you a robot? Then don't pick the <span class='captchaText'></span>.</p>"
  });

  var iNode = sc.node.find('.'+sc.introClass);
  a.equal(iNode.length, 1, "Intro container present");
  a.equal(iNode.html(), $(sc.introText).get(0).outerHTML, "Intro content is correct");
});

test("refreshClass option - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    refreshClass: 'theRefreshArea',
    allowRefresh: true
  });

  var rNode = sc.node.find('.theRefreshArea');
  a.equal(rNode.length, 1, "Refresh container present");
  a.equal(rNode.html(), $(sc.refreshButton).get(0).outerHTML, "Refresh content is correct");
});

test("refreshButton option - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    refreshButton: "<input type='button' value='Refresh' />",
    allowRefresh: true
  });

  var rNode = sc.node.find('.'+sc.refreshClass);
  a.equal(rNode.length, 1, "Refresh container present");
  a.equal(rNode.html(), $(sc.refreshButton).get(0).outerHTML, "Refresh content is correct");
});

test("imageBoxClass option - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    imageBoxClass: 'theImageArea'
  });

  var ibNode = sc.node.find('.theImageArea');
  a.equal(ibNode.length, 1, "Image Box container present");
  a.equal(ibNode.html(), "", "Image Box content is correct (empty)");
});

test("Form input name - custom", function(a) {
  var sc = new $.jk.SimpleCaptcha({
    node: '#simplePost',
    inputName: "myAnswer"
  });

  a.equal(sc.node.find('input[name=myAnswer]').length, 1, "Custom form input present");
});


// ------------------------------- //

module("Captcha Image UI Tests");

test("Captcha image UI build correctly", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

  sc.data = { "images": [], "text": "answer" };
  for (var i=0; i<sc.numImages; ++i) {
    sc.data.images.push("randomhash"+i);
  }

  sc.addImagesToUI();

  a.equal(sc.node.find('.'+sc.textClass).text(), sc.data.text, "Answer text is correct");
  a.equal(sc.node.find('.'+sc.imageBoxClass+' img').length, sc.numImages, "Image box has correct number of images");
  a.ok(sc.node.find('.'+sc.imageBoxClass+' img:first').hasClass(sc.imageClass), "Captcha image has correct class");
});

test("Captcha selection fills input", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

  sc.data = { "images": [], "text": "answer" };
  for (var i=0; i<sc.numImages; ++i) {
    sc.data.images.push("randomhash"+i);
  }

  sc.addImagesToUI();
  sc.node.find('.'+sc.imageBoxClass+' img:first').click();
  a.equal(sc.node.find('input[name='+sc.inputName+']').val(), "randomhash0", "Selected hash is in input value");
  sc.node.find('.'+sc.imageBoxClass+' img:last').click();
  a.equal(sc.node.find('input[name='+sc.inputName+']').val(), "randomhash"+(sc.numImages-1), "Selecting new image changes hash in input value");
});


// ------------------------------- //

module("Image Hash Data Loading Tests");

asyncTest("Null return with bad ajax call", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

  $.mockjaxClear();
  $.mockjax(reqHashesBad);

  sc.loadImageData(function(d) {
    a.equal(d, null, "Object data is correct in callback (null)");
    start();
  });
});

asyncTest("Good data with default ajax call", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

  $.mockjaxClear();
  $.mockjax(reqHashesGood);
  var exp = { "images": [], "text": "answer" };
  for (var i=0; i<sc.numImages; ++i) {
    exp.images.push("randomhash"+i);
  }

  sc.loadImageData(function(d) {
    a.deepEqual(d, exp, "Object data is correct in callback");
    start();
  });
});

asyncTest("Good data with custom numImages", function(a) {
  var sc = new $.jk.SimpleCaptcha({ node: '#simplePost', numImages: 7 });

  $.mockjaxClear();
  $.mockjax(reqHashesGood);
  var exp = { "images": [], "text": "answer" };
  for (var i=0; i<sc.numImages; ++i) {
    exp.images.push("randomhash"+i);
  }

  sc.loadImageData(function(d) {
    a.deepEqual(d, exp, "Object data is correct in callback");
    start();
  });
});

asyncTest("Good data with custom scriptPath", function(a) {
  var sc = new $.jk.SimpleCaptcha({ node: '#simplePost', scriptPath: 'simpleCaptchaDifferent.php' });

  $.mockjaxClear();
  $.mockjax(reqHashesGoodDiff);
  var exp = { "images": [], "text": "diff-answer" };
  for (var i=0; i<sc.numImages; ++i) {
    exp.images.push("randomdiffhash"+i);
  }

  sc.loadImageData(function(d) {
    a.deepEqual(d, exp, "Object data is correct in callback");
    start();
  });
});


