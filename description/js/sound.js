/////////////////////////////////////////////////////////////////////////
// for sound
/////////////////////////////////////////////////////////////////////////
var VwBrowserCheck;

function VwCheckBrowser(){
   var VwOP = (window.navigator.userAgent.toLowerCase().indexOf("opera") > -1)?1:0; //OP
   var VwN6 = (window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1)?1:0; // Firefox
   var VwIE = (window.navigator.userAgent.toLowerCase().indexOf("msie") > -1)?1:0; // IE
   var VwSF = (window.navigator.userAgent.toLowerCase().indexOf("safari") > -1)?1:0; // Safari
   var VwCRM = (window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1)?1:0; // Chrome

   if ( VwOP || VwN6 ){
		VwBrowserCheck = 1;
   } else if ( VwIE ){
		VwBrowserCheck = 2;
   } else if ( VwSF ){
		VwBrowserCheck = 3;
   } else if ( VwCRM ){
		VwBrowserCheck = 4;
   } else {
		VwBrowserCheck = 0;
   }
}

function soundPlay(c)
{
	var qsParm = new Array();
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	for (var i=0; i < parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0) {
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			qsParm[key] = val;
		}
	}
	
	var lang = qsParm['lang'];
	
	var sound_directory = "../audio/sinario/";
	//var sound_filetype = ".mp3";
	
	var sfile = sound_directory + c;// + sound_filetype;
	if ( VwBrowserCheck == 1 ){
		myPLUGIN.src = sfile;
        myPLUGIN.play();
	}
	if ( VwBrowserCheck == 2 ){
		mySND.src = sfile;
	}
	if ( VwBrowserCheck == 3 ){
		myAUDIO.src = sfile;
		myAUDIO.play();
	}
	if ( VwBrowserCheck == 4 ){
		myAUDIO.src = sfile;
		myAUDIO.play();
	}
}