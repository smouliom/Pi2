//webankValidator.js 1.0.0
if (typeof jQuery === 'undefined') { throw new Error('Webank\'s JavaScript requires jQuery'); }

(function() {
	var webankValidator = function(obj) {
		if (obj instanceof webankValidator) return obj;
		if (!(this instanceof webankValidator)) return new webankValidator(obj);
	};
	window.webankValidator = webankValidator;
	// Current version.
	webankValidator.VERSION = '1.0.0';
	console = window.console || {log: function() {}};
	/*
	 * @Desc checkDateFormat
	 * @param inDATE the date
	 * @param inFMT the format to check
	 * @param delimiter the date delimiter
	 */
	+function(webankValidator) {
		'use strict';
		function checkDate(inDATE,inFMT,delimiter) {
			var aD, dD, dM, dY, s, dYDigit;
			
			s = inDATE;
			aD = s.split(delimiter);
			
			if (aD[0].length != 2) 
				return false;
			if (aD[1] == undefined)
				return false;
			if (aD[1].length != 2) 
				return false;
			
			if(isNaN(aD[0]))
				 return false;
			
			if(isNaN(aD[1]))
				 return false;
			
			if(isNaN(aD[2]))
				 return false;
				 
			dD = Math.round(parseFloat(aD[0]));
			dM = Math.round(parseFloat(aD[1])) - 1;
			dY = Math.round(parseFloat(aD[2]));
			s = dY + "";
			dYDigit = s.length;
			if (isNaN(dD)) return false;
			else if (isNaN(dM)) return false;
			else if (isNaN(dY)) return false;
			else if (dY < 1) return false;
			else if (dD < 1) return false;
			else if (dM < 0) return false;
			else if (dM > 11) return false;
			else if (dYDigit != 4) return false;
			else if (dD > webankValidator.daysIn(dM, dY)) return false;
			else {
				if (dM == 1) {
					if (! webankValidator.isLeap(dY) && dD == 29) return false;
					else return true;
				} else {
					return true;
				}
			}
		}
		webankValidator.checkDate= checkDate;
	}(webankValidator);
	
	/**
	 * Methode pour vérifier qu'une date est supérieur à un minima
	 */
	+function(webankValidator) {
		'use strict';
		function isDateBefore(date, minimal) {
			if(webankValidator.checkDate(date,"dd/mm/yyyy", "/")) {
				var dateParse = new Date(parseInt(date.substring(6), 10),
						parseInt(date.substring(3, 5), 10) - 1,
						parseInt(date.substring(0, 2), 10));
				if(dateParse.getTime() < new Date().getTime() - 1000*60*60*24*minimal) {
					return false;
				}
				return true;
			}
		}
		webankValidator.isDateBefore= isDateBefore;
	}(webankValidator);
	
	// Methode pour connaitre le nombre de jours dans un mois
	+function(webankValidator) {
		'use strict';
		function daysIn(inMONTH,inYEAR) {
			var m = 0;
			if (("?0??2??4??6??7??9??11?").indexOf("?" + inMONTH + "?") >= 0) {
				m = 31;
			} else if (("?3??5??8??10?").indexOf("?" + inMONTH + "?") >= 0) {
				m = 30;
			} else {
				if (webankValidator.isLeap(inYEAR)) m = 29;
				else m = 28;
			}
			return m;
		};
		webankValidator.daysIn= daysIn;
	}(webankValidator);

	
	
		// Methode de verification annee bissextile
	+function(webankValidator) {
		'use strict';
		function isLeap(inYEAR) {
			if (inYEAR % 400 == 0) return true;
			else {
				if ((inYEAR % 4 == 0) && (inYEAR % 100 != 0)) return true;
				else return false;
			}
		};
		webankValidator.isLeap = isLeap;
	}(webankValidator);
	
	
	/**
	 * @desc permet de faire la validation des numéro de chèque
	 * @param strString le numéro de cheque
	 * @param bCharPermit boolean pour autoriser les caracteres dans les numéro de cheque 
	 */
	+function(webankValidator) {
		'use strict';
		function isCheqNumber(strString,bCharPermit) {
			var strChar;
			var strVChars;
			if(bCharPermit) {
				strVChars = "0123456789";
			} else {
				strVChars = "0123456789azertyuiopqsdfghjklmwxcvbn";
			}
			
			for (var i = 0; i < strString.length; i++) {
				strChar = strString.charAt(i);
				if (strVChars.indexOf(strChar) == -1) return false;
			}
		}
		webankValidator.isCheqNumber = isCheqNumber;
	}(webankValidator);
	
	// Permet de verifier que le parametre passe est un montant positif et que le
	// nombre de decimales n'est pas superieur a la limite
	+function(webankValidator) {
		'use strict';
		function isAmount(strString,nbdec,exactNbDec) {
			var strChar;
			var point = false;
			var strVChars;
			var nbr_dec = 0;
			strVChars = "0123456789.";
			
			if(strString.length == 0) return false;
			if(strString.charAt(strString.length -1) == '.') return false;
			
			for (var i = 0; i < strString.length; i++) {
				strChar = strString.charAt(i);
				if(strVChars.indexOf(strChar) == -1) return false;
				
				if(point == true) {
					nbr_dec = nbr_dec + 1;
					if(nbr_dec > nbdec) return( false );
				}
				
				if(strChar == '.') {
					if ( point == false ) point = true;
					else return false;
				}
			}
			
			if(exactNbDec) {
				if(nbr_dec != nbdec) return( false );
			}
			
			return true;
		}
		webankValidator.isAmount= isAmount;
	}(webankValidator);
	
	+function(webankValidator) {
		function verifyIban(codePays, checkDigit, ribLocal) {
			if(verifyIban.arguments.length != 3) return false;
			return verifyStrIban(codePays + checkDigit + ribLocal);
		}
		
		function verifyStrIban(strIban) {
			if(strIban.length < 5 || !isStringAlphaDigit(strIban)) return false;
			strIban = strIban.toUpperCase();
			
			var strIbanInverse =  strIban.substring(4) + strIban.substring(0, 4);
			var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var tab1 ="10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35".split(",");
			
			while(strIbanInverse.match(/\D/) != null) {
				strIbanInverse = strIbanInverse.replace(/\D/, tab1[tab.indexOf(strIbanInverse.match(/\D/))]);
			}
			
			if(getMod97(strIbanInverse) != 1) return false;
			return true;
		}
		
		function isStringAlphaDigit(strString) {
			for(i = 0; i < strString.length ; i++) {
				if(isCharAlphaDigit(strString.charAt(i)) == false) return false;
			}
			return true;
		}
		
		function isCharAlpha(ch) {
			if(((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z'))) return true;
			return false;
		}
		function isCharDigit(ch) {
			if((ch >= '0') && (ch <= '9')) return true;
			return false;
		}
		
		function isCharAlphaDigit(ch) {
			if(isCharAlpha(ch) || isCharDigit(ch)) return true;
			return false;
		}
		
		function getMod97(sIBAN) {
			var sChunk = "";
			var nResult = 0, nProcessed = 0, nInputLength = sIBAN.length, nModChunk;
			
			var bFirst = true;
			var nAmount = 9;
			var intermediaire = 0, nombre = 0;
			while(nProcessed < nInputLength) {
				if(nProcessed + nAmount > nInputLength) nAmount = nInputLength - nProcessed;
				
				sChunk += sIBAN.substr(nProcessed, nAmount);
				intermediaire = sChunk;
				nombre = new Number(sChunk);
				
				nModChunk = nombre % 97;
				sChunk = new String(nModChunk);
				nProcessed += nAmount;
				nAmount = 7;
			}
			
			return nModChunk;
		}
		
		function verifyRIB(bankCode, counterCode, numAccount, key) {
			if (!isStringAlphaDigit(bankCode) || !isStringAlphaDigit(counterCode) || !isStringAlphaDigit(numAccount) || !isStringAlphaDigit(key)) return false;
			if (bankCode.length != 5 || counterCode.length != 5 || numAccount.length != 11 || key.length != 2) return false;
			
			var cpt = numAccount.toUpperCase();
			var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var tab1 = "123456789123456789234567890123456789".split("");
			while (cpt.match(/\D/) != null) {
				cpt = cpt.replace(/\D/, tab1[tab.indexOf(cpt.match(/\D/))]);
			}
			
			var cp = parseInt(cpt, 10);
			var a = bankCode%97;
			a = a*100000+parseInt(counterCode, 10);
			a = a%97;
			a = a*Math.pow(10, 11) + cp;
			a = a%97
			a = a*100;
			a = a%97
			a = 97-a;
			return (key == a);
		}

		webankValidator.verifyIban = verifyIban;
		webankValidator.verifyRIB = verifyRIB;
	}(webankValidator);
	
	
	/**
	 * Vérification si la date est antérieure à la date courante
	 */
	+function(webankValidator) {
		'use strict';
		function compareTwoValidDates(strd1,strd2,delimiter){
			var tabD1,tabD2,A1,A2,M1,M2,J1,J2;
			
			tabD1 = strd1.split(delimiter);
			J1 = Math.round(parseFloat(tabD1[0]));
			M1 = Math.round(parseFloat(tabD1[1]));
			A1 = Math.round(parseFloat(tabD1[2]));
			
			tabD2 = strd2.split(delimiter);	
			J2 = Math.round(parseFloat(tabD2[0]));
			M2 = Math.round(parseFloat(tabD2[1]));
			A2 = Math.round(parseFloat(tabD2[2]));
			
			if( A1<A2 || ( A1==A2 && M1<M2 ) || ( A1==A2 && M1==M2 && J1<J2 ) )
				return -1;

			if( A1>A2 || ( A1==A2 && M1>M2 ) || ( A1==A2 && M1==M2 && J1>J2 ) )
				return 1;

			return 0;
		}
		function isPastDate(strd, delimiter){
			var d = new Date();
			var annee = d.getYear();
			
			if( annee < 999 )
				annee = 1900 + annee;
			
			var nowFormat = d.getDate() + delimiter + (d.getMonth()+1) + delimiter + annee;
			var comp = compareTwoValidDates(strd, nowFormat, delimiter);

			if(  comp == -1 ){
				return true;
			}
			
			return false;
		}
		webankValidator.isPastDate= isPastDate;
	}(webankValidator);
	
	
	/**
	 * Vérification caractères alphanumériques
	 */
	+function(webankValidator) {
		'use strict';
		function cfonbCharAutorised( ch )
		{
		    if ( (ch == '/') || (ch == '*') || (ch == '-') || (ch == '.') || (ch == ')') || (ch == '(') || (ch == ' ') )
		      return true;
		    else
		      return false;
		}
		function isCharDigit( ch )
		{
		    if ( (ch >= '0') && (ch <= '9') )
		      return true;
		    else
		      return false;
		}
		function isCharAlpha( ch )
		 {
		     if ( ((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z')) )
		       return true;
		     else
		       return false;
		 }
		function isCharAlnum( ch )
		{
		    if ( isCharAlpha( ch ) || isCharDigit( ch ) || cfonbCharAutorised( ch ) )
		      return true;
		    else
		      return false;
		}
		
		function isAlnum( strString )
		{
			for (var i = 0; i < strString.length ; i++)
			{
		    	if ( isCharAlnum (strString.charAt(i)) == false ) 
		      		return false;
		    }
		      return true;
		}
		
		function sepaCharAutorised( ch )
		{
		    if ( (ch == '/') || (ch == '-') || (ch == '?') || (ch == ':') || (ch == '(') || (ch == ')')
		            || (ch == '.') || (ch == ',') || (ch == "'") || (ch == '+') || (ch == ' ') )
		      return true;
		    else
		      return false;
		}

		function isSepaChar( ch )
		{
		    if ( isCharAlpha( ch ) || isCharDigit( ch ) || sepaCharAutorised( ch ) )
		      return true;
		    else
		      return false;
		}
		
		function isSepaAlnum( strString )
		{
		    for (var i = 0; i < strString.length ; i++)
		    {
		        if ( isSepaChar (strString.charAt(i)) == false )
		              return false;
		    }
		      return true;
		}		
		
		webankValidator.isAlnum= isAlnum;
		webankValidator.isSepaAlnum = isSepaAlnum;
	}(webankValidator);
	
}.call(this));