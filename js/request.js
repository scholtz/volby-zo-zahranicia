var App = window.election;

function createDocument(preview,download) {
  jQuery.data( document.body, "psc-locked", "1");
  nastavObec();
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  
  // playground requires you to assign document definition to a variable called dd
  var paragraph, localaddress = [], noTP = [], vyhlasenie = [], signature = [], idPhoto = [];signature2 = [];
  let hasIdPhoto = false, isValidSignature = false, hasVyhlasenie = false;
  var signaturedata = App.signaturePad.toDataURL();

  if (signaturedata.length > 10) {
    $('#signature').val(signaturedata);
  }
  
  
  if ($('#signature').val() != '' && $('#signature').val() != 'data:,') {
    isValidSignature = true;
      console.log("signature",$('#signature').val());
    signature =
            [
              {text: '', style: 'space'},
              {
                text: ['V ', {text: $('#addressforeign-city').val(), style: 'value'}],
                style: 'footer',
              },
              {
                text: ['Dátum: ', {text: '' + dd + '. ' + mm + '. ' + yyyy, style: 'value'}],
                style: 'footer',
              },
              {
                image: $('#signature').val(), width: 120, style: 'signatureStyle'
              },
              {
                text: '                      Podpis                      ',
                style: 'signatureTextStyle'
              }
            ];

    signature2 = [
      {text: '', style: 'space'},
      {
        text: ['V ', {text: $('#addressforeign-city').val(), style: 'value'}],
        style: 'footer',
      },
      {
        text: ['Dátum: ', {text: '' + dd + '. ' + mm + '. ' + yyyy, style: 'value'}],
        style: 'footer',
      },
      {
        image: $('#signature').val(), width: 150, alignment: 'right'
      },
      {
        text: '                      Podpis                      ',
        style: 'signatureTextStyle'
      }
    ];
  }
  if ($('#camera-input')[0].files.length > 0) {
      hasIdPhoto = true;
    idPhoto =
            [
              {
                image: $('#camera-preview').attr('src'),
                pageBreak: 'before',
                style: 'signature'
              }
            ]
  }

  if (App.request_form == 'volbaPrehlasenimBezTrvalehoPobytu') {
      
	formContent = [
      {
        columns: [
          {text: 'Obec: ', style: 'line',},
          {text: "", style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Volebný okrsok č.: ', style: 'line',},
          {text: "", style: 'value'},
          {text: ''}
        ]
      },
      {text: '', style: 'space'},
      {
        text: 'ČESTNÉ VYHLÁSENIE OBČANA SLOVENSKEJ REPUBLIKY',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'O TRVALOM POBYTE V CUDZINE',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        columns: [
          {text: 'Meno: ', style: 'line',},
          {text: $('#basicinfo-name').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Priezvisko: ', style: 'line',},
          {text: $('#basicinfo-lastname').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Rodné priezvisko: ', style: 'line',},
          {text: $('#basicinfo-maidenlastname').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: $("#isAgeSelected").is(':checked') ? 'Rodné číslo: ' : 'Dátum narodenia: ', style: 'line',},
          {text: $("#isAgeSelected").is(':checked') ? $('#basicinfo-birthno').val().toUpperCase() :  formatDate($('#basicinfo-birthdate').val()), style: 'value'},
          {text: ''}
        ]
      },
      {text: '', style: 'space'},
      {
        text: 'Adresa trvalého pobytu',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        columns: [
          {text: ( App.poste_res ? 'Adresa v cudzine:' : 'Ulica: '), style: 'line',},
          {text: ( App.poste_res ? 'Poste Restante' : $('#addressforeign-street').val().toUpperCase() ), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Číslo domu: '), style: 'line',},
          {text: ( App.poste_res ? ' ' : $('#addressforeign-streetno').val().toUpperCase() ), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Obec: '), style: 'line',},
          {text: $('#addressforeign-city').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'PSČ: '), style: 'line',},
          {text: $('#addressforeign-zip').val(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Štát: '), style: 'line',},
          {text: $('#addressforeign-country').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {text: '', style: 'space'},
      {
        text: 'čestne vyhlasujem,',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'že nemám trvalý pobyt na území Slovenskej republiky.',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: ['V ', {text: "", style: 'value'}],
        style: 'footer',
      },
      {
        text: ['Dátum: ', {text: elections_start_formatted, style: 'value'}],
        style: 'footer',
      },
      {
        text: '                      Podpis                      ',
        style: 'signatureTextStyle'
      }/**/
    ];
  }else
  if (App.request_form == 'volbaPostouSTrvalymPobytom') {
    paragraph = 'Podľa § 60 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov v znení neskorších predpisov žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku '+elections_year+'.';
    localaddress = [
      {text: '', style: 'spacesmall'},
      {
        text: 'Adresa trvalého pobytu v Slovenskej republike:',
        style: 'line',
        //style: 'header',
        bold: true
      },
      {
        columns: [
          {text: 'Ulica: ', style: 'line',},
          {text: $('#addressslovakia-street').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Číslo domu: ', style: 'line',},
          {text: $('#addressslovakia-streetno').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Obec: ', style: 'line',},
          {text: getObec().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'PSČ: ', style: 'line',},
          {text: $('#addressslovakia-zip').val(), style: 'value'},
          {text: ''}
        ]
      },
      {text: '', style: 'spacesmall'},
      {
        text: 'Adresa miesta pobytu v cudzine (pre zaslanie hlasovacích lístkov a obálok):',
        style: 'line',
        //style: 'header',
        bold: true
      }
    ];
  } else if (App.request_form == 'volbaPostouBezTrvalehoPobytu') {
    paragraph = 'Podľa § 59 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov v znení neskorších predpisov, žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku '+elections_year+' a o zaslanie hlasovacích lístkov a obálok na adresu:';
    localaddress = [
      {text: '', style: 'spacesmall'},
      {
        text: 'Adresa miesta pobytu v cudzine (pre zaslanie hlasovacích lístkov a obálok):',
        style: 'line',
        //style: 'header',
        bold: true
      }
     ];

    noTP = [
	   
      {text: '', style: 'space'},
      {
        text: 'Prílohy:',
        style: 'header',
        alignment: 'left'
      },
      {
        ul: [
		  'čestné vyhlásenie voliča, že nemá trvalý pobyt na území Slovenskej republiky.',
          'fotokópia časti cestovného dokladu Slovenskej republiky s osobnými údajmi voliča alebo fotokópia osvedčenia o štátnom občianstve Slovenskej republiky voliča, ktorého dátum vydania nie je starší ako 6 mesiacov',
        ]
      }
    ];
    hasVyhlasenie = true;
    vyhlasenie = [
      {text: '', style: 'space'},
      {text: '', style: 'space'},
      {
        text: $('#basicinfo-name').val() + ' ' + $('#basicinfo-lastname').val() + ' ' + $('#basicinfo-birthno').val(),
        alignment: 'center',
        pageBreak: 'before'
      },
      {
        text: getAddressOneLine('addressforeign'),
        alignment: 'center',
      },

      {text: '', style: 'space'},
      {
        text: 'ČESTNÉ VYHLÁSENIE',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: 'Na účely voľby poštou do Národnej rady Slovenskej republiky v roku '+elections_year+'',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: 'čestne vyhlasujem,',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: 'že nemám trvalý pobyt na území Slovenskej republiky.',
        alignment: 'center'
      },
      signature2
    ];
  }

  if (App.request_form === "volbaPostouSTrvalymPobytom" || App.request_form === "volbaPostouBezTrvalehoPobytu") {
	
	formContent = [
      {
        text: 'Žiadosť o voľbu poštou',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'pre voľby do Národnej rady Slovenskej republiky v roku '+elections_year+'',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: $('#adresa').val(),
        style: 'address',
      },
      {text: '', style: 'space'},
      {
        text: [
          paragraph
        ],
      },
      {text: '', style: 'spacesmall'},
      {
        columns: [
          {text: 'Meno: ', style: 'line',},
          {text: $('#basicinfo-name').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Priezvisko: ', style: 'line',},
          {text: $('#basicinfo-lastname').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: 'Rodné priezvisko: ', style: 'line',},
          {text: $('#basicinfo-maidenlastname').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: $("#isAgeSelected").is(':checked') ? 'Rodné číslo: ' : 'Dátum narodenia: ', style: 'line',},
          {text: $("#isAgeSelected").is(':checked') ? $('#basicinfo-birthno').val().toUpperCase() :  formatDate($('#basicinfo-birthdate').val()), style: 'value'},
          {text: ''}
        ]
      },
      localaddress,
      {
        columns: [
          {text: ( App.poste_res ? 'Adresa v cudzine:' : 'Ulica: '), style: 'line',},
          {text: ( App.poste_res ? 'Poste Restante' : $('#addressforeign-street').val().toUpperCase() ), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Číslo domu: '), style: 'line',},
          {text: ( App.poste_res ? ' ' : $('#addressforeign-streetno').val().toUpperCase() ), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Obec: '), style: 'line',},
          {text: $('#addressforeign-city').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'PSČ: '), style: 'line',},
          {text: $('#addressforeign-zip').val(), style: 'value'},
          {text: ''}
        ]
      },
      {
        columns: [
          {text: ( App.poste_res ? ' ' : 'Štát: '), style: 'line',},
          {text: $('#addressforeign-country').val().toUpperCase(), style: 'value'},
          {text: ''}
        ]
      },
      noTP
    ]
  }
  if (App.request_form === "ziadostOPreukazPostou") {
    preukazHeader = 'Žiadosť o vydanie hlasovacieho preukazu';
    preukazDelivery = [
      {
        text: 'Hlasovací preukaz žiadam zaslať na adresu:',
        style: 'line',
        alignment: 'left'
      },
      {
        columns: [
          {
            text: ['Meno: ', {text: $('#basicinfo-name').val().toUpperCase(), style: 'value'}],
          },
          {
            text: ['Priezvisko: ', {text: $('#basicinfo-lastname').val().toUpperCase(), style: 'value'}],
          }
        ]
      },
      {
        text: ['Adresa: ', {text: getAddressOneLine('addressforeign').toUpperCase(), style: 'value'}],
        style: 'line'
      }
    ]
  }

  if (App.request_form === "ziadostOPreukaPreSplnomocnenca") {
    preukazHeader = 'Žiadosť o vydanie hlasovacieho preukazu a splnomocnenie na jeho prevzatie';
    preukazDelivery = [
      {
        text: 'Na prevzatie hlasovacieho preukazu podľa § 46 ods. 6 zákona  splnomocňujem:',
        style: 'line',
        alignment: 'left'
      },
      {
        columns: [
          {
            text: ['Meno: ', {text: $('#proxy-name').val().toUpperCase(), style: 'value'}],
          },
          {
            text: ['Priezvisko: ', {text: $('#proxy-lastname').val().toUpperCase(), style: 'value'}],
          }
        ]
      },
      {
        text: ['Číslo občianskeho preukazu: ', {text: $('#proxy-idno').val().toUpperCase(), style: 'value'}],
        style: 'line'
      }
    ]
  }

  if (App.request_form === "ziadostOPreukazPostou" || App.request_form === "ziadostOPreukaPreSplnomocnenca") {
    formContent = [
      {
        text: $('#adresa').val(),
        style: 'address',
      },
      {text: '', style: 'space'},
      {
        text: preukazHeader,
        style: 'header',
        alignment: 'left'
      },
      {text: '', style: 'space'},
      {
        columns: [
          {
            text: ['Meno: ', {text: $('#basicinfo-name').val().toUpperCase(), style: 'value'}],
            style: 'line',
          },
          {
            text: ['Priezvisko: ', {text: $('#basicinfo-lastname').val().toUpperCase(), style: 'value'}],
            style: 'line',
          },
        ]
      },
      {
        columns: [
          {
            text: [$("#isAgeSelected").is(':checked') ? 'Rodné číslo: ' : 'Dátum narodenia: ', {text: $("#isAgeSelected").is(':checked') ? $('#basicinfo-birthno').val().toUpperCase() :  formatDate($('#basicinfo-birthdate').val()), style: 'value'}],
            style: 'line',
          },
          {
            text: ['Štátna príslušnosť: ', {text: 'Slovenská republika'.toUpperCase(), style: 'value'}],
            style: 'line',
          },
        ]
      },
      {
        text: ['Adresa trvalého pobytu: ', {text: getAddressOneLine('addressslovakia').toUpperCase(), style: 'value'}],
        style: 'line',
      },
      {text: '', style: 'space'},
      {
        text: 'žiadam',
        style: 'header',
        alignment: 'center'
      },
      {text: '', style: 'space'},
      {
        text: [
          {text: 'podľa § 46 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov '},
          {text: 'o vydanie hlasovacieho preukazu', bold: true},
          {text: ' pre voľby do Národnej rady Slovenskej republiky v roku '+elections_year+'.'},
        ]
      },
      {text: '', style: 'space'},
      preukazDelivery
    ]
  }
  
  let pdfContent = [];
  if(formContent) pdfContent.push(formContent);
  if(isValidSignature) pdfContent.push(signature);
  if(hasVyhlasenie) pdfContent.push(vyhlasenie);
  if(hasIdPhoto) pdfContent.push(idPhoto);
  
  let pdfConfig = {
	pageSize: 'A4',
	info: {
		title: 'Žiadosť o účasť vo voľbách',
		author: 'volby.scholtz.sk',
		subject: 'Žiadosť o účasť vo voľbách',
	},
    content: pdfContent,
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: 'justify'
      },
      value: {
        fontSize: 12,
        bold: true,
        margin: [0, 7, 0, 0],
        decoration: 'underline',
        decorationStyle: 'dotted'
      },
      address: {
        fontSize: 12,
        italic: true,
        alignment: 'justify',
        margin: [260, 10, 10, 10],
      },
      line: {
        fontSize: 12,
        margin: [0, 7, 0, 0],
        padding: [0, 0, 0, 0]
      },
      footer: {
        fontSize: 12,
        margin: [0, 0, 0, 0],
        padding: [0, 0, 0, 0]
      },
      space: {
        fontSize: 12,
        margin: [0, 40, 0, 0]
      },
      spacesmall: {
        fontSize: 12,
        margin: [0, 20, 0, 0]
      },
      signatureStyle: {
        margin: [0, -60, 0, 0],
        alignment: 'right'
      },
      signatureTextStyle: {
        decoration: 'overline',
        decorationStyle: 'dotted',
        alignment: 'right',
        margin: [30, 10],
        fontSize: 9
      }
    }
  }
	
  var name = "ziadost";
  
  if(preview){
	  if (App.request_form === "ziadostOPreukazPostou" || App.request_form === "ziadostOPreukaPreSplnomocnenca") {
		  name = "ziadost-o-hlasovaci-preukaz-nahlad.pdf";
	  }else if (App.request_form === "volbaPrehlasenimBezTrvalehoPobytu") {
		  name = "prehlasenie-o-tp-v-zahranici-nahlad.pdf";
	  }else{
		  name = "ziadost-o-volbu-postou-nahlad.pdf";
	  }
  }else{
	  if (App.request_form === "ziadostOPreukazPostou" || App.request_form === "ziadostOPreukaPreSplnomocnenca") {
		  name = "ziadost-o-hlasovaci-preukaz.pdf";
	  }else if (App.request_form === "volbaPrehlasenimBezTrvalehoPobytu") {
		  name = "prehlasenie-o-tp-v-zahranici.pdf";
	  }else{
		  name = "ziadost-o-volbu-postou.pdf";
	  }
  }
  
  
  if(detectIE() || isAndroid() || download){
          console.log("Idem vytvorit pdf v mobile",pdfConfig);
	  pdfMake.createPdf(pdfConfig).download(name);
  }else{

	  if (preview === true) {
        console.log("Idem vytvorit nahlad",pdfConfig);
		pdfMake.createPdf(pdfConfig).getDataUrl(function (result) {
          console.log("result",result);
		  $('#preview').attr('src', result);
          console.log("final.src",$('#preview').attr('src'));
		});
	  } else {
          console.log("Idem vytvorit finalny dokument",pdfConfig);
		pdfMake.createPdf(pdfConfig).getDataUrl(function (result) {
          console.log("result",result);
		  $('#final').attr('src', result);
          console.log("final.src",$('#final').attr('src'));
		});
	  }
  }
}
