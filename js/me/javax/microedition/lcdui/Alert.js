js2me.createClass({
	/*
	 * public Alert(String title)
	 */
	_init$Ljava_lang_String_$V: function (str) {
		this.$setTitle$Ljava_lang_String_$V(str);
		this.init();
	},
	/*
	 * public Alert(String title)
	 */
	_init$Ljava_lang_String_Ljava_lang_String_Ljavax_microedition_lcdui_Image_Ljavax_microedition_lcdui_AlertType_$V: function (title, text, image, type) {
		this.$setTitle$Ljava_lang_String_$V(title);
		this.text = text;
		this.image = image;
		this.type = type;
		this.element = document.createElement('div');
		this.element.innerHTML = text.text;
		this.init();
	},
	/*
	 * public void setTimeout(int time)
	 */
	$setTimeout$I$V: function (time) {
		setTimeout(function () {
			console.log('show?');
		}, time);
	},
	superClass: 'javaRoot.$javax.$microedition.$lcdui.$Screen'
});
	

