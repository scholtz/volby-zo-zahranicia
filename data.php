<?php

if($_REQUEST["save"]){
    
    $fields = [];
    for($i = 0;$i<= 13;$i++){
        $fields[$i] = $_REQUEST[$i];
    }
    $fields[14] = time();
    $fields[15] = $_REQUEST["u"];
    $fields[16] = $_SERVER["REMOTE_ADDR"];
    $fields[17] = $_REQUEST["obec"];
    $fields[18] = $_REQUEST["okres"];
    $fields[19] = $_REQUEST["kraj"];
   

    $fp = fopen('corrections2.csv', 'a+');
    fputcsv($fp, $fields);
    fclose($fp);
    header("Location: https://volby.srdcomdoma.sk/data.php?u=".$_REQUEST["u"]."&kraj=".$_REQUEST["kraj"]."&okres=".$_REQUEST["okres"]."&obec=".$_REQUEST["obec"]."&msg=Obec ".$_REQUEST["10"]." bola upravená" );
    exit;
}


$cities = file_get_contents("js/cities.js");
$parts = explode("// data",$cities);
$json = trim($parts[1]);
$json = trim(str_replace('election.cities=','',$json));
$json = trim(str_replace('}}};','}}}',$json));
$json = str_replace("'",'"',$json);
$json = trim($json,';');
//var_dump($json);
try{
    $db = json_decode($json,true,10000);
}catch(\Exception $exc){
    var_dump($exc->getMessage());
}
if(!count($db)){
    exit;
}


if (($handle = fopen("corrections2.csv", "r")) !== FALSE) {
	$i = 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {$i++;
        if(isset($data[19])){
            $db[$data[19]][$data[18]][$data[17]] = $data;
        }
	}
}


