<?php

foreach(scandir(".") as $file){
    if(substr($file,-3) != ".js") continue;
    var_dump($file);
    $md5 = md5_file($file);
    $newname = substr($file,0,-3)."-".$md5.substr($file,-3);
    symlink($file,$newname);
}