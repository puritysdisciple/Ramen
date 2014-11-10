<?php
use cbednarski\FileUtils\FileUtils;

$spark->on('afterbuild', function ($event) {
    $compiler = $event->getCompiler();
    $config = $compiler->getConfig();
    $domains = $config->domain;
    $defaultLocale = $config->defaultLocale;

    $target = $config->getTargetPath();
    $files = FileUtils::listFilesInDir($target);

    foreach ($files as $file) {
        $file = FileUtils::pathDiff($target, $file);
        $file = substr($file, 1);

        if (strstr($file, 'assets') === false) {
            $path = explode('/', $file);

            array_shift($path);

            $path = implode('/', $path);

            $path = $target.'/'.$path;

            $dir = explode('/', $path);
            array_pop($dir);
            $dir = implode('/', $dir);

            FileUtils::mkdirIfNotExists($dir);

            echo $target.'/'.$file.' -> '.$path."\n";

            copy($target.'/'.$file, $path);
            unlink($target.'/'.$file);
        }
    }
});
