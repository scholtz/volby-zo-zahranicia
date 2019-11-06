<?php

foreach(scandir(".") as $file){
    if(substr($file,-3) != ".js") continue;
    if(strlen($file) > 32) {
        //unlink($file);
        continue;
    }
    if(!file_exists($file.".gz")){
        `gzip < $file > $file.gz`;
    }
    $md5 = md5_file($file);
    $newname = substr($file,0,-3)."-".$md5.substr($file,-3);
    if(!file_exists($newname)){
        echo "Novy subor: $newname\n";
        symlink($file,$newname);
    }
    if(!file_exists($newname.".gz")){
        symlink($file.".gz",$newname.".gz");
    }
}