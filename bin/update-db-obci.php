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
    file_put_contents("bin/error.txt",$json);
    $db = json_decode($json,true,10000,JSON_THROW_ON_ERROR);
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

// corrections data type:
// [0] user ktory robi request
// [1] emailposta
// [2] cas
// [3] REMOTE_ADDR
// [4] emailpreukaz

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
            
            
            
            
            
            $data[1] = str_replace(",",";",$data[1]);
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

$out = $parts[0].$div."\n".'election.cities='.str_replace("    "," ",json_encode($db,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)).';'."\n$div".$parts[2];
file_put_contents("js/newcities.js",$out);
echo "finished ".date("c")."\n";
var_dump($overenePostou);