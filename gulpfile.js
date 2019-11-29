/*
 * Copyright (C) 2013-2014 RT-RK, All Rights Reserved.
 * This source code and any compilation or derivative thereof is the
 * proprietary information of RT-RK and is confidential in nature.
 *
 * Under no circumstances is this software to be exposed to or placed
 * under an Open Source License of any type without the expressed written
 * permission of RT-RK.
 */

var gulp = require('gulp');
var plugins = {
    mocha: require('gulp-mocha'),
    apidocs: require('gulp-apidoc'),
    swagger: require('gulp-apidoc-swagger'),
    fs: require('fs'),
    exec: require('child_process').exec,
    runSequence: require('run-sequence'),
    _: require('lodash'),
    path: require('path')
};

gulp.task('doc', ['apidocs', 'swagger']);

gulp.task('apidocs', function (done) {
    plugins.apidocs({
        src: "services/",
        dest: "static/apidocs/",
        debug: true,
        includeFilters: ["router.js$"]
    }, done);
});

gulp.task('swagger', function () {
    plugins.swagger.exec({
        src: "src/",
        excludeFilters: ['^((?!router\.js).)*$'],
        dest: "static/swagger/",
        debug: true
    });
});


