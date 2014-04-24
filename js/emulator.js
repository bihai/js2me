(function () {    
	var mapping = [];
	mapping[38] = -1;
	mapping[37] = -3;
	mapping[39] = -4;
	mapping[40] = -2;
	mapping[32] = -5;
	mapping[48] = 48;
	mapping[49] = 49;
	mapping[50] = 50;
	mapping[51] = 51;
	mapping[52] = 52;
	mapping[53] = 53;
	mapping[54] = 54;
	mapping[55] = 55;
	mapping[56] = 56;
	mapping[57] = 57;
	mapping[88] = -7;
	mapping[90] = -6;
	document.onkeydown = function (e) {
		//console.log(e.which);
		if (mapping[e.which]) {
			js2me.sendKeyPressEvent(mapping[e.which]);
		}
	};
	document.onkeyup = function (e) {
		if (mapping[e.which]) {
			js2me.sendKeyReleasedEvent(mapping[e.which]);
		}
	};
	window.onload = function () {
		document.getElementById('alert').style.display = 'none';
		document.getElementById('alert').addEventListener('click', function () {
			document.getElementById('alert').style.display = 'none';
		});
		var settingsDialog = document.getElementById('settings');
		var screenSizeSelector = document.querySelector('select.screen-size');
		var generateMethodsButton = document.querySelector('button.generate-methods');
		document.getElementById('settings-button').addEventListener('click', function () {
			settingsDialog.style.top = 0;
			var screenSize = loadConfig('width') + ',';
			screenSize += loadConfig('height') + ',';
			screenSize += loadConfig('fullHeight');
			var options = screenSizeSelector.options;
			for (var i = 0; i < options.length; i++) {
				if (options[i].value == screenSize) {
					screenSizeSelector.selectedIndex = i;
				}
			}
			generateMethodsButton.disabled = (js2me.manifest == null);
		});
		generateMethodsButton.addEventListener('click', function () {
			generateMethodsButton.innerHTML = 'Please wait...';
			generateMethodsButton.classList.add('disabled');
			setTimeout(function () {
				js2me.generateAllMethods(true);
				generateMethodsButton.innerHTML = 'Generate methods';
				generateMethodsButton.classList.remove('disabled');
			}, 1);
		});
		settings.querySelector('button.done').addEventListener('click', function () {
			var screenSize = screenSizeSelector.value.split(',');
			localStorage.setItem(js2me.storageName + 'width', screenSize[0]);
			localStorage.setItem(js2me.storageName + 'height', screenSize[1]);
			localStorage.setItem(js2me.storageName + 'fullHeight', screenSize[2]);
			settings.style.top = '100%';
		});
		window.addEventListener('keyup', function () {
			js2me.sendKeyReleasedEvent();
		});
		var buttonsMapping = {
			choice: -6,
			back: -7,
			num1: 49,
			num2: 50,
			num3: 51,
			num4: 52,
			num5: 53,
			num6: 54,
			num7: 55,
			num8: 56,
			num9: 57,
			num0: 48,
		};
		var keypad = document.getElementById('keypad');
		for (var i in buttonsMapping) {
			(function (key) {
				var button = keypad.querySelector('#' + i);
				button.addEventListener('touchstart', function() {
					js2me.sendKeyPressEvent(key);
				});
				button.addEventListener('touchend', function() {
					js2me.sendKeyReleasedEvent(key);
				});
			})(buttonsMapping[i]);
		}
		document.getElementById('top').style.display = 'none';
		document.querySelector('#show.topbutton').addEventListener('click', function () {
			document.getElementById('top').style.display = '';
		});
		document.querySelector('#hide.topbutton').addEventListener('click', function () {
			document.getElementById('top').style.display = 'none';
		});
		document.querySelector('#exit.topbutton').addEventListener('click', function () {
			location.reload();
		});
		var parts = location.search.substr(1).split('&');
		for (var i = 0; i < parts.length; i++) {
			var value = decodeURIComponent(parts[i].split('=')[1]);
			if (!isNaN(parseInt(value))) {
				value = parseInt(value);
			}
			js2me.config[parts[i].split('=')[0]] = value;
		}
		var buttons = document.getElementsByTagName('a');
		var selector = document.getElementById('file-selector');
		if (localStorage.getItem('height') == null) {
			localStorage.setItem('height', js2me.config.height)
		}
		if (localStorage.getItem('width') == null) {
			localStorage.setItem('width', js2me.config.width)
		}
		if (localStorage.getItem('fullHeight') == null) {
			localStorage.setItem('fullHeight', js2me.config.fullHeight)
		}
		function loadConfig(name) {
			return (js2me.config[name] = parseInt(localStorage.getItem(js2me.storageName + name)) ||
					parseInt(localStorage.getItem(name)));
		}
		selector.addEventListener('click', function () {
      // XXX kripken hardcode an xhr instead of MozActivity which only works on device (and even there, doesn't allow loading a binary file)

      console.log('load jar');
			var pick = {};
      /*new MozActivity({
				name: 'pick',
				data: {
				   //type: ['* / *']
				              }
			});*/

			pick.onsuccess = function () {
				js2me.loadJAR(this.result.blob, function () {
					document.getElementById('screen').innerHTML = '';
					loadConfig('width');
					loadConfig('height');
					loadConfig('fullHeight');
					js2me.launchMidlet(1);
				});
			};

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'jars/WhatsApp-S40-Messenger.jar', true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        var typedArray = new Uint8Array(xhr.response);
        alert('loadzey ' + typedArray.length);
        pick.result = {
          blob: new Blob([typedArray], {type: 'application/octet-binary'})
        };
        pick.onsuccess();
      };
      xhr.send();
		});
		if (js2me.config.src) {
			var request = new XMLHttpRequest;
			request.onreadystatechange = function() {
				if (request.readyState === 4){
					var blob;
					var builder = (window.BlobBuilder || window.WebKitBlobBuilder || null);
					if (builder) {
						builder = new builder();
						builder.append(request.response);
						blob = builder.getBlob();
					} else {
						blob = new Blob([request.response]);
					}
					js2me.loadJAR(blob, function () {
						document.getElementById('screen').innerHTML = '';
						loadConfig('width');
						loadConfig('height');
						loadConfig('fullHeight');
						js2me.launchMidlet(1);
					});
				}
			};
			request.open('GET', js2me.config.src);
			// blob didn't work in phantomjs
			request.responseType = 'arraybuffer';
			request.send();
		}
	};
	js2me.setFullscreen = function (enabled) {
		//TODO
		var screen = document.getElementById('screen');
	};
	js2me.showError = function (message) {
		document.getElementById('alert').style.display = '';
		document.querySelector('#alert .message').innerHTML = message;
	};
})();
