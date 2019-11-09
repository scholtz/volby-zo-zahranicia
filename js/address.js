var App = window.election;

function findZIP(){
	var psc = $("#addressslovakia-zip").val().replace(' ','');
	if( psc.length == 5 ){
		if( psc in App.psc){
			kraj = App.psc[psc][2] + " kraj";
			okres = "Okres "+ App.psc[psc][1];
			obec = App.psc[psc][0];
			
			if($("#addressslovakia-kraj option[value='"+kraj+"']").length > 0){
				$("#addressslovakia-kraj").val(kraj).trigger("change");
			}
			if($("#addressslovakia-okres option[value='"+okres+"']").length > 0){
				$("#addressslovakia-okres").val(okres).trigger("change");
			}
			if($("#addressslovakia-city option[value='"+obec+"']").length > 0){
				$("#addressslovakia-city").val(obec).trigger("change");
			}
			
			$('.wrong-psc').html('');
		}else{
			$('.wrong-psc').html('PSČ nie je v zozname. Vyberte z možností nižšie, alebo opravte.');
		}
	}else{
		$('.wrong-psc').html('');
	}
}

function getAddressOneLine(id) {
  var ret = "";
  var format = getAdressFormat(id);

  if ($('#' + id + '-street').val()) {
	if(format=="sk" || format=="sk-poste-restante" ){
     ret += $('#' + id + '-street').val() + " " + $('#' + id + '-streetno').val();
	}else if(format == "usa" || format=="usa-poste-restante" ){
     ret += $('#' + id + '-streetno').val() + " " + $('#' + id + '-street').val();
	}
  } else {
    if (id == "addressslovakia") {
      getObec() + " " + $('#' + id + '-streetno').val();
    } else {

 	 if(format=="sk" || format=="sk-poste-restante"){
      ret += $('#' + id + '-city').val() + " " + $('#' + id + '-streetno').val();
	 }else if(format == "usa" || format=="usa-poste-restante"){
      ret += $('#' + id + '-streetno').val() + " " + $('#' + id + '-city').val();
	 }
    }

  }
  if (ret != " ") ret += ", ";


  if (id == "addressslovakia") {
	ret += $('#' + id + '-zip').val() + " " + getObec();
  } else {
   if(format=="sk" || format=="sk-poste-restante"){
    ret += $('#' + id + '-zip').val() + " " + $('#' + id + '-city').val();
   }else if(format == "usa" || format=="usa-poste-restante"){
    ret += $('#' + id + '-city').val() + " " + $('#' + id + '-zip').val();
   }
  }

  if (ret != " ") ret += ", ";

  if (id == "addressslovakia") {
    ret += "Slovenská republika";
  } else {
    ret += $('#' + id + '-country').val();
  }
  return ret;
}


