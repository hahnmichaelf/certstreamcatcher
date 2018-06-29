/**
 * Github
 * https://github.com/6IX7ine/certstreamcatcher
 *
 * Copyright (c) 2017 Fábio Castro
 * Licensed under the MIT license.
 */

 'use strict'

 const tld = require('tldjs');
 const json = require('json');
 const lodash = require('lodash');
 const color = require('cli-color');
 const status = require('node-status');
 const punycode = require('punycode');
 const leven = require('fast-levenshtein');
 const protect = require('./protect.json');
 const fs = require('fs');
 const idnanormalizer = require('idna-normalize')
 const domainnormalize = new idnanormalizer()

 const yellow = color.yellow.underline;
 const danger = color.redBright.underline;
 const white = color.white.underline;

 const certificates = status.addItem('certificates');
 var detected = require('./certstreamblacklist.json');

 const mapping =  {
   "a": ["á","à","â","ǎ","ă","ã","ả","ȧ","ạ","ä","å","ḁ","ā","ą","ᶏ","ⱥ","ȁ","ấ","ầ","ẫ","ẩ","ậ","ắ","ằ","ẵ","ẳ","ặ","ǻ","ǡ","ǟ","ȁ","ȃ","ɑ"],
   "b": ["ḃ","ḅ","ḇ","ƀ","ɓ","ƃ","ᵬ","ᶀ","ʙ","Ｂ","ｂ"],
   "c": ["Ć","ć","Ĉ","ĉ","Č","č","Ċ","ċ","̄c̄","Ç","ç","Ḉ","ḉ","Ȼ","ȼ","Ƈ","ƈ","ɕ","ᴄ","Ｃ","ｃ"],
   "d": ["ď","ḋ","ḑ","ḍ","ḓ","ḏ","đ","Ð","ð","̦d̦","ɖ","ɗ","ᵭ","ᶁ","ᶑ","ȡ","ᴅ","ｄ"],
   "e": ["é","è","ê","ḙ","ě","ĕ","ẽ","ḛ","ẻ","ė","ë","ē","ȩ","ę","ᶒ","ȅ","ế","ề","ễ","ể","ḝ","ḗ","ḕ","ȇ","ẹ","ệ","ⱸ","ᴇ","ｅ"],
   "f": ["Ḟ","ḟ","Ƒ","ƒ","ᵮ","ᶂ","ꜰ","Ｆ","ｆ"],
   "g": ["ǵ","ğ","ĝ","ǧ","ġ","ģ","ḡ","ǥ","ᶃ","ｇ"],
   "h": ["ĥ","ȟ","ḧ","ḣ","ḩ","ḥ","ḫ","̱ẖ","ħ","ⱨ","ɦ","ｈ"],
   "i": ["Í","í","Ì","ì","Ĭ","ĭ","Î","î","Ǐ","ǐ","Ï","ï","Ḯ","ḯ","Ĩ","ĩ","Į","į","Ī","ī","Ỉ","ỉ","Ȉ","ȉ","Ȋ","ȋ","Ị","ị","Ḭ","ḭ","Ɨ","ɨ","ᵻ","ᶖ","İ","ı","ɪ","Ｉ","ｉ"],
   "j": ["Ĵ","ĵ","ɉ","̌ǰ","ȷ","ʝ","ɟ","ʄ","ᴊ","Ｊ","ｊ","I"],
   "k": ["Ḱ","ḱ","Ǩ","ǩ","Ķ","ķ","Ḳ","ḳ","Ḵ","ḵ","Ƙ","ƙ","Ⱪ","ⱪ","ᶄ","ᶄ","Ꝁ","ꝁ","ᴋ","Ｋ","ｋ"],
   "l": ["Ĺ","ĺ","Ľ","ľ","Ļ","ļ","ḷ","Ḷ","ḷ","Ḹ","ḹ","Ḽ","ḽ","Ḻ","ḻ","Ł","ł","Ŀ","ŀ","Ƚ","ƚ","Ⱡ","ⱡ","Ɫ","ɫ","ɬ","ᶅ","ɭ","ȴ","ʟ","Ｌ","ｌ"],
   "m": ["Ḿ","ḿ","ṁ","Ṃ","ṃ","ᵯ","ᶆ","Ɱ","ɱ","ᴍ","Ｍ","ｍ"],
   "n": ["Ń","ń","Ǹ","ǹ","Ň","ň","Ñ","ñ","Ṅ","ṅ","Ņ","ņ","Ṇ","ṇ","Ṋ","ṋ","Ṉ","ṉ","̈n̈","Ɲ","ɲ","Ƞ","ƞ","ᵰ","ᶇ","ɳ","ȵ","ɴ","Ｎ","ｎ","Ŋ","ŋ"],
   "o": ["Ó","ó","Ò","ò","Ŏ","ŏ","Ô","ô","Ố","ố","Ồ","ồ","Ỗ","ỗ","Ổ","ổ","Ǒ","ǒ","Ö","ö","Ȫ","ȫ","Ő","ő","Õ","õ","Ṍ","ṍ","Ṏ","ṏ","Ȭ","ȭ","Ȯ","ȯ","Ȱ","ȱ","Ø","ø","Ǿ","ǿ","Ǫ","ǫ","Ǭ","ǭ","Ō","ō","Ṓ","ṓ","Ṑ","ṑ","Ỏ","ỏ","Ȍ","ȍ","Ȏ","ȏ","Ơ","ơ","Ớ","ớ","Ờ","ờ","Ỡ","ỡ","Ở","ở","Ợ","ợ","Ọ","ọ","Ộ","ộ","Ɵ","ɵ","ⱺ","ᴏ","Ｏ","ｏ"],
   "p": ["Ṕ","ṕ","Ṗ","ṗ","Ᵽ","ᵽ","Ƥ","ƥ","̃p","̃ᵱ","ᶈ","ᴘ","Ｐ","ｐ","ȹ"],
   "q": ["Ɋ","ɋ","ʠ","Ｑ","ｑ","ȹ"],
   "r": ["Ŕ","ŕ","Ř","ř","Ṙ","ṙ","Ŗ","ŗ","Ȑ","ȑ","Ȓ","ȓ","Ṛ","ṛ","Ṝ","ṝ","Ṟ","ṟ","Ɍ","ɍ","Ɽ","ɽ","ᵲ","ᶉ","ɼ","ɾ","ᵳ","ʀ","Ｒ","ｒ"],
   "s": ["ẞ","ß","Ś","ś","Ṥ","ṥ","Ŝ","ŝ","Š","š","Ṧ","ṧ","Ṡ","ṡ","ẛ","Ş","ş","Ṣ","ṣ","Ṩ","ṩ","Ș","ș","̩s̩","ᵴ","ᶊ","ʂ","ȿ","ꜱ","Ｓ","ｓ"],
   "t": ["Ť","ť","Ṫ","ṫ","Ţ","ţ","Ṭ","ṭ","Ț","ț","Ṱ","ṱ","Ṯ","ṯ","Ŧ","ŧ","Ⱦ","ⱦ","Ƭ","ƭ","Ʈ","ʈ","̈ẗ","ᵵ","ƫ","ȶ","ｔ"],
   "u": ["Ú","ú","Ù","ù","Ŭ","ŭ","Û","û","Ǔ","ǔ","Ů","ů","Ü","ü","Ǘ","ǘ","Ǜ","ǜ","Ǚ","ǚ","Ǖ","ǖ","Ű","ű","Ũ","ũ","Ṹ","ṹ","Ų","ų","Ū","ū","Ṻ","ṻ","Ủ","ủ","Ȕ","ȕ","Ȗ","ȗ","Ư","ư","Ứ","ứ","Ừ","ừ","Ữ","ữ","Ử","ử","Ự","ự","Ụ","ụ","Ṳ","ṳ","Ṷ","ṷ","Ṵ","ṵ","Ʉ","ʉ","ᵾ","ᶙ","ᴜ","Ｕ","ｕ","ᵫ"],
   "v": ["Ṽ","ṽ","Ṿ","ṿ","Ʋ","ʋ","ᶌ","ᶌ","ⱱ","ⱴ","ᴠ","Ｖ","ｖ"],
   "w": ["Ẃ","ẃ","Ẁ","ẁ","Ŵ","ŵ","Ẅ","ẅ","Ẇ","ẇ","Ẉ","ẉ","ẘ","ẘ","Ⱳ","ⱳ","ᴡ","Ｗ","ｗ"],
   "x": ["Ẍ","ẍ","Ẋ","ẋ","ᶍ","Ｘ","ｘ"],
   "y": ["Ý","ý","Ỳ","ỳ","Ŷ","ŷ","ẙ","Ÿ","ÿ","Ỹ","ỹ","Ẏ","ẏ","Ȳ","ȳ","Ỷ","ỷ","Ỵ","ỵ","Ɏ","ɏ","Ƴ","ƴ","ʏ","Ｙ","ｙ"],
   "z": ["Ź","ź","Ẑ","ẑ","Ž","ž","Ż","ż","Ẓ","ẓ","Ẕ","ẕ","Ƶ","ƶ","Ȥ","ȥ","Ⱬ","ⱬ","ᵶ","ᶎ","ʐ","ʑ","ɀ","ᴢ","Ｚ","ｚ"]
}

