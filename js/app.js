var App = window.election;


function clearForm() {
  $('.preukaz-ps').hide();
  $('.posta-tp').hide();
  $('.preukaz-tp').hide();
  $('.nemam-tp').hide();
  $('.tp-v-zahranici').hide();
  $('.tp-v-zahranici').hide();
  $('.prehlasenim').hide();

}

function volbaSPrehlasenim(){
  clearForm();
  $('.prehlasenim').show();
  App.request_form = 'volbaPrehlasenimBezTrvalehoPobytu';

}

function nemamTP() {
  // update back button
  clearForm();
  $('.nemam-tp').show();

  App.request_form = 'volbaPostouBezTrvalehoPobytu';
  $("#adresa").val("Ministerstvo vnútra Slovenskej republiky\nodbor volieb, referenda a politických strán\nDrieňová 22\n826 86  Bratislava 29\nSLOVAK REPUBLIC");

}

function postaTP() {
  clearForm();
  $('.posta-tp').show();
  $('#photo-link').hide();
  App.request_form = 'volbaPostouSTrvalymPobytom';
}

function preukazTP() {
  clearForm();
  $('.preukaz-tp').show();
  $('#photo-link').hide();
  App.request_form = 'ziadostOPreukazPostou';
}

function preukazPS() {
  clearForm();
  $('.preukaz-ps').show();
  $('#photo-link').hide();
  App.request_form = 'ziadostOPreukaPreSplnomocnenca';
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.');
}




canvas = document.querySelector("canvas");
// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;

function makeSecondStep6ButtonPrimary(){
	  $('#step6but1').addClass("btn-volby-gray").removeClass("btn-volby-blue");
	  $('#step6but2').addClass("btn-volby-blue").removeClass("btn-volby-gray");
}

function getPeriod(){
    let remainingTime = (new Date(elections_by_post_end_iso)).getTime() - Date.now();
    if (remainingTime > 0) {
        return 1;
    }
    remainingTime = (new Date(elections_by_votingpass_end_iso)).getTime() - Date.now();
    if (remainingTime > 0) {
        return 2;
    }
    remainingTime = (new Date(elections_start_iso)).getTime() - Date.now();
    if (remainingTime > 0) {
        return 3;
    }
    remainingTime = (new Date(elections_end_iso)).getTime() - Date.now();
    if (remainingTime > 0) {
        return 4;
    }
    return 5;
}

$(document).ready(function ()
{
  resizeCanvas();

  App.signaturePad = new SignaturePad(canvas);

  $(".elections_year").html(elections_year);
  $(".elections_start_formatted").html(elections_start_formatted);
  $(".elections_by_post_end_formatted").html(elections_by_post_end_formatted);
  $(".elections_by_votingpass_end_formatted").html(elections_by_votingpass_end_formatted);
  $(".elections_by_votingpass_take_end_formatted").html(elections_by_votingpass_take_end_formatted);
  $("#logo").attr("src",logo_link);


  let period = getPeriod();
  for(let i = 1;i <= 5;i++){
      $(".show_period_"+i).hide();
      if(i === period){
        console.log(".hide_period_"+i+" : hide");
        $(".show_period_"+i).show();
        $(".hide_period_"+i).hide();
      }else{
      }
  }

  $("#birthnoCheck").change(function() {
      if(this.checked) {
          $("#rcGroup").removeClass("hidden");
          $("#bdGroup").addClass("hidden");
          
      }else{
          $("#rcGroup").addClass("hidden");
          $("#bdGroup").removeClass("hidden");
      }
  });

  $('#clear-button').on("click", function (event)
  {
    App.signaturePad.clear();
  });

  $('#step6but1').on("click", function(event){
	  makeSecondStep6ButtonPrimary();
  });
  
  $('#id-button').on("click", function (event)
  {
    createDocument(true);
  });

  $('#camera-input').change(function ()
  {
    var reader = new FileReader();
    reader.onloadend = function ()
    {
      $('#camera-preview').attr('src', reader.result)
    }
    reader.readAsDataURL($('#camera-input')[0].files[0]);
  });

  if (detectIE())
  {
    $(".internetexplorer").removeClass("hidden").show();
    $("#alertie").show();
    $(".body-content .section").css("padding", "100px 0 0 0");
    $("#intro").css("padding", "100px 0 0 0");
    $("#final").hide();
    $("#preview").hide();
	
	$("#download-preview-btn").hide();
	$("#download-final-btn").hide();
	makeSecondStep6ButtonPrimary();
  }
  if(isAndroid()){
    $(".android").removeClass("hidden").show();
    $(".hiddenOnMobile").hide();
    $(".hiddenOnAndroid").hide();
    $("#final").hide();
    $("#preview").hide();
    $("#download-final-btn").hide();
	$("#download-preview-btn").hide();
	makeSecondStep6ButtonPrimary();
  }
  iosver =iOSversion();
  if(iosver){
	$("#download-final-ios-text").show();
    $(".ios").removeClass("hidden").show();
    
    $(".hiddenOnMobile").hide();
    $(".hiddenOnIOS").hide();
	if(iosver >= 8){
		$(".ios8plus").show().removeClass("hidden");
		//$("#download-final-btn").hide();
		//makeSecondStep6ButtonPrimary();
	}
  }
  if(isAndroid() || iosver > 1){
    $(".mobile").removeClass("hidden").show();
  }else{
    $(".pc").removeClass("hidden").show();
  }

   
  $("#showhelp").on("click",function(){
	  $(".help").show();	
	  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  });
  $(".help").hide();
  
  $("#copyadress").on("click",function(){
	  if ($('#addressslovakia-street').val()) $('#addressforeign-street').val($('#addressslovakia-street').val());
	  if ($('#addressslovakia-streetno').val()) $('#addressforeign-streetno').val($('#addressslovakia-streetno').val());
	  if ($('#addressslovakia-city').val()) $('#addressforeign-city').val($('#select2-addressslovakia-city-container').html());
	  if ($('#addressslovakia-zip').val()) $('#addressforeign-zip').val($('#addressslovakia-zip').val());
	  $("html, body").animate({ scrollTop: $(document).height() }, 100);
  });
  
  var clipboard = new Clipboard('.copy-btn');
  clipboard.on('success', function(e) {
     e.clearSelection();
  });
  
  $("#basicinfo-birthno").on("change",function(){
	  fixBirthNumberSlash();
  });;
  
});