function nacitajKraje(){
	var options = $("#addressslovakia-kraj");
	options.find('option').remove();
	for (var key in App.cities) {
		options.append($("<option />").val(key).text(key));
	}
	if(!iOSversion()){
		options.select2({width:"100%"});
	}
	nastavKraj();
}
function nastavKraj(){
	var options = $("#addressslovakia-okres");
	options.find('option').remove();
    var kraj = $("#addressslovakia-kraj").val();
	for (var key in App.cities[kraj]) {
		options.append($("<option />").val(key).text(key));
	}
	nastavOkres();
	if(!iOSversion()){
		options.select2({width:"100%"});
	}
}
function nastavOkres(){
	var options = $("#addressslovakia-city");
	options.find('option').remove();
    var kraj = $("#addressslovakia-kraj").val();
    var okres = $("#addressslovakia-okres").val();
	for (var key in App.cities[kraj][okres]) {
		options.append($("<option />").val(key).text(App.cities[kraj][okres][key][App.C2N_NAZOV_OBCE]));
	}
	nastavObec();
	if(!iOSversion()){
		options.select2({width:"100%"});
	}
}
function getObec(){

  var ico = $("#addressslovakia-city").val();
  var kraj = $("#addressslovakia-kraj").val();
  var okres = $("#addressslovakia-okres").val();
  var o = App.cities;

  if (ico && o[kraj] && o[kraj][okres] && o[kraj][okres][ico]) {
	return o[kraj][okres][ico][App.C2N_NAZOV_OBCE];
  }
  return "Nepodarilo sa načítať obec";
}
function nastavObec(obec) {

	// list/db of all cities comes from external file (js/cities)
  var o = App.cities;
  console.log(window.election.cities['Banskobystrický kraj']['Okres Rimavská Sobota']['1rimavska-sobota']);
  var adresa = "";
  var ico = $("#addressslovakia-city").val();
  var kraj = $("#addressslovakia-kraj").val();
  var okres = $("#addressslovakia-okres").val();
  console.log("Nastavujem obec",ico);
  if (ico) {

    if (o[kraj] && o[kraj][okres] && o[kraj][okres][ico]) {
	  var data = o[kraj][okres][ico];
      

      adresa = data[App.C2N_TYP_URADU] + "\n";
      if (data[App.C2N_TYP_URADU_RIADOK2] != "") {
        adresa += data[App.C2N_TYP_URADU_RIADOK2] + "\n";
      }
      if (data[App.C2N_ADRESA_URADU_ULICA] != "" || data[App.C2N_ADRESA_URADU_CISLO_DOMU] != "") {
        if (data[App.C2N_ADRESA_URADU_ULICA]) {
          adresa += data[App.C2N_ADRESA_URADU_ULICA] + " ";
        }
        if (data[App.C2N_ADRESA_URADU_CISLO_DOMU]) {
          adresa += data[App.C2N_ADRESA_URADU_CISLO_DOMU];
        }
        adresa += "\n";
      }
	  
	  
	  var email = data[App.C2N_EMAIL];
	  
	  if((App.request_form == "ziadostOPreukazPostou" || App.request_form =="ziadostOPreukaPreSplnomocnenca") && data[App.C2N_ALT_EMAIL_PRE_PREUKAZ].indexOf("@") != -1){
		  email = data[App.C2N_ALT_EMAIL_PRE_PREUKAZ];
	  }
	  
      adresa += data[App.C2N_ADRESA_URADU_PSC] + " " + data[App.C2N_ADRESA_URADU_MESTO] + "\n" + email.replace(/;/i, "\n");
	
    if(App.request_form == 'volbaPostouBezTrvalehoPobytu'){
  	  $("#adresa").val("Ministerstvo vnútra Slovenskej republiky\nodbor volieb, referenda a politických strán\nDrieňová 22\n826 86  Bratislava 29\nSLOVAK REPUBLIC");
      $("#sendto").html("volby@minv.sk");
	  $("#phone").html("");
	  $("#phonetext").hide();
    }else{
      $("#adresa").val(adresa);
	  $("#sendto").html(email);
	  if(data[App.C2N_TELEFON] != ""){
		  $("#phone").html(data[App.C2N_TEL_PREDVOLBA] + " / " + data[App.C2N_TELEFON]);
		  $("#phonetext").show();
	  }else{
		  $("#phone").html("");
		  $("#phonetext").hide();
	  }
    }
	if($("#sendto").html().indexOf("@") == -1){
		$("#sendemail").hide();
		$("#noemail").show();
	}else{
		$("#sendemail").show();
		$("#noemail").hide();
	}
    
    $("#emailnepotvrdeny").hide();
    $("#emailpotvrdeny").hide();
    $("#emailnezverejneny").hide();
    $("#emailpotvrdenydobrovolnikom").hide();
    
	if(data[App.C2N_POTVRDENE_UDAJE] == "0"){
		$("#emailnepotvrdeny").show();
    }
	if(data[App.C2N_POTVRDENE_UDAJE] == "1"){
		$("#emailpotvrdeny").show();
    }
	if(data[App.C2N_POTVRDENE_UDAJE] == "2"){
		$("#emailnezverejneny").show();
    }
	if(data[App.C2N_POTVRDENE_UDAJE] == "3"){
		$("#emailpotvrdenydobrovolnikom").show();
    }
    
	var subj = "Ziadost";
    var textemailu = "";
	var meno = $('#basicinfo-name').val()+" "+$('#basicinfo-lastname').val();
	var identifikacia_volica = ""+
	"Osobné údaje voliča:"
	"Meno: "+$('#basicinfo-name').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Priezvisko: "+$('#basicinfo-lastname').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Rodné číslo / dát. nar. (len ak rod. číslo nebolo pridelené): "+$('#basicinfo-birthno').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Rodné priezvisko: "+$('#basicinfo-maidenlastname').val()+". "+decodeURIComponent("%0D%0A%0D%0A")
	;	
	var adresa_na_slovensku = ""+
	"Adresa trvalého bydliska v SR: "+decodeURIComponent("%0D%0A%0D%0A")+
	"Ulica: "+$('#addressslovakia-street').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Číslo domu: "+$('#addressslovakia-streetno').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Mesto: "+$('#addressslovakia-city').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"PSČ: "+$('#addressslovakia-zip').val()+". "+decodeURIComponent("%0D%0A%0D%0A")
	;
	var adresa_v_cudzine = ""+
	"Adresa v cudzine: "+decodeURIComponent("%0D%0A%0D%0A")+
	"Ulica: "+$('#addressforeign-street').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Číslo domu: "+$('#addressforeign-streetno').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Mesto: "+$('#addressforeign-city').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"PSČ: "+$('#addressforeign-zip').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Štát: "+$('#addressforeign-country').val()+". "+decodeURIComponent("%0D%0A%0D%0A")
	;
	var proxy = ""+
	"Splomocnenec:"
	"Meno: "+$('#proxy-name').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Priezvisko: "+$('#proxy-lastname').val()+", "+decodeURIComponent("%0D%0A%0D%0A")+
	"Číslo občianskeho preukazu: "+$('#proxy-idno').val()+", "+decodeURIComponent("%0D%0A%0D%0A")
	;
	var dodatok = decodeURIComponent("%0D%0A%0D%0A")+decodeURIComponent("%0D%0A%0D%0A")+"[Táto žiadosť bola vytvorená pomocou aplikácie https://volby.srdcomdoma.sk Podnety nám môžete posielať na info@srdcomdoma.sk. Ďakujeme]";

    if(App.request_form == 'volbaPostouSTrvalymPobytom'){
      	var subj = "Žiadosť o voľbu poštou pre voľby do NRSR - "+meno;
      	var textemailu = "Dobrý deň, "+decodeURIComponent("%0D%0A%0D%0A")+"podľa § 60 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+decodeURIComponent("%0D%0A%0D%0A")+
			identifikacia_volica+
			adresa_na_slovensku+
			"Hlasovacie lístky s návratovou obálkou prosím zašlite na adresu:"+decodeURIComponent("%0D%0A%0D%0A")+
			adresa_v_cudzine+
			"Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+decodeURIComponent("%0D%0A%0D%0A")+" "+decodeURIComponent("%0D%0A%0D%0A")+
			"Ďakujem,"+decodeURIComponent("%0D%0A%0D%0A")+
			meno+
			dodatok;
    }else if(App.request_form == 'volbaPostouBezTrvalehoPobytu'){
		$("#emailpotvrdeny").hide();
		var subj = "Žiadosť o voľbu poštou pre voľby do NRSR - "+meno;
		var textemailu = "Dobrý deň, "+decodeURIComponent("%0D%0A%0D%0A")+"podľa § 59 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku 2020 a o zaslanie hlasovacích lístkov a obálok na adresu uvedenú v žiadosti. "+decodeURIComponent("%0D%0A%0D%0A")+
	      	identifikacia_volica+
	      	adresa_v_cudzine+
	      	"Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+decodeURIComponent("%0D%0A%0D%0A")+" "+decodeURIComponent("%0D%0A%0D%0A")+
			"ČESTNÉ VYHLÁSENIE"+decodeURIComponent("%0D%0A%0D%0A")+
			"Na účely voľby poštou do Národnej rady Slovenskej republiky v roku 2020"+decodeURIComponent("%0D%0A%0D%0A")+
			"čestne vyhlasujem,"+decodeURIComponent("%0D%0A%0D%0A")+
			"že nemám trvalý pobyt na území Slovenskej republiky."+decodeURIComponent("%0D%0A%0D%0A")+
			"Príloha:"+decodeURIComponent("%0D%0A%0D%0A")+
			"- fotokópia časti cestovného dokladu Slovenskej republiky s osobnými údajmi voliča , alebo fotokópia osvedčenia o štátnom občianstve Slovenskej republiky voliča, ktorého dátum vydania nie je starší ako 6 mesiacov)."+decodeURIComponent("%0D%0A%0D%0A")+
			"Ďakujem,"+decodeURIComponent("%0D%0A%0D%0A")+
			meno+
			dodatok;
    }else if(App.request_form == "ziadostOPreukazPostou"){
      var subj = "Žiadosť o hlasovací preukaz - "+meno;
      var textemailu = "Dobrý deň, "+decodeURIComponent("%0D%0A%0D%0A")+"podľa § 46 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o vydanie hlasovacieho preukazu pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+decodeURIComponent("%0D%0A%0D%0A")+
			identifikacia_volica+
			adresa_na_slovensku+
			"Hlasovací preukaz prosím zašlite na adresu:"+decodeURIComponent("%0D%0A%0D%0A")+
			adresa_v_cudzine+
			"Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+decodeURIComponent("%0D%0A%0D%0A")+" "+decodeURIComponent("%0D%0A%0D%0A")+
			"Ďakujem,"+decodeURIComponent("%0D%0A%0D%0A")+
			meno+
			dodatok;
    }else if(App.request_form =="ziadostOPreukaPreSplnomocnenca"){
      var subj = "Žiadosť o hlasovací preukaz - "+meno;
      var textemailu = "Dobrý deň, "+decodeURIComponent("%0D%0A%0D%0A")+"podľa § 46 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o vydanie hlasovacieho preukazu pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+decodeURIComponent("%0D%0A%0D%0A")+
			identifikacia_volica+
			adresa_na_slovensku+
			"Hlasovací preukaz za mňa preberie:"+decodeURIComponent("%0D%0A%0D%0A")+
			proxy+
			"Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+decodeURIComponent("%0D%0A%0D%0A")+" "+decodeURIComponent("%0D%0A%0D%0A")+
			"Ďakujem,"+decodeURIComponent("%0D%0A%0D%0A")+" "+
			meno+
			dodatok;
    }

    $("#emailsubject").html(subj);
    $("#emailbody").html(textemailu);
	if(jQuery.data( document.body, "psc-locked")){}else{
		//$("#addressslovakia-zip").val(data[4]);
	}
    $("#send").attr("href", "mailto:" + $("#sendto").html() + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(textemailu));

    }
  }
}

function getAdressFormat(id){
  var format = $('#' + id + '-format').val();
  if(!format) format = "sk";
  return format;
}

function isPosRes(format){
	return ( format.indexOf('poste-restante') !== -1 );
}

function nastavPosteRestante(){
	App.poste_res = isPosRes( getAdressFormat('addressforeign') );

	if( App.poste_res ) {
	  	$('.field-addressforeign-street label:first').html('Poste Restante');
	  	$('#addressforeign-street').val('Poste Restante');
	  	$('.field-addressforeign-streetno label:first').html('Adresa Pošty');
	  	$('.field-addressforeign-city label:first').html('Mesto');
	  	$('.field-addressforeign-zip label:first').html('PSČ Pošty');
	} else {
	  	$('.field-addressforeign-street label:first').html('Ulica');
	  	$('#addressforeign-street').val('');
	  	$('.field-addressforeign-streetno label:first').html('Číslo domu');
	  	$('.field-addressforeign-city label:first').html('Mesto');
	  	$('.field-addressforeign-zip label:first').html('PSČ');
	}
}
