const Koa = require('koa');
const app = new Koa();
app.proxy = true;

const indexRoutes = require('./router');
const cors = require('@koa/cors');
const {bodyParser} = require("@koa/bodyparser");
const http = require('http');
const https = require('https');
const fs = require('fs');
const serve = require('koa-static');
// const mount = require('koa-mount');
const render = require('koa-ejs');
const path = require('path');
const Accountants = require("./models/accountants.models");
const Product = require("./models/product.models");
const Category = require("./models/category.models");
const Supplier = require("./models/supplier.models");
const User = require("./models/user.models");
const Recommended = require("./models/recommended.models");
const AccountantSupplier = require("./models/accountantSupplier.models");
const ProductPack = require("./models/productPack.models");
const UserProduct = require("./models/userProduct.models");
const LoginErrors = require("./models/login-errors.models");
const sequelize = require("./models/index");
const {DataTypes} = require("sequelize");
const compress = require('koa-compress')
const minifier = require('koa-html-minifier');
require('dotenv').config();

// ============== Server config
const PORT = process.env.PORT || 8080;
const config = {};
const env = process.argv[2] || 'prod';

config.ports = {
    http: PORT,
    https: 443
};

// ============ Path to openssl files
config.sslOptions = {
    key: fs.readFileSync('ssl/key.pem', 'utf8').toString(),
    cert: fs.readFileSync('ssl/cert.pem', 'utf8').toString()
};

// app.use(mount('/public ', serve(path.join(__dirname, '/static'))))
const staticDirPath = path.join(__dirname, 'public');

// // logger
// app.use(async (ctx, next) => {
//     await next();
//     const rt = ctx.response.get('X-Response-Time');
//     // console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });

indexRoutes.get('error', '/error', (ctx) => {
    ctx.throw(500, 'internal server error');
});

let pool;
app
    .use(async (ctx, next) => {
        const start = Date.now();
        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
        ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        ctx.set('Pragma', 'no-cache')
        ctx.set('Expires', 0)
        ctx.set('Surrogate-Control', 'no-store')
    })
    .use(async (ctx, next) => {
        if (pool) {
            return next();
        }
        try {
            pool = {};
            // await sequelize.sync({ force: true });
            // const queryInterface = sequelize.getQueryInterface();
            // await queryInterface.renameTable('customer', 'user');
            // await sequelize.sync({ alter: true });
            // await queryInterface.changeColumn('user', 'mobile', {
            //     type: DataTypes.BIGINT,
            //     allowNull: false,
            //     primaryKey: false
            // });
            // await queryInterface.changeColumn('user', 'id', {
            //     type: DataTypes.BIGINT,
            //     allowNull: false,
            //     primaryKey: true
            // });
            Accountants.sync().then(r => {
                // console.log('Accountants:', r)
            });
            Product.sync().then(r => {
                // console.log('Product:', r)
            });
            Category.sync().then(r => {
                // console.log('Category:', r)
            });
            Supplier.sync().then(r => {
                // console.log('Supplier:', r)
            });
            // User.sync({ alter: true }).then(async r => {
            User.sync().then(async r => {
                // console.log('User:', r)

                // await User.upsert({
                //     mobile: Number(573160437183),
                //     id: Number(123009),
                //     subDomainLink: "eyal"
                // });
            });
            Recommended.sync().then(r => {
                // console.log('Recommended:', r)
            });
            AccountantSupplier.sync().then(r => {
                // console.log('AccountantSupplier:', r)
            });
            ProductPack.sync().then(r => {
                // console.log('ProductPack:', r)
            });
            UserProduct.sync().then(r => {
                // console.log('UserProduct:', r)
            });
            LoginErrors.sync().then(r => {
                // console.log('LoginErrors:', r)
            });
            return next();
        } catch (err) {
            console.error(err);
            return next(err);
        }
    })
    .use(compress())
    .use(minifier({
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        noNewlinesBeforeTagClose: true,
        conservativeCollapse: true,
        continueOnParseError: true,
        ignoreCustomComments: true,
        minifyCSS: true,
        removeComments: true,
        minifyURLs: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        preserveLineBreaks: true
        // preventAttributesEscaping: true,
        // trimCustomFragments: true,
        // removeTagWhitespace: true,
        // removeOptionalTags:true,
        // removeEmptyAttributes:true,
        // removeAttributeQuotes:true,
    }))
    .use(cors())
    .use(bodyParser())
    .use(indexRoutes.routes())
    .use(indexRoutes.allowedMethods())
    .use(serve(staticDirPath))


render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

try {
    http.createServer(app.callback()).listen(config.ports.http, listeningReporter);
} catch (ex) {
    console.error('Failed to start http server\n', ex, (ex && ex.stack));
}

try {
    https.createServer(config.sslOptions, app.callback()).listen(config.ports.https, listeningReporter);
} catch (ex) {
    console.error('Failed to start https server\n', ex, (ex && ex.stack));
}

async function listeningReporter(err) {
    if (!!err) {
        console.error('HTTPS server FAIL: ', err, (err && err.stack));
    } else {
        console.log(`${new Date().toLocaleString()}`);
        // `this` refers to the http server here
        const {address, port} = this.address();
        const protocol = this.addContext ? 'https' : 'http';
        console.log(`Listening on ${protocol}://${address}:${port}...`);
    }
}
