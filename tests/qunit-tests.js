


/*
module("Name Module");

test("Test Name", function(a) {
  a.strictEqual(v1, v2, "info msg");
  a.equal(v1, v2, "info msg");
  a.ok(v1, "info msg"):
  a.deepEqual(v1, v2, "info msg"):
});
*/

// Mock out ajax requests
$.mockjax({
  url: 'simpleCaptcha.php',
  type: 'post',
  status: 200,
  dataType: 'json',
  response: function(o) {
    console.debug('mockjax options: ', o);
    
    var r = { text: "answer", images: [] };
    for (var i=0; i<o.numImages; ++i) {
      r.images.push("randomhash"+i);
    }

    this.responseText = JSON.stringify(r);
  }
});


module("Initialize Tests");

test("Default Options Set", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost'});

 // allowRefresh: true,
 //    scriptPath: 'simpleCaptcha.php',
 //    numImages: 5,
 //    introText: "<p>To make sure you are a human, we need you to click on the <span class='captchaText'></span>.</p>",
 //    refreshButton: "<img src='refresh.png' class='refreshButton' alt='Refresh' title='Refresh captcha options' />",
 //    refreshClass: 'refreshCaptcha',
 //    inputName: 'captchaSelection',
 //    introClass: 'captchaIntro',
 //    textClass: 'captchaText',
 //    imageBoxClass: 'captchaImages',
 //    imageClass: 'captchaImage',
 //    node: null

  a.ok(sc.allowRefresh, "Refresh option is true");

});


module("Test class options");

test("Refresh Class Set", function(a) {
  var sc = new $.jk.SimpleCaptcha({node: '#simplePost', refreshClass: 'theRefreshArea'});
  var rn = sc.node.find('.theRefreshArea');
  a.equal(rn.length, 1, "Refresh class set correctly");
  a.equal(rn.find('img.refreshButton').length, 1, "Refresh content is correct with custom class");
});
