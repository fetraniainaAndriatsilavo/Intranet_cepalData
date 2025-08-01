<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

        'sftp' => [
            'driver' => 'sftp',
            'host' => env('SFTP_HOST'),
            'username' => env('SFTP_USER'),
            'password' => env('SFTP_PASSWORD'),
            'port' => (int) env('SFTP_PORT', 22),
            'root' => env('SFTP_ROOT', '/'),
            'timeout' => 10,
        ],


        'payroll_ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.cluster029.hosting.ovh.net',
            'username' => 'youduwk',
            'password' => 'Fetra2025',
            'root'     => '/www/payroll',
            'passive'  => true,
            'ssl'      => false,
            'timeout'  => 30,
        ],
        'document_ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.cluster029.hosting.ovh.net',
            'username' => 'youduwk',
            'password' => 'Fetra2025',
            'root'     => '/www/documents',
            'passive'  => true,
            'ssl'      => false,
            'timeout'  => 30,

        ],
        'post_images_ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.cluster029.hosting.ovh.net',
            'username' => 'youduwk',
            'password' => 'Fetra2025',
            'root'     => '/www/post_images',
            'passive'  => true,
            'ssl'      => false,
            'timeout'  => 30,
        ],
        'post_videos_ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.cluster029.hosting.ovh.net',
            'username' => 'youduwk',
            'password' => 'Fetra2025',
            'root'     => '/www/post_videos',
            'passive'  => true,
            'ssl'      => false,
            'timeout'  => 30,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
