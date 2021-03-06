module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var banner = '/*! <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>  <%= grunt.template.today("yyyy-mm-dd") %> \n\n\nThis Source Code Form is subject to the terms of the Mozilla Public\nLicense, v. 2.0. If a copy of the MPL was not distributed with this\nfile, You can obtain one at http://mozilla.org/MPL/2.0/.\n */\n';

    // Ignore webpack in node v5, until webpack is fixed for that version.
    var ignoreWebpack = process.version.substr(0, 'v5'.length) === 'v5';

    var js = {

        core: [
            'src/core.js',
            'src/joint.mvc.view.js',
            'src/joint.dia.graph.js',
            'src/joint.dia.cell.js',
            'src/joint.dia.element.js',
            'src/joint.dia.link.js',
            'src/joint.dia.paper.js',
            'plugins/shapes/joint.shapes.basic.js',
            'plugins/routers/joint.routers.orthogonal.js',
            'plugins/routers/joint.routers.manhattan.js',
            'plugins/routers/joint.routers.metro.js',
            'plugins/routers/joint.routers.oneSide.js',
            'plugins/connectors/joint.connectors.normal.js',
            'plugins/connectors/joint.connectors.rounded.js',
            'plugins/connectors/joint.connectors.smooth.js',
            'plugins/connectors/joint.connectors.jumpover.js'
        ],

        geometry: ['src/geometry.js'],
        vectorizer: ['src/vectorizer.js'],

        plugins: {

            'shapes.erd': ['plugins/shapes/joint.shapes.erd.js'],
            'shapes.fsa': ['plugins/shapes/joint.shapes.fsa.js'],
            'shapes.org': ['plugins/shapes/joint.shapes.org.js'],
            'shapes.chess': ['plugins/shapes/joint.shapes.chess.js'],
            'shapes.pn': ['plugins/shapes/joint.shapes.pn.js'],
            'shapes.devs': ['plugins/shapes/joint.shapes.devs.js'],
            'shapes.uml': ['plugins/shapes/joint.shapes.uml.js'],
            'shapes.logic': ['plugins/shapes/joint.shapes.logic.js'],

            'layout.DirectedGraph': ['plugins/layout/DirectedGraph/joint.layout.DirectedGraph.js']
        }
    };

    var css = {

        core: [
            'css/layout.css',
            'css/themes/*.css'
        ],

        plugins: {

        }
    };

    function allJSPlugins() {

        var ret = [];
        for (var name in js.plugins) {
            ret = ret.concat(js.plugins[name]);
        }
        return ret;
    }

    function allCSSPlugins() {

        var ret = [];
        for (var name in css.plugins) {
            ret = ret.concat(css.plugins[name]);
        }
        return ret;
    }

    function allMinifiedJSPlugins() {

        var files = [];

        for (var name in js.plugins) {
            files.push('build/min/joint.' + name + '.min.js');
        }

        return files;
    }

    function allMinifiedCSSPlugins() {

        var files = [];

        for (var name in css.plugins) {
            files.push('build/min/joint.' + name + '.min.css');
        }

        return files;
    }

    grunt.template.addDelimiters('square', '[%', '%]');

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        webpack: {
            joint: {
                files: {
                   './dist/joint.webpack-bundle.js' : './dist/joint.min.js'
                },
                entry: './dist/joint.min.js',
                output: {
                    path: './dist/',
                    filename: 'joint.webpack-bundle.js',
                    library: 'joint'
                },
                resolve: {
                    alias: {
                        g: './geometry.min.js',
                        V: './vectorizer.min.js'
                    }
                }
            }
        },
        browserify: {
            joint: {
                files: {
                    'dist/joint.browserify-bundle.js': 'dist/joint.min.js'
                },
                options: {
                    browserifyOptions: {
                        standalone: 'joint'
                    }
                }
            }
        },
        concat: {
            options: {
                banner: banner,
                process: {
                    delimiters: 'square'
                }
            },
            geometry: {
                files: {
                    'dist/geometry.js': [].concat(
                        ['build/wrappers/geometry.head.js'],
                        js.geometry,
                        ['build/wrappers/geometry.foot.js']
                    ),
                    'dist/geometry.min.js': [].concat(
                        ['build/wrappers/geometry.head.js'],
                        ['build/min/geometry.min.js'],
                        ['build/wrappers/geometry.foot.js']
                    )
                }
            },
            vectorizer: {
                files: {
                    'dist/vectorizer.js': [].concat(
                        ['build/wrappers/vectorizer.head.js'],
                        js.vectorizer,
                        ['build/wrappers/vectorizer.foot.js']
                    ),
                    'dist/vectorizer.min.js': [].concat(
                        ['build/wrappers/vectorizer.head.js'],
                        ['build/min/vectorizer.min.js'],
                        ['build/wrappers/vectorizer.foot.js']
                    )
                }
            },
            joint: {
                files: {
                    'dist/joint.core.js': [].concat(
                        ['build/wrappers/joint.head.js'],
                        js.geometry,
                        js.vectorizer,
                        js.core,
                        ['build/wrappers/joint.foot.js']
                    ),
                    'dist/joint.core.min.js': [].concat(
                        ['build/wrappers/joint.head.js'],
                        ['build/min/geometry.min.js'],
                        ['build/min/vectorizer.min.js'],
                        ['build/min/joint.min.js'],
                        ['build/wrappers/joint.foot.js']
                    ),
                    'dist/joint.core.css': [].concat(
                        css.core
                    ),
                    'dist/joint.core.min.css': [].concat(
                        ['build/min/joint.min.css']
                    ),
                    'dist/joint.js': [].concat(
                        ['build/wrappers/joint.head.js'],
                        js.geometry,
                        js.vectorizer,
                        js.core,
                        allJSPlugins(),
                        ['build/wrappers/joint.foot.js']
                    ),
                    'dist/joint.min.js': [].concat(
                        ['build/wrappers/joint.head.js'],
                        ['build/min/geometry.min.js'],
                        ['build/min/vectorizer.min.js'],
                        ['build/min/joint.min.js'],
                        allMinifiedJSPlugins(),
                        ['build/wrappers/joint.foot.js']
                    ),
                    'dist/joint.css': [].concat(
                        css.core,
                        allCSSPlugins()
                    ),
                    'dist/joint.min.css': [].concat(
                        ['build/min/joint.min.css'],
                        allMinifiedCSSPlugins()
                    ),
                    'dist/joint.nowrap.js': [].concat(
                        js.geometry,
                        js.vectorizer,
                        js.core,
                        allJSPlugins()
                    ),
                    'dist/joint.nowrap.min.js': [].concat(
                        ['build/min/geometry.min.js'],
                        ['build/min/vectorizer.min.js'],
                        ['build/min/joint.min.js'],
                        allMinifiedJSPlugins()
                    )
                }
            }
        },
        cssmin: {
            joint: {
                files: {
                    'build/min/joint.min.css': [].concat(
                        css.core
                    )
                }
            }
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: [
                // All plugins:
                'plugins/**/*.js',

                // Ignore third-party dependencies in plugins:
                '!plugins/**/lib/**/*.js',

                // Core jointjs:
                'src/**/*.js'
            ]
        },
        mochaTest: {
            server: {
                src: [
                    'test/*-nodejs/*'
                ],
                options: {
                    reporter: 'spec'
                }
            }
        },
        qunit: {
            all: [
                'test/**/*.html',
                '!test/**/coverage.html'
            ],
            all_coverage: ['test/**/coverage.html'],
            joint: [
                'test/jointjs/*.html',
                '!test/jointjs/coverage.html'
            ],
            joint_coverage: ['test/jointjs/coverage.html'],
            geometry: ['test/geometry/*.html'],
            vectorizer: ['test/vectorizer/*.html']
        },
        shell: {

            /*
                Run `bower install` in the context of the given directory.
            */
            bowerInstall: {
                command: function(dir, environment) {

                    var flags = environment && environment === 'production' ? ' --production': '';
                    var cmd = 'cd ' + dir + ' && bower --allow-root install' + flags;

                    return cmd;
                }
            }
        },
        uglify: {
            geometry: {
                src: js.geometry,
                dest: 'build/min/geometry.min.js'
            },
            joint: {
                src: js.core,
                dest: 'build/min/joint.min.js'
            },
            vectorizer: {
                src: js.vectorizer,
                dest: 'build/min/vectorizer.min.js'
            }
        },
        watch: {
            joint: {
                files: [].concat(
                    js.geometry,
                    js.vectorizer,
                    js.core,
                    allJSPlugins(),
                    css.core,
                    allCSSPlugins()
                ),
                tasks: ['build']
            }
        }
    };

    if (ignoreWebpack) {
        config.qunit.all.push('!test/**/webpack.html');
        config.qunit.joint.push('!test/jointjs/webpack.html');
    }

    function enableCodeCoverage() {

        // Replace all qunit configurations with the 'urls' method.
        // Append all URLs with ?coverage=true&grunt
        // This will run all qunit tests with test coverage enabled and report results back to grunt.

        var reporter = grunt.option('reporter') || 'lcov';

        // Serve up the test files via an express app.
        var express = require('express');
        var serveStatic = require('serve-static');
        var app = express();
        var host = 'localhost';
        var port = 3000;

        app.use('/', serveStatic(__dirname));
        app.listen(port, host);

        var name, files;

        for (name in config.qunit) {

            // Resolve the paths for all files referenced in the task.
            files = grunt.file.expand(config.qunit[name + '_coverage'] || config.qunit[name]);

            config.qunit[name] = { options: { urls: [] } };

            files.forEach(function(file) {

                var url = 'http://' + host + ':' + port + '/' + file + '?coverage=true&reporter=' + reporter;

                config.qunit[name].options.urls.push(url);
            });
        }

        var reporterToFileExtension = {
            lcov: 'info'
        };

        var reports = [];

        grunt.event.on('qunit.report', function(data) {

            reports.push(data);
        });

        var fs = require('fs');

        process.on('exit', function() {

            var ext = reporterToFileExtension[reporter];
            var outputFile = grunt.option('output') || 'coverage' + (ext ? '.' + ext : '');
            var data;

            switch (reporter) {
                case 'lcov':
                    data = reports.join('\n');
                break;
            }

            fs.writeFileSync(outputFile, data);
        });
    }

    // Create targets for all the plugins.
    Object.keys(js.plugins).forEach(function(name) {

        config.concat[name] = { files: {}, options: { banner: banner } };
        config.uglify[name] = { files: {} };

        config.uglify[name].files['build/min/joint.' + name + '.min.js'] = js.plugins[name];
        config.concat[name].files['dist/joint.' + name + '.js'] = js.plugins[name];
        config.concat[name].files['dist/joint.' + name + '.min.js'] = ['build/min/joint.' + name + '.min.js'];

        if (css.plugins[name]) {

            config.cssmin[name] = { files: {} };
            config.cssmin[name].files['build/min/joint.' + name + '.min.css'] = css.plugins[name];
            config.concat[name].files['dist/joint.' + name + '.css'] = css.plugins[name];
            config.concat[name].files['dist/joint.' + name + '.min.css'] = ['build/min/joint.' + name + '.min.css'];
        }
    });

    grunt.initConfig(config);

    var allPluginTasks = {
        concat: [],
        cssmin: [],
        uglify: []
    };

    // Register tasks for all the plugins.
    Object.keys(js.plugins).forEach(function(name) {

        var pluginTasks = [
            'newer:concat:' + name,
            'newer:uglify:' + name
        ];

        allPluginTasks.concat.push('newer:concat:' + name);
        allPluginTasks.uglify.push('newer:uglify:' + name);

        if (css.plugins[name]) {
            pluginTasks.push('newer:cssmin:' + name);
            allPluginTasks.cssmin.push('newer:cssmin:' + name);
        }


        grunt.registerTask(name, pluginTasks);
    });

    if (grunt.option('coverage')) {
        enableCodeCoverage();
    }

    grunt.registerTask('concat:plugins', allPluginTasks.concat);
    grunt.registerTask('cssmin:plugins', allPluginTasks.cssmin);
    grunt.registerTask('uglify:plugins', allPluginTasks.uglify);

    grunt.registerTask('build:plugins', [
        'uglify:plugins',
        'cssmin:plugins',
        'concat:plugins'
    ]);

    grunt.registerTask('build:joint', [
        'build:plugins',
        'newer:uglify:geometry',
        'newer:uglify:vectorizer',
        'newer:uglify:joint',
        'newer:cssmin:joint',
        'newer:concat:geometry',
        'newer:concat:vectorizer',
        'newer:concat:joint'
    ]);

    grunt.registerTask('build', ['build:joint']);
    grunt.registerTask('build:bundles', ignoreWebpack ? [
        'newer:browserify'
    ] : [
        'newer:browserify',
        'newer:webpack'
    ]);
    grunt.registerTask('build:all', ['build:joint', 'build:bundles']);

    grunt.registerTask('test:server', ['mochaTest:server']);
    grunt.registerTask('test:client', ['qunit:all', 'jscs']);
    grunt.registerTask('test', ['test:server', 'test:client']);

    grunt.registerTask('bowerInstall', [
        'shell:bowerInstall:.'
    ]);

    grunt.registerTask('install', ['bowerInstall']);
    grunt.registerTask('default', ['install', 'build', 'watch']);
};
