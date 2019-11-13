<?php

foreach(scandir("js") as $file){
    if(substr($file,-3) != ".gz") continue;
    unlink("js/$file");
}