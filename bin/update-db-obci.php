<?php

$_SERVER["HTTP_HOST"] = "volby.srdcomdoma.sk";
require_once("/cron2/settings.php");
use AsyncWeb\Text\Texts;
use AsyncWeb\Text\Validate;

$setToUnverified = false;
$updateFromSlovenskoSk = false;

$from ="js/cities.js";
//$from = "js/cities.js.orig";
$setToUnverified = false;
$updateFromSlovenskoSk = false;


$cities = file_get_contents($from);
$parts = explode("// data",$cities);
$json = trim($parts[1]);
$json = trim(str_replace('election.cities=','',$json));
$json = trim(str_replace('}}};','}}}',$json));
$json = str_replace("'",'"',$json);
$json = trim($json,';');
//var_dump($json);
try{
    $db = json_decode($json,true,10000);
    if($setToUnverified){
        foreach($db as $kraj=>$arr1){
            foreach($arr1 as $okres=>$arr2){
                foreach($arr2 as $obec => $obecdata){
                    
                    $db[$kraj][$okres][$obec][11] = '0';
                }
            }
        }
    }
}catch(\Exception $exc){
    var_dump($exc->getMessage());
}
if(!count($db)){
    exit;
}

$overenePostou = [];
$overenePreukaz = [];

$email2obec = [];

if (($handle = fopen("emaily.txt", "r")) !== FALSE) {
	$i = 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {$i++;
        if(isset($data[2])){
            
        }else{
            $okres = false;
            if($pos = strpos($data[1],"(Okres")){
                $obec = Texts::clear(substr($data[1],0,$pos));
                $okres = substr($data[1],$pos+1);
                $okres = trim($okres);
                $okres = trim($okres,')');
                
            }else{
                $obec = Texts::clear($data[1]);
            }
            if($okres){
                $email2obec[$data[0]]=["obec"=>$obec,"okres"=>$okres];
            }else{
                $email2obec[$data[0]]=["obec"=>$obec];
            }
        }
	}
}

function kraj2krajname($kraj){
    switch($kraj){
        case "Žilina":
            return "Žilinský kraj";
        case "Prešov":
            return "Prešovský kraj";
        case "Bratislava":
            return "Bratislavský kraj";
        case "Košice":
            return "Košický kraj";
        case "Nitra":
            return "Nitriansky kraj";
        case "Trenčín":
            return "Trenčiansky kraj";
        case "Trnava":
            return "Trnavský kraj";
        case "Žilina":
            return "Žilinský kraj";
        case "Banská Bystrica":
            return "Banskobystrický kraj";
    }
    return $kraj;
}

function okres2okresname($okres){
    if($okres == "Okres Košice - Okolie") return "Okres Košice okolie";
    if($okres == "Košice - Okolie") return "Okres Košice okolie";
    if(substr($okres,0,5) == "Okres"){
        return $okres;
    }
    return "Okres ".$okres;
}

if (($handle = fopen("emaily.csv", "r")) !== FALSE) {
	$i = 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {$i++;
        if(isset($data[2])){
            $kraj = kraj2krajname($data[3]);
            $okres = okres2okresname($data[2]);
            $obec = Texts::clear($data[1]);
            $email2obec[$data[0]]= $E2O = ["obec"=>$obec,"okres"=>$okres,"kraj"=>$kraj];
            if($updateFromSlovenskoSk){
                if(isset($db[$kraj][$okres][$obec])){
                    if($db[$kraj][$okres][$obec][6] != $data[0]){
                        echo "\napravujem $obec .. nastavujem tam predvolene: ".$data[0]." .. bolo tam: ".$db[$kraj][$okres][$obec][6];
                        $db[$kraj][$okres][$obec][6] = $data[0];
                        $db[$kraj][$okres][$obec][12] = "";
                    }
                }else if(isset($db[$kraj][$okres][$obec = "1".$obec])){
                    if($db[$kraj][$okres][$obec][6] != $data[0]){
                        echo "\napravujem $obec .. nastavujem tam predvolene: ".$data[0]." .. bolo tam: ".$db[$kraj][$okres][$obec][6];
                        $db[$kraj][$okres][$obec][6] = $data[0];
                        $db[$kraj][$okres][$obec][12] = "";
                    }
                }
            }
            
        }else{
            $okres = false;
            if($pos = strpos($data[1],"(Okres")){
                $obec = Texts::clear(substr($data[1],0,$pos));
                $okres = substr($data[1],$pos+1);
                $okres = trim($okres);
                $okres = trim($okres,')');
                
            }else{
                $obec = Texts::clear($data[1]);
            }
            if($okres){
                $email2obec[$data[0]]=["obec"=>$obec,"okres"=>$okres];
            }else{
                $email2obec[$data[0]]=["obec"=>$obec];
            }
        }
	}
}

