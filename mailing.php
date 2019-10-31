<?php

require_once("../settings.php");

use AsyncWeb\DB\DB;

$uri = strstr($_SERVER["REQUEST_URI"],"?",true);
if(!$uri) $uri = $_SERVER["REQUEST_URI"];

if($_REQUEST["dakujeme"]){
?><html lang="sk">
  <head>
    <meta charset="utf-8">
    <title>Voľby 2020 - registrujte sa pre odber noviniek</title>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

	<!-- Latest compiled and minified CSS -->
	<link href="assets/css/select2.min.css" rel="stylesheet" />
	<link href="css/site.css" rel="stylesheet" />
	<link href="css/custom.css" rel="stylesheet" />

    <!-- Global site tag (gtag.js) - Google Analytics for VOLBY.SRDCOMDOMA.SK-->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-113904149-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-113904149-2');
    </script>

  </head>
  <body>
  
    <nav class="navbar navbar-volby navbar-fixed-top">
    	<div class="container">
    		<div class="navbar-header">
                <a class="navbar-brand" href="https://www.srdcomdoma.sk"><img id="logo" title="volby.srdcomdoma.sk" src="https://srdcomdoma.sk/images/Srdcomdoma_logo_horizontal_RGB_no_margin.jpg" ></a>                
    		</div>
    	</div>
    </nav>

    <div class="steps">
      <div class="container">
          <div>
            <div class="container">
              <div class="row">
                <h1>Voľby do NR SR 2020</h1>
                <p>Váš email bol úspešne zaregistrovaný k odberu noviniek k voľbám. Ihneď, ako bude vyhlásený oficiálny termín volieb, <b>Vás budeme informovať</b>. Na stránkach volby.srdcomdoma.sk si budete môcť jednoducho <b>vytvoriť žiadosť o voľbu poštou zo zahraničia, aj o hlasovací preukaz</b>.</p>
                <p>Moderné krajiny umožňujú svojim občanom voliť vo všetkých voľbách odkiaľkoľvek. Občania SR môžu voliť jedine vo voľbách do NR SR zo zahraničia. Prosím, <b>podpíšte online petíciu</b> <a href="https://www.srdcomdoma.sk/formular-peticia-srdcom-doma/">Srdcom doma</a> za možnosť voliť vo všetkých voľbách zo zahraničia. <b>Voľme</b> do Európskeho parlamentu, v prezidentských voľbách, či voľbách do orgánov samosprávnych krajov a obcí - <b>odkiaľkoľvek</b> - napríklad tak, ako je to dnes možné vo voľbách do NR SR - <b>poštou</b>.</p> 
                <p><a href="https://www.srdcomdoma.sk/formular-peticia-srdcom-doma/">www.SrdcomDoma.sk</a></p>           
              </div>
            </div>
          </div>
      </div>
    </div>
  </body>
</html>
<?php
return;
}

if($email = $_REQUEST["email"]){
    DB::u("mailing",md5($email),["email"=>$email]);
    header("Location: https://".$_SERVER["HTTP_HOST"].$uri."?dakujeme=1");
    return;
}   
?><html lang="sk">
  <head>
    <meta charset="utf-8">
    <title>Voľby 2020 - registrujte sa pre odber noviniek</title>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

	<!-- Latest compiled and minified CSS -->
	<link href="assets/css/select2.min.css" rel="stylesheet" />
	<link href="css/site.css" rel="stylesheet" />
	<link href="css/custom.css" rel="stylesheet" />

    <!-- Global site tag (gtag.js) - Google Analytics for VOLBY.SRDCOMDOMA.SK-->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-113904149-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-113904149-2');
    </script>

  </head>
  <body>

    <nav class="navbar navbar-volby navbar-fixed-top">
    	<div class="container">
    		<div class="navbar-header">
                <a class="navbar-brand" href="https://www.srdcomdoma.sk"><img id="logo" title="volby.srdcomdoma.sk" src="https://srdcomdoma.sk/images/Srdcomdoma_logo_horizontal_RGB_no_margin.jpg" ></a>                
    		</div>
    	</div>
    </nav>

    <div class="steps">
        <div class="container">
            <div>
              <div class="container">
                  <div class="row">
                  <h1>Voľby do NR SR 2020 - nepremeškajte lehoty!</h1> 
                  <p>Nechajte si poslať upozornenia o voľbách do NR SR.</p>
              </div>
            <form method="post">
                  <div class="row">
                    <div class="form-group">
                      <label for="exampleInputEmail1">Zadajte Váš email:</label>
                      <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="@">
                      <small id="emailHelp" class="form-text text-muted">Odoslaním e-mail adresy súhlasíte, aby Vám <a href="https://www.srdcomdoma.sk" target="_blank">Srdcom doma o.z.</a> zaslal upozornenia týkajúce sa volieb. Súhlas môžete kedykoľvek odvolať. Email neposkytneme žiadnemu inému subjektu. </small>                
                    </div>
                  </div>
                  <div>
                    <button type="submit" class="btn btn-primary">Zaregistrovať email</button>
                  </div>
              </form>
            </div>
            </div>
        </div>
    </div>
  </body>
</html>