const lengthtotest = 1;
const lengthstandard = 7;
var startprintstatus = false

var keywords = [];
var newstring = '';
var str = '';

function checkLevenshtein(input, str){
  var lengthtouse = lengthtotest;
  var smallestleven = 15;
  var phishingOf = '';
  var length = 0;
  let inputdomain = tld.parse(input).domain;

  let subdomain = tld.parse(inputdomain).subdomain;
  let tlddomain = tld.parse(inputdomain).publicSuffix;
  let tlddomainstr = "." + tlddomain;
  let functionaldomain = input.replace(tlddomainstr, '');

  if(functionaldomain.length >= 10){
    let functionaldomain = input.replace(tlddomainstr, '');
    lengthtouse = 2;
    for(var i = 0; i <= protect.length-1; i++){
      var domain = protect[i];
      var domaintld = tld.parse(domain).publicSuffix;
      domaintld = "." + domaintld
      domain = domain.replace(domaintld,'');
      length = leven.get(functionaldomain, domain);
      if(length < smallestleven){
        smallestleven = length;
        phishingOf = i;
      }
    }

    if(smallestleven <= lengthtouse){
      if(detected.indexOf(input) <= -1){
        detected.push(str);
        console.log("Domain: " + input + " was found as levenshtein <= " + lengthtouse + " of: " + protect[phishingOf]);
        console.log(JSON.stringify(detected, null, 4))
      }
      return true;
    }
    if(smallestleven > lengthtouse){
      return false;
    }
  }

  else if(functionaldomain.length < 10 && functionaldomain.length >= 9){
    let functionaldomain = input;
    lengthtouse = 2;
    for(var i = 0; i <= protect.length-1; i++){
      var domain = protect[i];
      length = leven.get(functionaldomain, domain);
      if(length < smallestleven){
        smallestleven = length;
        phishingOf = i;
      }
    }

    if(smallestleven <= lengthtouse){
      if(detected.indexOf(input) <= -1){
        detected.push(str);
        console.log("Domain: " + input + " was found as levenshtein <= " + lengthtouse + " of: " + protect[phishingOf]);
        console.log(JSON.stringify(detected, null, 4))
      }
      return true;
    }
    if(smallestleven > lengthtouse){
      return false;
    }
  }

    else if(functionaldomain.length < 9){
      let functionaldomain = input;
      lengthtouse = 1;
      for(var i = 0; i <= protect.length-1; i++){
        var domain = protect[i];
        length = leven.get(functionaldomain, domain);
        if(length < smallestleven){
          smallestleven = length;
          phishingOf = i;
        }
      }

      if(smallestleven <= lengthtouse){
        if(detected.indexOf(input) <= -1){
          detected.push(str);
          console.log("Domain: " + input + " was found as levenshtein <= " + lengthtouse + " of: " + protect[phishingOf]);
          console.log(JSON.stringify(detected, null, 4))
        }
        return true;
      }
      if(smallestleven > lengthtouse){
        return false;
      }
  }


}

 module.exports = {

 	certstreamClientPhishing: function (certstream, regex, tlds, options) {


 		this.certstream = certstream;
 		this.regex = regex;
 		this.tlds = tlds;

 		let settings = { tlds: false };

 		if (!options) { options = {}; }

 		for(var option in settings) {
 			if (typeof options[option] !== 'undefined') {
 				settings[option] = options[option];
 			} else {
 				settings[option] = settings[option];
 			}
 		}

		if (!lodash.includes(certstream, 'certificate_update')) {
			return;
		}


		let domains = certstream.data.leaf_cert.all_domains;
		let certs = certstream.data.chain;

		lodash.forEach(domains, function(domains) {

      lodash.forEach(certs, function(cert) {
        if (lodash.hasIn(cert,"subject")) {
          lodash.forOwn(cert, function(keyword) {
            if  (lodash.includes(cert.subject.aggregated, "Let's Encrypt")
              || lodash.includes(cert.subject.aggregated, "CACert free certificate")
              || lodash.includes(cert.subject.aggregated, "StartSSL"
              || lodash.includes(cert.subject.aggregated, "Cloudflare")
              || lodash.includes(cert.subject.aggregated, "Free SSL")))
            {
              let suspicious = true;
              if (lodash.startsWith(domains, '*.')) {
                domains = lodash.replace(domains, '*.', '', 0);
              }
              str = '';
              newstring = '';
              str = domains;
              str = str   .replace('http://','')
                          .replace('https://','')
                          .replace('[.]','.')
                          .replace('www.','')
                          .split(/[/?#]/)[0]
                          .toLowerCase();
              var input = domainnormalize.normalize(str);

              if (checkLevenshtein(input, str)){
                let keywords = (domains || []);
              }
            }
          });
        }
      });
    });
		certificates.inc();
    if(!startprintstatus){
      startprint(detected);
    }
	}
}

status.start({
	pattern: '{spinner.cyan} {certificates} Certs'
});

function startprint(detected){
  console.log("Start print process detected")
  startprintstatus = true;
  setTimeout(function(){
    fs.writeFile('./certstreamblacklist.json', JSON.stringify(detected, null, 4), 'utf8', function(e,results){
      if(e) console.log(e);
      else{
        startprintstatus = false;
      }
    });
  }, 3*60*1000);
}
