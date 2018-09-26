var gulp = require('gulp'),
    watch = require('gulp-watch'),                  // 监听文件变动执行
    sass = require('gulp-sass'),                    // sass编译
    rev = require('gulp-rev'),                      // 生成MD5戳 版本号控制
    uglify = require('gulp-uglify'),                // 压缩JS
    css = require('gulp-clean-css'),                // 压缩css
    imagemin = require('gulp-imagemin'),            // 压缩图片
    clean = require('gulp-clean'),                  // 清理文件夹
    fileinclude = require('gulp-file-include'),     // 模块化加载
    connect = require('gulp-connect'),
    revCollector = require('gulp-rev-collector'),
    replace = require('gulp-replace'),              //替换地址;
    htmlmin = require('gulp-htmlmin'),
    base64 = require('gulp-all-base64'),
    livereload = require('gulp-livereload');        // 监听文件更改刷新                      

// 'npm install --save-dev gulp-watch gulp-sass gulp-base64 gulp-htmlmin gulp-replace gulp-rev-collector gulp-rev gulp-uglify gulp-clean-css gulp-imagemin gulp-clean gulp-file-include gulp-connect'

// 本地启服务
gulp.task('webserver', function () {
    connect.server({
        root: './',
        host: '192.168.0.26',
        livereload: true,
        port: 3000
    });
});

// sass编译
gulp.task('sass', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'));
});

// html自动刷新浏览器
gulp.task('reload', function () {
    gulp.src('.')
        .pipe(connect.reload());
});

// 引入fileinclude公共模块
gulp.task('fileinclude', function () {
    gulp.src('./src/page/*.html')
        .pipe(rev())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest('./src/html'));
});

// 监听html
gulp.task('watchReload', function () {
    gulp.watch('./src/sass/*.scss', ['sass', 'minCss', 'rev']);
    gulp.watch('./src/page/*.html', ['fileinclude', 'minHtml', 'rev']);
    gulp.watch('./src/js/*.js', ['minJs', 'rev']);
    gulp.watch('./src/lib/*.js', ['minLibJs', 'rev']);
});

// 清理文件夹
gulp.task('clean', function () {
    gulp.src(['./dist', './rev'], { read: false })
        .pipe(clean());
});
gulp.task('cleanCss', function () {
    gulp.src(['./dist/css'], { read: false })
        .pipe(clean());
});
gulp.task('cleanHtml', function () {
    gulp.src(['./dist/html'], { read: false })
        .pipe(clean());
});

// 监听文件变动执行
gulp.task('watch', function () {
    gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('watchDist', function () {
    livereload.listen();
    gulp.watch(['dist/**']).on('change', livereload.changed);
});

// 开发环境  启动服务 监听文件改动
gulp.task('default', ['webserver', 'watchReload']); // , 'watchDist'






// 压缩images
gulp.task('minImage', function () {
    gulp.src([ './src/images/**/*'])
        .pipe(imagemin({
            optimizationLevel: 5,   //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,      //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true,       //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true         //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./dist/images'));;
});

// 压缩font里 css
gulp.task('copyFontCss', function () {
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('minFontCss', function () {
    gulp.src('./src/fonts/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./dist/fonts'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./rev/fonts'));
});

// 压缩css
gulp.task('minCss', function () {
    gulp.src(['./src/css/**/*'])
        .pipe(css())
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});

// 公共模块编译 > 压缩HTML清除注释
gulp.task('minHtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['./src/page/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/html'));
});

// 压缩js 
gulp.task('minJs', function () {
    gulp.src(['./src/js/*.js'])
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: false
        }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});

// lib
gulp.task('minLibJs', function () {
    gulp.src(['./src/lib/**'])
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: false
        }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/lib'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/lib'));
});

// 运行替换版本号
gulp.task('rev', function () {
    return gulp.src(['rev/*/*.json', 'dist/html/**/*.html'])
        .pipe(revCollector())               //- 根据 .json文件 执行文件内css名的替换
        .pipe(gulp.dest('./dist/html'));
});

/*************     打包预览节目的任务     ****************/
// 拷贝预览文件
gulp.task('copyShowImgsFile', function () {
    gulp.src('./src/page/show/images/*')
        .pipe(gulp.dest('./dist/html/show/images'))
});
gulp.task('copyShowIconFile', function () {
    gulp.src('./src/page/show/iconfont/*')
        .pipe(gulp.dest('./dist/html/show/iconfont'))
});
gulp.task('copyShowFile', ['copyShowImgsFile', 'copyShowIconFile']);
// 压缩预览js
gulp.task('minShowJs', function () {
    gulp.src(['./src/page/show/js/**/*.js'])
        // .pipe(uglify({
        //     //mangle: true,//类型：Boolean 默认：true 是否修改变量名
        //     mangle: false
        // }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/html/show/js'))
        // .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});
gulp.task('minShowHtml', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(['./src/page/show/*.html'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/html/show'));
});
gulp.task('minShowCss', function () {
    gulp.src(['./src/page/show/css/*'])
        .pipe(css())
        .pipe(rev())
        .pipe(gulp.dest('./dist/html/show/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});
gulp.task('showRev', function () {
    return gulp.src(['rev/*/*.json', 'dist/html/show/*.html'])
        .pipe(revCollector()) //- 根据 .json文件 执行文件内css名的替换
        .pipe(gulp.dest('./dist/html/show'));
});
gulp.task('packagingShow', ['copyShowFile', 'minShowHtml', 'minShowCss', 'minShowJs']);

/*************     打包预览节目的任务     ****************/

// 打包发布项目
gulp.task('packaging', ['minImage', 'minFontCss', 'minCss', 'minFontCss', 'minJs', 'minLibJs', 'minHtml']);











// // 节目预览JS
// gulp.task('showJs', function () {
//     gulp.src(['./src/page/show/js/**/*'])
//         .pipe(uglify({
//             //mangle: true,//类型：Boolean 默认：true 是否修改变量名
//             mangle: false
//         }))
//         .pipe(rev())
//         .pipe(gulp.dest('./dist/html/show/js'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('./rev/showjs'));
// });
// // 节目预览CSS
// gulp.task('showCss', function () {
//     gulp.src(['./src/page/show/css/*'])
//         .pipe(css())
//         .pipe(rev())
//         .pipe(gulp.dest('./dist/html/show/css'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('./rev/css'));
// });
// // 节目预览iconfont
// gulp.task('showIconfont', function () {
//     gulp.src(['./src/page/show/iconfont/*'])
//         .pipe(css())
//         .pipe(rev())
//         .pipe(gulp.dest('./dist/html/show/iconfont'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('./rev/css'));
// });
// gulp.task('showImage', function () {
//     gulp.src(['./src/page/show/images/*'])
//         .pipe(imagemin({
//             optimizationLevel: 5,   //类型：Number  默认：3  取值范围：0-7（优化等级）
//             progressive: true,      //类型：Boolean 默认：false 无损压缩jpg图片
//             interlaced: true,       //类型：Boolean 默认：false 隔行扫描gif进行渲染
//             multipass: true         //类型：Boolean 默认：false 多次优化svg直到完全优化
//         }))
//         .pipe(gulp.dest('./dist/html/show/images'));;
// });