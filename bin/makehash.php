<?php

foreach(scandir("js") as $file){
    if(substr($file,-3) != ".js") continue;
    if(strlen($file) > 32) {
        //unlink($file);
        continue;
    }
    //if(!file_exists($file.".gz")){
    `gzip < js/$file > js/$file.gz`;
    //}
    $md5 = md5_file("js/$file");
    $newname = substr($file,0,-3)."-".$md5.substr($file,-3);
    if(!file_exists("js/$newname")){
        echo "Novy subor: $newname\n";
        symlink("$file","js/$newname");
        
        
    }
    if($file == "cities.js"){
        $index = file_get_contents("index.html");
        $pos = strpos($index,"js/cities");
        $pos2 = strpos($index,'"',$pos+1);
        $new = substr($index,0,$pos)."js/$newname".substr($index,$pos2);
        if($new != $index){
            file_put_contents("index.html",$new);
            var_dump("index updated with $newname");
        }
    }
    if(!file_exists("js/$newname.gz")){
        symlink("$file.gz","js/$newname.gz");
    }
    
}