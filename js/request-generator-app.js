var App = window.election;

var RequestGeneratorApp = function() {
    this.state = {
        tp: -1, // {'tp-na-slovensku', 'tp-odhlaseny'}
        volba: -1, // {volba-postou, volba-s-preukazom}
        preukaz: -1, // {preukaz-do-vlastnych-ruk, preukaz-preberie-splnomocnenec}
        prehlasenim: -1,
        action: '' // {action-preview, action-sign, action-finalize, action-send}
    };

    this.active_section = null;
    this.has_form_data = false;

    this.init();
};

RequestGeneratorApp.prototype = {
    init: function() {
        var that = this;

        $('.btn-submit-form').on('click', function(e){
            e.preventDefault();
			var submitform = true;
			if($(".has-error").length > 0){
				if(!confirm ("Ste si istý, že chcete vytvoriť žiadosť aj keď obsahuje chybu?")){
					submitform = false;
				}
			}
			if(submitform){
				that.submitForm();
			}
        });

        $('.btn-download-preview').on('click', function(e){
            e.preventDefault();
			createDocument(true,true);
            //that.downloadPdf();
        }); 
		$('.btn-download-pdf').on('click', function(e){
            e.preventDefault();
			createDocument(false,true);
            //that.downloadPdf();
        });

        $('.btn-finalize-pdf').on('click', function(e){
            e.preventDefault();

            that.finalizePdf();
        });

        $('.btn-sign-pdf').on('click', function(e){
            e.preventDefault();

            that.signPdf();
        });

        $('.btn-show-final-info').on('click', function(e){
            e.preventDefault();

            that.showFinalInfo();
        });

        $('.nav--progress a').on('click', function() {
            let step = that.getPreviousStep();
            if(App.Analytics && step){
                App.Analytics.trackStepBack(that.getStep(that.active_section), step);
            }
        });
    },

    getStep: function(section)
    {
        var steps_map = {
            'intro': 0,
            'start': 1,// 'intro',
            'tp-na-slovensku': 2,// 'start',
            'tp-v-zahranici': 2,// 'start',
            'preukaz': 3,// 'tp-na-slovensku',
            'prehlasenim': 4,
            'ziadost': 4,
            'pdf': 5,
            'sign': 6,
            'pdf-final': 7,
            'sendsection': 8
        };

        return steps_map[section];
    },

    renderStep: function()
    {
        var step = this.getStep(this.active_section);

        if (step > 0)
        {
            var a = $('.nav-item a');

            $('.counter__step').text(step);
            var previous_step = this.getPreviousStep();
            a.attr('href', '#' + this.getBackUrl()).text(previous_step == 0 ? 'Späť na úvod' : 'Späť na krok ' + previous_step);

            $('.counter').show();
            $('.nav-item').show();
        }
        else
        {
            $('.nav-item').hide();
            $('.counter').hide();
        }
    },

    getBackUrl: function() {
        switch (this.getStep(this.active_section))
        {
            case 0: return null;
            case 1: return 'intro';
            case 2: return 'start';
            default: return this.getBasePreviousStateUrl();
        }
    },

    getPreviousStep: function()
    {
        var section_and_state = this.resolveSectionAndState(this.getBackUrl());
        return this.getStep(section_and_state[0]);
    },

    getBasePreviousStateUrl: function()
    {
        var hash = location.hash.replace( /^#/, '');

        if (this.state.action)
        {
            var previous_action = this.getPreviousAction();

            if (previous_action)
            {
                return hash.replace(/&action-.*/, '&' + previous_action);
            }
        }

        hash = hash.replace(/&{0,1}[^&]*$/, '');

        return hash ? hash : 'start';
    },

    getPreviousAction: function()
    {
        var actions = ['action-preview', 'action-sign', 'action-finalize', 'action-send'];

        var current_action_index = actions.indexOf(this.state.action);

        if (current_action_index > 0)
        {
            return actions[current_action_index - 1];
        }
        else
        {
            return null;
        }
    },

    run: function() {
        var section_and_state = this.resolveSectionAndState(location.hash);
        console.log("section_and_state:",section_and_state);

        var section = section_and_state[0];
        if(section == "sendsection"){
            this.generateEmailText();
        }
        if (section)
        {
            this.state = section_and_state[1];
            this.setActiveSection(section);

            this.renderStep();
        }
        else
        {
            location.hash = '#intro';
        }
    },
    nl2br (str, is_xhtml) {
        //https://stackoverflow.com/questions/7467840/nl2br-equivalent-in-javascript
        if (typeof str === 'undefined' || str === null) {
            return '';
        }
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    generateEmailText(){
            
        let subj = "Ziadost";
        let textemailu = "";
        let meno = $('#basicinfo-name').val()+" "+$('#basicinfo-lastname').val();
        
        let CRLF = decodeURIComponent("%0D%0A");
        
        let identifikacia_volica_tp_v_sr = 
        "Osobné údaje voliča: "+CRLF+
        "Meno: "+$('#basicinfo-name').val()+", "+CRLF+
        "Priezvisko: "+$('#basicinfo-lastname').val()+", "+CRLF+
        "Rodné číslo: "+$('#basicinfo-birthno').val()+", "+CRLF+
        "Rodné priezvisko: "+$('#basicinfo-maidenlastname').val()+". "+CRLF+CRLF
        ;	
        let identifikacia_volica_tp_odhlaseny = 
        "Osobné údaje voliča: "+CRLF+
        "Meno: "+$('#basicinfo-name').val()+", "+CRLF+
        "Priezvisko: "+$('#basicinfo-lastname').val()+", "+CRLF+
        "Rodné priezvisko: "+$('#basicinfo-maidenlastname').val()+", "+CRLF+
        (
            $("#birthnoCheck").is(':checked') ? 
                'Rodné číslo: ' +$('#basicinfo-birthno').val()+CRLF
            : 
                'Dátum narodenia: '+formatDate($('#basicinfo-birthdate').val()) + ' - nebolo mi pridelené rodné číslo.'+CRLF
        )+
        "Štátna príslušnosť: SR. "+CRLF+CRLF
        ;	
        let adresa_na_slovensku = 
        "Adresa trvalého bydliska v SR: "+CRLF+
        "Ulica: "+$('#addressslovakia-street').val()+", "+CRLF+
        "Číslo domu: "+$('#addressslovakia-streetno').val()+", "+CRLF+
        "Obec: "+getObec()+", "+CRLF+
        "PSČ: "+$('#addressslovakia-zip').val()+". "+CRLF+CRLF
        ;
        
        App.switchStreetAndNumber = false;
        if($("#addressforeign-format").val()==="usa" || $("#addressforeign-format").val()==="usa-poste-restante"){
            App.switchStreetAndNumber = true;
        }

        let adresa_pre_dorucenie = 
        "Adresa pre doručenie: "+CRLF+        
        ( 
            App.poste_res 
            ? 
                "Adresa: POSTE RESTANTE"+CRLF+
                "Adresa pošty: " + $('#addressforeign-streetno').val().toUpperCase()+CRLF
            : 
            (App.switchStreetAndNumber ?
                "Číslo domu: "+$('#addressforeign-streetno').val()+", "+CRLF+
                "Ulica: "+$('#addressforeign-street').val()+", "+CRLF
                :
                "Ulica: "+$('#addressforeign-street').val()+", "+CRLF+
                "Číslo domu: "+$('#addressforeign-streetno').val()+", "+CRLF
            )
        ) +
        "Obec: "+$('#addressforeign-city').val()+", "+CRLF+
        "PSČ: "+$('#addressforeign-zip').val()+", "+CRLF+
        "Štát: "+$('#addressforeign-country').val()+". "+CRLF+CRLF+
        'Pre spoľahlivé doručenie zásielky na moju adresu v zahraničí prosím použite nasledujúci formát adresy: ' + (App.switchStreetAndNumber ? "ČísloDomu Ulica, Obec PSČ, Štát" : "Ulica ČísloDomu, PSČ Obec, Štát") + '.'+CRLF+CRLF
        ;
        
        
        
        let proxy = ""+
        "Splomocnenec:"+CRLF+CRLF+
        "Meno: "+$('#proxy-name').val()+", "+CRLF+
        "Priezvisko: "+$('#proxy-lastname').val()+", "+CRLF+
        "Číslo občianskeho preukazu: "+$('#proxy-idno').val()+". "+CRLF+CRLF
        ;
        let dodatok = CRLF+CRLF+"[Táto žiadosť bola vytvorená pomocou aplikácie https://volby.srdcomdoma.sk Podnety nám môžete posielať na info@srdcomdoma.sk. Ďakujeme]";
        textemailu += "Dobrý deň, "+CRLF+CRLF;
        
        if(App.request_form == 'volbaPostouSTrvalymPobytom'){
            subj = "Žiadosť o voľbu poštou pre voľby do NRSR - "+meno;
            textemailu += "podľa § 60 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+CRLF+CRLF+
                identifikacia_volica_tp_v_sr+
                adresa_na_slovensku+
                "Hlasovacie lístky s návratovou obálkou prosím zašlite na adresu:"+CRLF+CRLF+
                adresa_pre_dorucenie+
                "Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+CRLF+CRLF+
                "   Ďakujem,"+CRLF+CRLF+
                "   "+meno+
                dodatok;
        }else if(App.request_form == 'volbaPostouBezTrvalehoPobytu'){
            $("#emailpotvrdeny").hide();
            subj = "Žiadosť o voľbu poštou pre voľby do NRSR - "+meno;
            textemailu += "podľa § 59 ods. 1 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o voľbu poštou pre voľby do Národnej rady Slovenskej republiky v roku 2020 a o zaslanie hlasovacích lístkov a obálok na adresu uvedenú v žiadosti. "+CRLF+CRLF+
                identifikacia_volica_tp_odhlaseny+
                adresa_pre_dorucenie+
                "Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+CRLF+CRLF+
                "ČESTNÉ VYHLÁSENIE"+CRLF+CRLF+
                "Na účely voľby poštou do Národnej rady Slovenskej republiky v roku 2020"+CRLF+CRLF+
                "čestne vyhlasujem,"+CRLF+CRLF+
                "že nemám trvalý pobyt na území Slovenskej republiky."+CRLF+CRLF+
                "Príloha:"+CRLF+CRLF+
                "- fotokópia časti cestovného dokladu Slovenskej republiky s osobnými údajmi voliča, alebo fotokópia osvedčenia o štátnom občianstve Slovenskej republiky voliča, ktorého dátum vydania nie je starší ako 6 mesiacov)."+CRLF+CRLF+
                "   Ďakujem,"+CRLF+CRLF+
                "   "+meno+
                dodatok;
        }else if(App.request_form == "ziadostOPreukazPostou"){
            subj = "Žiadosť o hlasovací preukaz - "+meno;
            textemailu += "podľa § 46 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o vydanie hlasovacieho preukazu pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+CRLF+CRLF+
                identifikacia_volica_tp_v_sr+
                adresa_na_slovensku+
                "Hlasovací preukaz prosím zašlite na adresu: "+CRLF+CRLF+
                adresa_pre_dorucenie+
                "Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+CRLF+CRLF+
                "   Ďakujem,"+CRLF+CRLF+
                "   "+meno+
                dodatok;
        }else if(App.request_form =="ziadostOPreukaPreSplnomocnenca"){
            subj = "Žiadosť o hlasovací preukaz - "+meno;
            textemailu += "podľa § 46 zákona č. 180/2014 Z. z. o podmienkach výkonu volebného práva a o zmene a doplnení niektorých zákonov žiadam o vydanie hlasovacieho preukazu pre voľby do Národnej rady Slovenskej republiky v roku 2020. "+CRLF+CRLF+
                identifikacia_volica_tp_v_sr+
                adresa_na_slovensku+
                "Pre prevzatie Hlasovacieho preukazu splnomocňujem touto cestou: "+CRLF+CRLF+
                proxy+
                "Zároveň Vás chcem poprosiť o potvrdenie e-mailom, že žiadosť bola prijatá a spracovaná. "+CRLF+CRLF+
                "   Ďakujem,"+CRLF+CRLF+
                "   "+meno+
                dodatok;
        }
        console.log(App.request_form);
        console.log("textemailu",textemailu);
        $("#emailsubject").html(subj);
        $("#send").attr("href", "mailto:" + $("#sendto").html() + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(textemailu));
        $("#emailbody").html(this.nl2br(textemailu));
        console.log("htmltextemailu",this.nl2br(textemailu));
        
    },

    resolveSectionAndState: function(hash)
    {
        hash = hash.replace( /^#/, '');
        var section;

        switch (hash)
        {
            case 'tp-v-zahranici':
            case 'start':
            case 'tp-na-slovensku':
                section = hash;
                break;
            case 'tp-na-slovensku&volba-s-preukazom':
                section = 'preukaz';
                break;
            case 'prehlasenim':
            case 'tp-odhlaseny':
            case 'tp-na-slovensku&volba-postou':
            case 'tp-na-slovensku&volba-s-preukazom&preukaz-do-vlastnych-ruk':
            case 'tp-na-slovensku&volba-s-preukazom&preukaz-preberie-splnomocnenec':
                section = 'ziadost';
                break;
            case 'prehlasenim&action-finalize':
                section = 'pdf-final';
            break;
            case 'tp-na-slovensku&volba-postou&action-send':
            case 'tp-odhlaseny&action-send':
            case 'prehlasenim&action-send':
            case 'tp-na-slovensku&volba-s-preukazom&preukaz-do-vlastnych-ruk&action-send':
            case 'tp-na-slovensku&volba-s-preukazom&preukaz-preberie-splnomocnenec&action-send':
                section = 'sendsection';
            break;
            default:
                console.log("hash not found: ",hash);
                section = 'intro';
        }
        

        var state = this.stateFromHash(hash);

        if (state.action != '')
        {
            if (this.has_form_data)
            {
                switch (state.action)
                {
                    case 'action-preview':
                        section = 'pdf';
                        break;

                    case 'action-sign':
                        section = 'sign';
                        break;

                    case 'action-finalize':
                        section = 'pdf-final';
                        break;

                    case 'action-send':
                        section = 'sendsection';
                        break;
                }
            }
        }

        return [section, state];
    },

    submitForm: function()
    {
        createDocument(true);
        this.has_form_data = true;

        var hash = location.hash.replace( /^#/, '').replace(/&action-.*/, '');
        location.hash = hash + '&action-preview';
    },

    signPdf: function()
    {
        var hash = location.hash.replace( /^#/, '').replace(/&action-.*/, '');
        location.hash = hash + '&action-sign';
    },

    downloadPdf: function()
    {
        var src;

        if (this.active_section == 'pdf')
        {
            src = $('#preview').attr('src');
        }
        else
        {
            src = $('#final').attr('src');
        }

        window.open(src);
    },

    finalizePdf: function()
    {
        if(App.signaturePad.isEmpty()){
          if(App.request_form === "volbaPrehlasenimBezTrvalehoPobytu" || confirm ("Ste si istý, že chcete vytvoriť žiadosť aj bez podpisu?")){
            createDocument(false);
            $('#pdf-final').show();
            var hash = location.hash.replace( /^#/, '').replace(/&action-.*/, '');
            location.hash = hash + '&action-finalize';
          }
        } else
        {
            $('#signature').val(App.signaturePad.toDataURL());
            createDocument(false);
            $('#pdf-final').show();
            var hash = location.hash.replace( /^#/, '').replace(/&action-.*/, '');
            location.hash = hash + '&action-finalize';
        }
    },

    showFinalInfo: function()
    {
        console.log("showFinalInfo");
        var hash = location.hash.replace( /^#/, '').replace(/&action-.*/, '');
        location.hash = hash + '&action-send';
		fbq('track', 'CompleteRegistration');
    },

    initForm: function() {

        if (this.state.tp == 'tp-odhlaseny')
        {
            nemamTP();
        }
        
        if (this.state.prehlasenim == 'prehlasenim')
        {
            volbaSPrehlasenim(); // pre osoby s trvalym pobytom v zahranici ktore budu v case volieb na slovensku
        }

        if (this.state.volba == 'volba-postou')
        {
            postaTP();
        }

        if (this.state.preukaz == 'preukaz-do-vlastnych-ruk')
        {
            preukazTP();
        }

        if (this.state.preukaz == 'preukaz-preberie-splnomocnenec')
        {
            preukazPS();
        }
        console.log("state",this.state);
    },

    stateFromHash: function(hash)
    {
        var state = {
            tp: -1,
            volba: -1,
            preukaz: -1,
            prehlasenim: -1,
            action: ''
        };

        var parts = hash.split('&');

        $.each(parts, function(i, part) {
            $.each(['tp', 'volba', 'preukaz', 'prehlasenim', 'action'], function(i, prefix) {
                if (part.indexOf(prefix) == 0)
                {
                    state[prefix] = part;
                }
            })
        });
        
        return state;
    },

    setActiveSection: function(section)
    {
        this.active_section = section;

        var that = this;
		$('.help').hide();
        $('.section').hide();
        console.log("setActiveSection",section);
        
        $.when($('#' + this.active_section).show()).done(function(){
            resizeCanvas();
            let step = that.getStep(that.active_section);
            if(App.Analytics && step){
                App.Analytics.trackStep(location.hash.replace( /^#/, ''), step);
            }
            $('html, body').animate({ scrollTop: 0 }, 'slow');

            if (that.active_section == 'ziadost')
            {
                that.initForm();
            }
        });
        
        
    }
};