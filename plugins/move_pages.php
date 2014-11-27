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
            $path = explode(DIRECTORY_SEPARATOR, $file);

            array_shift($path);

            $path = implode(DIRECTORY_SEPARATOR, $path);

            $path = $target.DIRECTORY_SEPARATOR.$path;

            $dir = explode(DIRECTORY_SEPARATOR, $path);
            array_pop($dir);
            $dir = implode(DIRECTORY_SEPARATOR, $dir);

            FileUtils::mkdirIfNotExists($dir);

            echo $target.DIRECTORY_SEPARATOR.$file.' -> '.$path."\n";

            copy($target.DIRECTORY_SEPARATOR.$file, $path);
            unlink($target.DIRECTORY_SEPARATOR.$file);
        }
    }

    $locale = explode(DIRECTORY_SEPARATOR, $file);

    FileUtils::recursiveDelete($target.DIRECTORY_SEPARATOR.array_shift($locale));
});