echo "\nnastavujem udaje podla corrections 2\n";
$corrections2 = [];
if (($handle = fopen("corrections2.csv", "r")) !== FALSE) {
	$i = 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {$i++;
        if(isset($data[19])){
            $obec = $data[17];
            $okres = $data[18];
            $kraj = $data[19];
            $corrections2[$kraj][$okres][$obec] = $data;

            if(isset($db[$kraj][$okres][$obec])){
//                if(!$db[$kraj][$okres][$obec]["11"]){ // if not confirmed
                    for($i = 0;$i<=12;$i++) {
                        
                        if($i == 6 || $i == 12){
                            
                            $emails = str_replace(",",";",$data[$i]);
                            $emails = str_replace(" ",";",$emails);
                            $emails = explode(";",$emails);
                            
                            foreach($emails as $key=>$v){
                                $emails[$key] = $em = trim($v);
                                if(!$em){unset($emails[$key]);continue;}
                                if(!Validate::check("email",$em)){
                                    echo "!!! EMAIL v CORRECTIONS2 NIE JE VALIDNY! ".$em."\n";
                                    unset($emails[$key]);
                                }
                            }
                            
                            $newemails = implode(";",$emails);
                            
                            if($i == 12){
                                if($newemails == $db[$kraj][$okres][$obec][6]){
                                   $newemails = "";// do not fill this info if the same value applies for col 6 
                                }
                            }
                            
                            //var_dump($newemails);
                            if($db[$kraj][$okres][$obec][$i] != $newemails){
                                echo "corrections2: $obec $okres $kraj : $newemails z ".$db[$kraj][$okres][$obec][$i]."\n";
                                $db[$kraj][$okres][$obec][$i] = $newemails;
                            }
                            
                            
                            
                        }else{
                            $db[$kraj][$okres][$obec][$i] = $data[$i];
                            
                        }
                    }
//                }
            }else{
                echo "\nnenasiel som $kraj $okres $obec\n";exit;
            }
        }
	}
}

// corrections data type:
// [0] user ktory robi request
// [1] emailposta
// [2] cas
// [3] REMOTE_ADDR
// [4] emailpreukaz
echo "\nkontrolujem corrections 1\n";

if (($handle = fopen("corrections.csv", "r")) !== FALSE) {
	$i = 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {$i++;
		if($data[0]){
            
            $E2O = $email2obec[$data[0]];  
            if(!isset($E2O["kraj"])){
                
                $found = false;
                // skus najst konfliktujucu obec .. obec s rovnakym nazvom
                foreach($db as $kraj=>$arr1){
                    foreach($arr1 as $okres=>$arr2){
                        foreach($arr2 as $obec => $obecdata){
                            if($obec == $E2O["obec"] || $obec == "1".$E2O["obec"]){
                                if(isset($E2O["okres"]) && $E2O["okres"] != $okres){
                                    //var_dump($E2O["okres"]." != $okres");
                                    continue;
                                }
                                
                                if($found){
                                    echo "nasiel som 2 zaznamy obci.. potrebujem manualnu akciu..\n";
                                    var_dump($data);
                                    var_dump($E2O);   
                                    exit;
                                }
                                $found = true;
                                $E2O["obec"] = $obec;
                                $E2O["okres"] = $okres;
                                $E2O["kraj"] = $kraj;
                            }
                        }
                    }
                }
            }
            $E2O["kraj"] = kraj2krajname($E2O["kraj"]);
            $E2O["okres"] = okres2okresname($E2O["okres"]);
            if(!isset($E2O["obec"]) || !isset($E2O["okres"]) || !isset($E2O["kraj"])){
                echo "\nnenasiel som udaje pre naparovanie na okres/kraj\n";
                var_dump($data);
                var_dump($E2O);   
                exit;
            }
            if(isset($db[$E2O["kraj"]][$E2O["okres"]][$E2O["obec"]])){
                $arr = $db[$k = $E2O["kraj"]][$o = $E2O["okres"]][$c = $E2O["obec"]];
            }elseif(isset($db[$E2O["kraj"]][$E2O["okres"]]["1".$E2O["obec"]])){
                $arr = $db[$k = $E2O["kraj"]][$o = $E2O["okres"]][$c = "1".$E2O["obec"]];
            }else{
                echo "nenasiel som kraj/okres/obec pre ";
                var_dump($E2O);          
                var_dump($data);
                var_dump(array_keys($db[$k = $E2O["kraj"]]));
                exit;
            }
            
            
            
            
            
            if(isset($corrections2[$k][$o][$c])){
                if($corrections2[$k][$o][$c][14] > strtotime($data[2])){ 
                    //ak je cas manualnej upravy vyssi ako cas nahlasenia obecnym uradom, zober nahlaseny udaj
                    // manualne upravene udaje boli zakomponovane vyssie
                    continue;
                }
            }
            
            $data[1] = str_replace(",",";",$data[1]);
            $data[1] = str_replace(" ",";",$data[1]);
			$emails = explode(";",$data[1]);
			foreach($emails as $key=>$v){
				$emails[$key] = $em = trim($v);
				if(!$em){unset($emails[$key]);continue;}
				if(!Validate::check("email",$em)){
					echo "!!! OVERENY EMAIL NIE JE VALIDNY! ".$em."\n";
					unset($emails[$key]);
				}
                
            
			}
            
            $newemails = implode(";",$emails);
            if(!isset($db[$k][$o][$c][6])){
                echo "obec ma chybny pocet datovych stlpcov: $c, $o, $k\n";
                var_dump($db[$k][$o][$c]);
                exit;
            }
			if($db[$k][$o][$c][6] != $newemails){
                echo "update pre email volby postou $c: $newemails .. stara hodnota: ".$db[$k][$o][$c][6]."\n";
                $db[$k][$o][$c][6] = $newemails;
			}
            
            $db[$k][$o][$c][11] = '1';			
			if(isset($data[4]) && $data[4]){
                $data[4] = str_replace(",",";",$data[4]);
                $data[4] = str_replace(" ",";",$data[4]);
				$emails = explode(";",$data[4]);
				foreach($emails as $key=>$v){
					$emails[$key] = $em = trim($v);
					if(!$em){unset($emails[$key]);continue;}
					if(!Validate::check("email",$em)){
						echo "!!! OVERENY EMAIL NIE JE VALIDNY! ".$em."\n";
						unset($emails[$key]);
					}
				}
                $newemails = implode(";",$emails);
                if($db[$k][$o][$c][12] != $newemails){
                    if(!$newemails && $db[$k][$o][$c][6] != $db[$k][$o][$c][12]){
                        echo "update pre hl. listky $c: $newemails .. stara hodnota: ".$db[$k][$o][$c][12]."\n";
                        $db[$k][$o][$c][12] = $newemails;
                    }
                }
			}
		}else{
			$tocheck[$data[1]] = $data[1];
			//echo "Potvrdeny email nema overovatela: ".$data[1]."\n";
		}
	}
}