?><!DOCTYPE html>
<html lang="sk">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<title>Potvrdenie emailu</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<script src="//code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
		<style>
			body{margin:1em;}
		</style>
	</head>
	<body>
	<div class="container">
		<div class="panel panel-primary">
			<div class="panel-heading">
				<h1>Aplikácia pre potvrdenie správnosti údajov obce</h1>
			</div>
            
			<div class="panel-body">
            
            <?php
            if(!$_REQUEST["u"]){
                ?>
            <form method="get" action="/data.php">
                <div class="col-md-12">
                    <div class="input-group">
                      <input type="text" class="form-control" placeholder="Zadajte Vaše meno" name="u" >
                      <span class="input-group-btn">
                        <input type="submit" class="btn btn-default" value="Pokračovať">
                      </span>
                    </div>
                </div>
            </form>
            
                <?php
            }?>
            <?php
            if($_REQUEST["u"]){
                ?>
            
            <form method="get" action="/data.php">
                <input type="hidden" name="u" value="<?php echo htmlspecialchars($_REQUEST["u"]);?>">
                <input type="hidden" name="typ" value="<?php echo htmlspecialchars($_REQUEST["typ"]);?>">
                
                <div class="col-md-4">
                    <div class="input-group">

                    <select name="kraj" class="form-control"><?php
                    foreach(array_keys($db) as $kraj){
                        echo '<option value="'.$kraj.'" '.($_REQUEST["kraj"] == $kraj?" selected" : "").'>'.$kraj.'</option>';
                    }
                    ?>
                    </select>
                      <span class="input-group-btn">
                        <input type="submit" class="btn <?php echo ($_REQUEST["kraj"]?"btn-default":"btn-primary");?>" value="Vyber">
                      </span>
                    </div>
                </div>
            </form>
            
                <?php
            }?>
            <?php
            if($_REQUEST["kraj"]){
                ?>
                
            <form method="get" action="/data.php">
                <input type="hidden" name="kraj" value="<?php echo htmlspecialchars($_REQUEST["kraj"]);?>">
                <input type="hidden" name="u" value="<?php echo htmlspecialchars($_REQUEST["u"]);?>">
                <input type="hidden" name="typ" value="<?php echo htmlspecialchars($_REQUEST["typ"]);?>">
                <div class="col-md-4">
                    <div class="input-group">
                      
                    <select name="okres" class="form-control"><?php
                    foreach(array_keys($db[$_REQUEST["kraj"]]) as $okres){
                        echo '<option value="'.$okres.'" '.($_REQUEST["okres"] == $okres?" selected" : "").'>'.$okres.'</option>';
                    }
                    ?>
                    </select>
                      <span class="input-group-btn">
                        <input type="submit" class="btn <?php echo ($_REQUEST["okres"]?"btn-default":"btn-primary");?>" value="Vyber">
                      </span>
                    </div>
                </div>
            </form>
                
                <?php
            }?>
            
            
            <?php
            if($_REQUEST["okres"]){
                ?>
                
            <form method="get" action="/data.php">
                <input type="hidden" name="kraj" value="<?php echo htmlspecialchars($_REQUEST["kraj"]);?>">
                <input type="hidden" name="okres" value="<?php echo htmlspecialchars($_REQUEST["okres"]);?>">
                <input type="hidden" name="u" value="<?php echo htmlspecialchars($_REQUEST["u"]);?>">
                <input type="hidden" name="typ" value="<?php echo htmlspecialchars($_REQUEST["typ"]);?>">
                <div class="col-md-4">
                    <div class="input-group">
                      
                    <select name="obec" class="form-control"><?php
                    foreach($db[$_REQUEST["kraj"]][$_REQUEST["okres"]] as $obec=>$obecdata){
                        if($_REQUEST["typ"]){
                            if($_REQUEST["typ"] == "mesto"){
                                if($obecdata[0] != "Mestský úrad") continue;
                            }
                        }
                        echo '<option value="'.$obec.'" '.($_REQUEST["obec"] == $obec?" selected" : "").'>'.$obecdata[10]." - ";
                        switch($obecdata[11]){
                            case "0": 
                                echo "Neoverené";
                            break;
                            case "1": 
                                echo "Overené obcou";
                            break;
                            case "2": 
                                echo "Obec zatiaľ nezverejnila info";
                            break;
                            case "3": 
                                echo "Overené dobrovoľníkom";
                            break;
                            default:
                             echo "Neznáma hodnota v stave overenia";
                        }
                        
                        echo '</option>';
                    }
                    ?>
                    </select>
                      <span class="input-group-btn">
                        <input type="submit" class="btn <?php echo ($_REQUEST["obec"]?"btn-default":"btn-primary");?>" value="Vyber">
                      </span>
                    </div>
                </div>
            </form>
                
                <?php
            }?>
            
            
            
            <?php
            if($_REQUEST["obec"]){
                $data = $db[$_REQUEST["kraj"]][$_REQUEST["okres"]][$_REQUEST["obec"]];
                if(!$data[12]) $data[12] = $data[6];
                ?>
            <div class="col-md-9 col-md-offset-3">
                <h2><?php echo $data[10];?></h2>
                <?php
                if(isset($data[15])){
                    echo '<p>Naposledy upravil: <b>'.$data[15].'</b> o '.date("d.m.Y H:i:s",$data[14]).'</p>';
                }
                if($_REQUEST["msg"]){
                    ?>
                    <div class="alert alert-success"><?php echo htmlspecialchars($_REQUEST["msg"]);?></div>
                    <?
                }
                ?>
            </div>
            <form method="post" action="/data.php">
                <input type="hidden" name="kraj" value="<?php echo htmlspecialchars($_REQUEST["kraj"]);?>">
                <input type="hidden" name="okres" value="<?php echo htmlspecialchars($_REQUEST["okres"]);?>">
                <input type="hidden" name="obec" value="<?php echo htmlspecialchars($_REQUEST["obec"]);?>">
                <input type="hidden" name="typ" value="<?php echo htmlspecialchars($_REQUEST["typ"]);?>">
                <input type="hidden" name="u" value="<?php echo htmlspecialchars($_REQUEST["u"]);?>">
                <input type="hidden" name="10" value="<?php echo htmlspecialchars($data["10"]);?>">
                <input type="hidden" name="save" value="1">
                <div class="">
                    <label for="volba-postou" class="col-md-3">Email pre voľbu poštou</label>
                    <div class="col-md-9">
                        <input id="volba-postou" name="6" class="form-control" value="<?php echo htmlspecialchars($data[6]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="volba-preukazom" class="col-md-3">Email pre voľbu hl. preukazom</label>
                    <div class="col-md-9">
                        <input id="volba-preukazom" name="12" class="form-control" value="<?php echo htmlspecialchars($data[12]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="potvrdenie" class="col-md-3">Potvrdenie od úradu</label>
                    <div class="col-md-9">
                        <select  id="potvrdenie" name="11" class="form-control" >
                            <option value="0" <?php if($data[11] == "0") echo " selected";?>>Nepotvrdené</option>
                            <option value="1" <?php if($data[11] == "1") echo " selected";?>>Potvrdené obcou</option>
                            <option value="2" <?php if($data[11] == "2") echo " selected";?>>Obec zatiaľ nezverejnila info</option>
                            <option value="3" <?php if($data[11] == "3") echo " selected";?>>Potvrdzujem správnosť údajov</option>
                        </select>
                    </div>
                </div>
                <div class="">
                    <label for="tel" class="col-md-3">Tel. predvoľba</label>
                    <div class="col-md-9">
                        <input id="tel" name="7" class="form-control" value="<?php echo htmlspecialchars($data[7]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="tel" class="col-md-3">Telefón</label>
                    <div class="col-md-9">
                        <input id="tel" name="8" class="form-control" value="<?php echo htmlspecialchars($data[8]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="mobil" class="col-md-3">Mobil</label>
                    <div class="col-md-9">
                        <input id="mobil" name="9" class="form-control" value="<?php echo htmlspecialchars($data[9]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="typ" class="col-md-3">Typ úradu</label>
                    <div class="col-md-9">
                        <input id="typ" name="0" class="form-control" value="<?php echo htmlspecialchars($data[0]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="typ2" class="col-md-3">Typ úradu riadok 2</label>
                    <div class="col-md-9">
                        <input id="typ2" name="1" class="form-control" value="<?php echo htmlspecialchars($data[1]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="adr" class="col-md-3">Adresa úradu ulica</label>
                    <div class="col-md-9">
                        <input id="adr" name="2" class="form-control" value="<?php echo htmlspecialchars($data[2]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="dom" class="col-md-3">Adresa úradu č. domu</label>
                    <div class="col-md-9">
                        <input id="dom" name="3" class="form-control" value="<?php echo htmlspecialchars($data[3]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="psc" class="col-md-3">PSČ</label>
                    <div class="col-md-9">
                        <input id="psc" name="4" class="form-control" value="<?php echo htmlspecialchars($data[4]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="mesto" class="col-md-3">Adresa - mesto</label>
                    <div class="col-md-9">
                        <input id="mesto" name="5" class="form-control" value="<?php echo htmlspecialchars($data[5]);?>"> 
                    </div>
                </div>
                <div class="">
                    <label for="web" class="col-md-3">Web</label>
                    <div class="col-md-9">
                        <input id="web" name="13" class="form-control" value="<?php echo htmlspecialchars($data[13]);?>"> 
                    </div>
                </div>
                <div class="">
                    <div class="col-md-9 col-md-offset-3">
                        <br>
                        <input type="submit" value="Upraviť" class="btn btn-primary"> 
                    </div>
                </div>
                
            </form>
                
                <?php
            }?>
            
			</div>
		</div>
	</div>
	</body>
</html>
