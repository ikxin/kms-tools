<?php

if (isset($_POST['kms']) && !empty($_POST['kms'])){
    header("Content-type:application/txt;charset=ansi");
    header("Content-disposition:attachment;filename=kms.bat;");
    echo "@echo off";
    echo "\r\nslmgr /skms kms.ikxin.com";
    echo "\r\nslmgr /ipk ";
    echo $_POST['kms'];
    echo "\r\nslmgr /ato";
    echo "\r\nslmgr /xpr";
    exit;
} elseif ($_GET['clean']==1){
    header("Content-type:application/txt;charset=ansi");
    header("Content-disposition:attachment;filename=clean.bat;");
    echo "@echo off";
    echo "\r\nslmgr /upk";
    echo "\r\nslmgr /ckms";
    echo "\r\nslmgr /rearm";
} else {
    header("Location: ./");
    exit;
}

?>