$div = '// data';




$psc = [];

foreach($db as $kraj=>$arr1){
    foreach($arr1 as $okres=>$arr2){
        foreach($arr2 as $obec=>$D){
            $thispsc= str_replace(" ","",$D[4]);
            
            if(strlen($thispsc) == 5){
                @$psc[$thispsc]++;
            }else{
                $thispsc= str_replace(" ","",$D[3]);
                if(strlen($thispsc) == 5){
                    $db[$kraj][$okres][$obec][5] = $db[$kraj][$okres][$obec][4];
                    $db[$kraj][$okres][$obec][4] = $db[$kraj][$okres][$obec][3];
                    $db[$kraj][$okres][$obec][3] = $db[$kraj][$okres][$obec][2];
                    $db[$kraj][$okres][$obec][2] = $db[$kraj][$okres][$obec][1];
                    $db[$kraj][$okres][$obec][1] = "";
                    @$psc[$thispsc]++;
                }else{
                    
                    var_dump($thispsc);
                    var_dump($D);exit;

                }
            }
        }
    }
}
$pscout = "{";
ksort($psc);
$i = 0;
foreach($psc as $p=>$v){$i++;
    if($i > 1)$pscout.=",\n";
    $pscout .="'$p':$v";
}
$pscout .= "}";
echo "\npscs.json: " .file_put_contents("pscs.json",$pscout)."\n";


$out = $parts[0].$div."\n".'election.cities='.str_replace("    "," ",json_encode($db,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)).';'."\n$div".$parts[2];
file_put_contents("js/newcities.js",$out);


$outcsv = "db-obci.csv";
file_put_contents($outcsv,"");

$csvout = [];

foreach($db as $kraj=>$arr1){
    foreach($arr1 as $okres=>$arr2){
        foreach($arr2 as $obec=>$D){
            $csvout[] = [
                $obec, // id obce 
                $D[11], // STAV 
                $D[10], // obec 
                $okres, // okres 
                $kraj, // kraj 
                $D[6], // email pre volbu postou
                $D[12], // email pre hlas. listky
                $D[7], // predvolba
                $D[8], // tel
                $D[9], // mobil
                $D[2], // adresa
                $D[3], // c. domu
                $D[4], // psc
                $D[5], // mesto
                $D[13], // web
                $D[0] // typ uradu
                
                ];
            @$stats[$D[11]]++;
        }
    }
}

$fp = fopen($outcsv, 'a+');

fputcsv($fp, [
    "id obce",
    "stav",
    "obec",
    "okres",
    "kraj",
    "email pre volbu postou",
    "email pre hlas. listky",
    "predvolba",
    "tel",
    "mobil",
    "adresa",
    "c. domu",
    "psc",
    "mesto",
    "web",
    "typ uradu"
    ]);

/*
usort($csvout, function($a, $b){
    return strcmp($a[0], $b[0]);
});
/**/

foreach($csvout as $line){
    fputcsv($fp,$line);
}

fclose($fp);





echo "outcsv: ".filesize($outcsv)."\n";

echo "finished ".date("c")."\n";
var_dump($overenePostou);


