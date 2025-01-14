const Index = require('@koa/router');
const {promises: fs, createReadStream} = require("fs");
const router = new Index();
require('dotenv').config();
const path = require('path');
const process = require('process');
const DATA_PATH = path.join(process.cwd(), 'data.json');
const Accountants = require("../models/accountants.models");
const Category = require("../models/category.models");
const Product = require("../models/product.models");
const user = require("../models/user.models");
const Recommended = require("../models/recommended.models");
const LoginErrors = require("../models/login-errors.models");
const Supplier = require("../models/supplier.models");
const AccountantSupplier = require("../models/accountantSupplier.models");
const ProductPack = require("../models/productPack.models");
const UserProduct = require("../models/userProduct.models");
const jwt = require("jsonwebtoken");
const privateKey = path.join(process.cwd(), 'jwt/private_key.pem');
const {sendMessages} = require("../facebook/messages");
const {manageAuth} = require("../auth/manage");
const Multer = require('@koa/multer');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: 'beehive-key.json'});
const {uploadFile} = require("../storage/google-storage");
const upload = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // no larger than 50mb
    },
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

router
    .get('/', async (ctx, next) => {
        // const foundUsers = await User.findAll();
        // console.log('foundUsers: ', foundUsers)
        // console.log('Init:', ctx.subdomains, ctx.params, ctx.path, ctx.url, ctx.param, ctx.query)
        // await Accountants.upsert({
        //     mobile: Number(2233),
        //     subDomainName: "",
        //     firstName: "",
        //     lastName: "",
        //     mainPicture: "",
        //     signaturePicture:"",
        //     address: "",
        //     city: "",
        //     bankNumber: Number(2233),
        //     snifNumber: Number(2233),
        //     accountNumber: Number(2233)
        // });
        // console.log(ctx.headers.cookie, ctx.cookies.get('JwtToken'));
        // console.log(ctx.request.origin, ctx.request.protocol, ctx.request.secure, ctx.request.host, ctx.request.url, ctx.request.host, ctx.request.hostname);
        // console.log(ctx.ip, ctx.subdomains)
        // console.log(ctx.query);
        ctx.state = ctx.state || {}
        // ctx.state.username = 'שם יוזר';
        // ctx.state.signature = 'signature.png';
        // ctx.state.acc_logo = 'acc-logo.png';
        let subdomain = null;
        if (ctx.subdomains && ctx.subdomains.length > 0) {
            subdomain = ctx.subdomains[ctx.subdomains.length - 1];
            ctx.state.subdomain = subdomain === 'www' ? null : subdomain;
            console.log('subdomain:', subdomain);
        } else {
            ctx.state.subdomain = null;
        }
        try {
            const jwtTokenByCookies = ctx.cookies.get('JwtToken');
            console.log('jwtTokenByCookies', jwtTokenByCookies)
            if (jwtTokenByCookies) {
                try {
                    const secretKey = await fs.readFile(privateKey);
                    const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                    console.log('decoded', decoded)
                    const userFound = await user.findOne({
                        where: {
                            mobile: Number(decoded.mobile),
                            otpCode: decoded.otpCode,
                            id: Number(decoded.id)
                        }
                    });
                    console.log('userFound', userFound);
                    if (userFound === null) {
                        ctx.cookies.set('JwtToken', '', {
                            httpOnly: false,
                            domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                        });
                        ctx.cookies.set('logout', 'true', {
                            httpOnly: false,
                            domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                        });
                        if (ctx.state.subdomain) {
                            const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                            ctx.redirect(mainPath);
                            ctx.status = 301;
                            return
                        } else {
                            ctx.redirect('/');
                            ctx.status = 301;
                            return
                        }
                    } else {
                        ctx.state.user_username = userFound.firstName + ' ' + userFound.lastName;
                        if (userFound.subDomainLink === ctx.state.subdomain) {
                            // console.log('------2222----', ctx.state.subdomain, userFound.subDomainLink)

                        } else {
                            if (ctx.state.subdomain) {
                                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', userFound.subDomainLink + '.');
                                ctx.redirect(mainPath);
                                ctx.status = 301;
                                return
                            } else {
                                const mainPath = ctx.request.protocol + '://' + userFound.subDomainLink + '.' + ctx.request.origin.split('://')[1];
                                ctx.redirect(mainPath);
                                ctx.status = 301;
                                return
                            }
                        }
                    }
                } catch (err) {
                    // err
                    console.log('err', err)
                    ctx.cookies.set('JwtToken', '', {
                        httpOnly: false,
                        domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                    });
                    if (ctx.state.subdomain) {
                        const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                        ctx.redirect(mainPath);
                        ctx.status = 301;
                        return
                    }
                }
            } else {
                if (ctx.state.subdomain) {
                    const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                    ctx.redirect(mainPath);
                    ctx.status = 301;
                    return
                }
            }
        } catch (err) {
            console.log(err)
            if (ctx.state.subdomain) {
                subdomain = null;
                ctx.state.subdomain = null;
                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                ctx.redirect(mainPath);
                ctx.status = 301;
            }
        }

        const AccountantFound = subdomain ? await Accountants.findOne({where: {subDomainName: subdomain}}) : null;
        // // Accountant.findByPk(123);
        if (AccountantFound === null) {
            console.log('Not found!');
        } else {
            // console.log('AccountantFound: ', AccountantFound.firstName)
            ctx.state.firstName = AccountantFound.firstName;
            ctx.state.signature = AccountantFound.signaturePicture;
            ctx.state.acc_logo = AccountantFound.logoName;
            ctx.state.mainPicture = AccountantFound.mainPicture;
            ctx.state.username = AccountantFound.firstName + ' ' + AccountantFound.lastName;
        }

        try {
            const content = await fs.readFile(DATA_PATH);
            const data = JSON.parse(content);
            // console.log(data)
            // ctx.type = 'html';
            // ctx.body = createReadStream('views/index.html');
            if (!ctx.state.subdomain) {
                ctx.state.userActive = false;
                await ctx.render('template', {
                    page: 'template',
                    data: data,
                    styles: [
                        'reset',
                        'styles',
                        'tablet',
                        'mobile'
                    ],
                    libs: [
                        'common'
                    ]
                });
            } else {
                ctx.state.userActive = true;
                // console.log('AccountantFound: ', AccountantFound)
                // console.log('categoryTable: ', categoryTable)
                // console.log('productTable: ', JSON.stringify(productTable));
                // {
                //     "itemId": "116",
                //     "icon": "management.svg",
                //     "itemName": "management",
                //     "isEnabled": 1,
                //     "categoryId": "management",
                //     "priority": 9,
                //     "supplier_id": 100101,
                //     "pictureName": "icon-top-example.svg",
                //     "title": "ניהול כספים",
                //     "sub_title": "איש מקצוע: ישראל ישראלי",
                //     "description": "ניהול תזרים מזומנים משפר את היעילות הפיננסית של העסק על ידי מתן כלים למעקב מדויק, זיהוי בעיות, וקבלת..."
                // }
                const recommendedTable = await Recommended.findAll({
                    order: [
                        ['priority', 'ASC']
                    ],
                });
                const categoryTable = await Category.findAll();
                const dropdown = [
                    {
                        "title": "לכל התחומים",
                        "link": "/categories"
                    }
                ]
                categoryTable.forEach(category => {
                    dropdown.push({
                        "title": category.hebrewName,
                        "link": "/categories?query=" + category.id
                    })
                })
                const productTableSrc = await Product.findAll({
                    order: [
                        ['isEnabled', 'DESC'],
                        ['priority', 'ASC']
                    ],
                });
                const supplierTableSrc = await Supplier.findAll({
                    where: {
                        isEnabled: 1
                    },
                    order: [
                        ['priority', 'ASC']
                    ],
                });
                let supplierTable = JSON.parse(JSON.stringify(supplierTableSrc))
                const accountantSupplierTable = await AccountantSupplier.findAll();
                let productTable = JSON.parse(JSON.stringify(productTableSrc))
                for (let i = 0; i < productTable.length; i++) {
                    const getSupplier = supplierTable && supplierTable.length ? supplierTable.find(supplier => supplier.supplierId === productTable[i].supplierId) : false;
                    const getAccountantSupplier = accountantSupplierTable && accountantSupplierTable.length ? accountantSupplierTable.find(accountantSupplier => accountantSupplier.itemId === productTable[i].itemId && accountantSupplier.subDomainName === AccountantFound.subDomainName && accountantSupplier.supplierId !== productTable[i].supplierId) : false;
                    if (getSupplier && !getAccountantSupplier) {
                        productTable[i].productPictureName = getSupplier.productPictureName;
                        productTable[i].pictureName = getSupplier.pictureName;
                        productTable[i].sub_title = getSupplier.supplierName;
                    } else {
                        if (getAccountantSupplier) {
                            const getSupplierByOverride = supplierTable.find(supplier => supplier.supplierId === getAccountantSupplier.supplierId);
                            productTable[i].productPictureName = getSupplierByOverride.productPictureName;
                            productTable[i].pictureName = getSupplierByOverride.pictureName;
                            productTable[i].sub_title = getSupplierByOverride.supplierName;
                            productTable[i].videoName = getAccountantSupplier.videoName;
                        }
                    }
                    const cat = categoryTable.find(ct => ct.id === productTable[i].categoryId);
                    productTable[i].icon = cat ? cat.icon : '';
                    productTable[i].hebrewName = cat ? cat.hebrewName : '';
                }
                const productFilters = productTable.filter((item, pos, self) => self.findIndex(v => v.categoryId === item.categoryId) === pos);
                let categoryTopFilter = JSON.parse(JSON.stringify(productFilters))
                for (let i = 0; i < categoryTopFilter.length; i++) {
                    let product = categoryTopFilter[i];
                    const cat = categoryTable.find(ct => ct.id === product.categoryId);
                    product.icon = cat ? cat.icon : '';
                }
                // console.log('categoryTopFilter: ', JSON.stringify(categoryTopFilter))
                const topFiveProduct = productTable.filter(item => item.isEnabled === 1).slice(0, 5);
                // console.log('topFiveProduct: ', JSON.stringify(topFiveProduct))

                for (let i = 0; i < supplierTable.length; i++) {
                    const productBySupplier = productTable.filter(item => {
                        return item.supplierId === supplierTable[i].supplierId && (accountantSupplierTable && accountantSupplierTable.length ? !accountantSupplierTable.find(it => it.subDomainName === AccountantFound.subDomainName && it.itemId === item.itemId && it.supplierId !== supplierTable[i].supplierId) : true);
                    });
                    for (let i1 = 0; i1 < accountantSupplierTable.length; i1++) {
                        if (accountantSupplierTable[i1].subDomainName === AccountantFound.subDomainName && accountantSupplierTable[i1].supplierId === supplierTable[i].supplierId && !productBySupplier.find(it => it.itemId === accountantSupplierTable[i1].itemId)) {
                            productBySupplier.push(productTable.find(it => it.itemId === accountantSupplierTable[i1].itemId))
                        }
                    }
                    for (let i1 = 0; i1 < productBySupplier.length; i1++) {
                        productBySupplier[i1].productPictureName = supplierTable[i].productPictureName;
                        productBySupplier[i1].pictureName = supplierTable[i].pictureName;
                        productBySupplier[i1].sub_title = supplierTable[i].supplierName;
                    }
                    supplierTable[i].products = productBySupplier;
                    // console.log('productBySupplier: -----', productBySupplier)
                }

                await ctx.render('index', {
                    page: 'index',
                    data: data,
                    categoryTable,
                    productTable,
                    recommendedTable,
                    categoryTopFilter,
                    topFiveProduct,
                    supplierTable,
                    dropdown,
                    styles: [
                        'jquery.gScrollingCarousel',
                        'reset',
                        'owl.carousel.min',
                        'owl.theme.default',
                        'styles',
                        'tablet',
                        'mobile'
                    ],
                    libs: [
                        'jquery.waterwheelCarousel.min',
                        'owl.carousel.min',
                        'common',
                        'main'
                    ]
                });
            }
        } catch (e) {
            console.log('ErrorMainPage:', e)
            ctx.type = 'html';
            ctx.body = createReadStream('index.html');
        }
    })
    .get('/login', async (ctx) => {
        try {
            ctx.state = ctx.state || {}
            ctx.state.userActive = false;
            let subdomain = null;
            if (ctx.subdomains && ctx.subdomains.length > 0) {
                subdomain = ctx.subdomains[ctx.subdomains.length - 1];
                ctx.state.subdomain = subdomain === 'www' ? null : subdomain;
                console.log('subdomain:', subdomain);
            } else {
                ctx.state.subdomain = null;
            }
            if (ctx.state.subdomain) {
                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                ctx.redirect(mainPath + '/login');
                ctx.status = 301;
                return;
            }

            const jwtTokenByCookies = ctx.cookies.get('JwtToken');
            console.log('jwtTokenByCookies1111', jwtTokenByCookies)
            if (jwtTokenByCookies) {
                const secretKey = await fs.readFile(privateKey);
                const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                console.log('decoded', decoded)
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(decoded.mobile),
                        otpCode: decoded.otpCode,
                        id: Number(decoded.id),
                    }
                });
                console.log('userFound', userFound);
                if (userFound) {
                    ctx.redirect('/');
                    return;
                }
            }

            const content = await fs.readFile(DATA_PATH);
            const data = JSON.parse(content);
            await ctx.render('login', {
                page: 'login',
                data: data,
                styles: [
                    'reset',
                    'styles',
                    'tablet',
                    'mobile'
                ],
                libs: [
                    'common',
                    'login'
                ]
            });


        } catch (e) {
            console.log('errr', e)
            ctx.redirect('/');
            ctx.status = 301;
        }

    })
    .get('/loader', async (ctx) => {
        // console.log('loader:', ctx.subdomains, ctx.params, ctx.path, ctx.url, ctx.param, ctx.query)
        await ctx.render('loader-page', {
            page: 'loader-page',
            styles: [
                'reset',
                'styles',
                'tablet',
                'mobile'
            ],
            libs: [
                'common'
            ]
        });
    })
    .get('/categories', async (ctx) => {
        console.log('subdomains:', ctx.subdomains);
        ctx.state = ctx.state || {}
        // ctx.state.username = 'שם יוזר';
        // ctx.state.signature = 'signature.png';
        // ctx.state.acc_logo = 'acc-logo.png';
        let subdomain = null;
        if (ctx.subdomains && ctx.subdomains.length > 0) {
            subdomain = ctx.subdomains[ctx.subdomains.length - 1];
            console.log('subdomain:', subdomain);
            if (subdomain === 'www') {
                subdomain = null;
                ctx.state.subdomain = null;
                ctx.redirect('/');
                return;
            }
            ctx.state.subdomain = subdomain;
        } else {
            ctx.state.subdomain = null;
            ctx.redirect('/');
            return;
        }
        const isFullAuth = await manageAuth(ctx, '/categories');
        if (!isFullAuth) {
            return;
        }
        ctx.state.user_username = isFullAuth.firstName + ' ' + isFullAuth.lastName;

        const AccountantFound = subdomain ? await Accountants.findOne({where: {subDomainName: subdomain}}) : null;
        // // Accountant.findByPk(123);
        if (AccountantFound === null) {
            console.log('Not found!');
        } else {
            // console.log('AccountantFound: ', AccountantFound.firstName)
            ctx.state.firstName = AccountantFound.firstName;
            ctx.state.username = AccountantFound.firstName + ' ' + AccountantFound.lastName;
            ctx.state.signature = AccountantFound.signaturePicture;
            ctx.state.acc_logo = AccountantFound.logoName;
            ctx.state.mainPicture = AccountantFound.mainPicture;
        }
        const content = await fs.readFile(DATA_PATH);
        const data = JSON.parse(content);
        // console.log('categoryTable: ', categoryTable)
        // console.log('productTable: ', JSON.stringify(productTable));
        // {
        //     "itemId": "116",
        //     "icon": "management.svg",
        //     "itemName": "management",
        //     "isEnabled": 1,
        //     "categoryId": "management",
        //     "priority": 9,
        //     "supplier_id": 100101,
        //     "pictureName": "icon-top-example.svg",
        //     "title": "ניהול כספים",
        //     "sub_title": "איש מקצוע: ישראל ישראלי",
        //     "description": "ניהול תזרים מזומנים משפר את היעילות הפיננסית של העסק על ידי מתן כלים למעקב מדויק, זיהוי בעיות, וקבלת..."
        // }
        const categoryTable = await Category.findAll();
        const dropdown = [
            {
                "title": "לכל התחומים",
                "link": "/categories"
            }
        ]
        categoryTable.forEach(category => {
            dropdown.push({
                "title": category.hebrewName,
                "link": "/categories?query=" + category.id
            })
        })
        const productTableSrc = await Product.findAll({
            order: [
                ['isEnabled', 'DESC'],
                ['priority', 'ASC']
            ],
        });
        const supplierTableSrc = await Supplier.findAll({
            where: {
                isEnabled: 1
            },
            order: [
                ['priority', 'ASC']
            ],
        });
        let supplierTable = JSON.parse(JSON.stringify(supplierTableSrc))
        const accountantSupplierTable = await AccountantSupplier.findAll();
        let productTable = JSON.parse(JSON.stringify(productTableSrc))
        for (let i = 0; i < productTable.length; i++) {
            const getSupplier = supplierTable.find(supplier => supplier.supplierId === productTable[i].supplierId);
            const getAccountantSupplier = accountantSupplierTable.find(accountantSupplier => accountantSupplier.itemId === productTable[i].itemId && accountantSupplier.subDomainName === AccountantFound.subDomainName && accountantSupplier.supplierId !== productTable[i].supplierId);
            if (getSupplier && !getAccountantSupplier) {
                productTable[i].pictureName = getSupplier.pictureName;
                productTable[i].productPictureName = getSupplier.productPictureName;
                productTable[i].sub_title = getSupplier.supplierName;
            } else {
                if (getAccountantSupplier) {
                    const getSupplierByOverride = supplierTable.find(supplier => supplier.supplierId === getAccountantSupplier.supplierId);
                    productTable[i].productPictureName = getSupplierByOverride.productPictureName;
                    productTable[i].pictureName = getSupplierByOverride.pictureName;
                    productTable[i].sub_title = getSupplierByOverride.supplierName;
                    productTable[i].videoName = getAccountantSupplier.videoName;
                }
            }

            let product = productTable[i];
            const cat = categoryTable.find(ct => ct.id === product.categoryId);
            product.icon = cat ? cat.icon : '';
            product.hebrewName = cat ? cat.hebrewName : '';
        }
        const productFilters = productTable.filter((item, pos, self) => self.findIndex(v => v.categoryId === item.categoryId) === pos);
        let categoryTopFilter = JSON.parse(JSON.stringify(productFilters))
        // for (let i = 0; i < categoryTopFilter.length; i++) {
        //     let product = categoryTopFilter[i];
        //     const cat = categoryTable.find(ct => ct.id === product.categoryId);
        //     product.icon = cat ? cat.icon : '';
        //     product.hebrewName = cat ? cat.hebrewName : '';
        // }
        // console.log('categoryTopFilter: ', JSON.stringify(categoryTopFilter))
        ctx.state.userActive = true;
        await ctx.render('categories', {
            page: 'categories',
            data: data,
            dropdown,
            categoryTable,
            productTable: productTable,
            categoryTopFilter,
            styles: [
                'reset',
                'styles',
                'tablet',
                'mobile'
            ],
            libs: [
                'common',
                'categories'
            ]
        });
    })
    .get('/categories/:id', async (ctx) => {
        ctx.state = ctx.state || {}
        // ctx.state.username = 'שם יוזר';
        // ctx.state.signature = 'signature.png';
        // ctx.state.acc_logo = 'acc-logo.png';
        let subdomain = null;
        if (ctx.subdomains && ctx.subdomains.length > 0) {
            subdomain = ctx.subdomains[ctx.subdomains.length - 1];
            console.log('subdomain:', subdomain);
            if (subdomain === 'www') {
                subdomain = null;
                ctx.state.subdomain = null;
                ctx.redirect('/');
                return;
            }
            ctx.state.subdomain = subdomain;
        } else {
            ctx.state.subdomain = null;
            ctx.redirect('/');
            return;
        }
        const isFullAuth = await manageAuth(ctx, '/categories/' + ctx.params.id);
        if (!isFullAuth) {
            return;
        }
        ctx.state.user_username = isFullAuth.firstName + ' ' + isFullAuth.lastName;

        const AccountantFound = subdomain ? await Accountants.findOne({where: {subDomainName: subdomain}}) : null;
        // // Accountant.findByPk(123);
        if (AccountantFound === null) {
            console.log('Not found!');
            ctx.redirect('/categories');
            return;
        } else {
            // console.log('AccountantFound: ', AccountantFound.firstName)
            ctx.state.firstName = AccountantFound.firstName;
            ctx.state.username = AccountantFound.firstName + ' ' + AccountantFound.lastName;
            ctx.state.signature = AccountantFound.signaturePicture;
            ctx.state.acc_logo = AccountantFound.logoName;
            ctx.state.mainPicture = AccountantFound.mainPicture;
        }
        ctx.state.userActive = true;
        const id_page = ctx.params.id;
        console.log(id_page)
        if (!id_page) {
            ctx.redirect('/categories');
            return;
        }
        const content = await fs.readFile(DATA_PATH);
        const data = JSON.parse(content);
        // console.log('categoryTable: ', categoryTable)
        // console.log('productTable: ', productTable)
        const categoryTable = await Category.findAll();
        const dropdown = [
            {
                "title": "לכל התחומים",
                "link": "/categories"
            }
        ]
        categoryTable.forEach(category => {
            dropdown.push({
                "title": category.hebrewName,
                "link": "/categories?query=" + category.id
            })
        })
        const productTableSrc = await Product.findAll({
            order: [
                ['isEnabled', 'DESC'],
                ['priority', 'ASC']
            ],
        });
        const supplierTableSrc = await Supplier.findAll({
            where: {
                isEnabled: 1
            },
            order: [
                ['priority', 'ASC']
            ],
        });
        let supplierTable = JSON.parse(JSON.stringify(supplierTableSrc))
        const accountantSupplierTable = await AccountantSupplier.findAll();
        let productTable = JSON.parse(JSON.stringify(productTableSrc))
        for (let i = 0; i < productTable.length; i++) {
            const getSupplier = supplierTable.find(supplier => supplier.supplierId === productTable[i].supplierId);
            const getAccountantSupplier = accountantSupplierTable.find(accountantSupplier => accountantSupplier.itemId === productTable[i].itemId && accountantSupplier.subDomainName === AccountantFound.subDomainName && accountantSupplier.supplierId !== productTable[i].supplierId);
            if (getSupplier && !getAccountantSupplier) {
                productTable[i].pictureName = getSupplier.pictureName;
                productTable[i].productPictureName = getSupplier.productPictureName;
                productTable[i].sub_title = getSupplier.supplierName;
                // productTable[i].videoName = getSupplier.videoName;
                productTable[i].supplier = getSupplier;
            } else {
                if (getAccountantSupplier) {
                    const getSupplierByOverride = supplierTable.find(supplier => supplier.supplierId === getAccountantSupplier.supplierId);
                    productTable[i].pictureName = getSupplierByOverride.pictureName;
                    productTable[i].productPictureName = getSupplierByOverride.productPictureName;
                    productTable[i].sub_title = getSupplierByOverride.supplierName;
                    productTable[i].videoName = getAccountantSupplier.videoName;
                    productTable[i].supplier = getSupplierByOverride;
                }
            }

            let product = productTable[i];
            const cat = categoryTable.find(ct => ct.id === product.categoryId);
            product.icon = cat ? cat.icon : '';
            product.hebrewName = cat ? cat.hebrewName : '';
        }
        const item_product = productTable.find(c => c.itemId === id_page);
        const recommendedTable = await Recommended.findAll({
            order: [
                ['priority', 'ASC']
            ],
        });
        const productPackItem = await ProductPack.findAll(
            {
                where: {itemId: item_product.itemId, isDeleted: 0},
                order: [
                    ['packPriority', 'ASC']
                ]
            }
        );
        let productPackItemTable = JSON.parse(JSON.stringify(productPackItem));
        for (let i = 0; i < productPackItemTable.length; i++) {
            const userProductTable = await UserProduct.findOne(
                {
                    where: {
                        userId: Number(isFullAuth.id),
                        packId: Number(productPackItemTable[i].id)
                    }
                }
            );
            productPackItemTable[i].disabled = userProductTable === null ? false : userProductTable.status !== 'inactive';
        }


        // console.log('-----item_product-----', item_product);
        await ctx.render('categories-template', {
            mobile: '0' + isFullAuth.mobile.toString().slice(0, 2) + '-' + isFullAuth.mobile.toString().slice(2),
            data: data,
            id_page: id_page,
            item_product: item_product || '',
            productPackItem: productPackItemTable,
            page: 'categories-template',
            recommendedTable,
            dropdown,
            productTable,
            styles: [
                'reset',
                'owl.carousel.min',
                'owl.theme.default',
                'styles',
                'tablet',
                'mobile'
            ],
            libs: [
                'owl.carousel.min',
                'common',
                'categories-items'
            ]
        });
    })
    .get('/account-details', async (ctx) => {
        console.log('subdomains:', ctx.subdomains);
        ctx.state = ctx.state || {}
        // ctx.state.username = 'שם יוזר';
        // ctx.state.signature = 'signature.png';
        // ctx.state.acc_logo = 'acc-logo.png';
        let subdomain = null;
        if (ctx.subdomains && ctx.subdomains.length > 0) {
            subdomain = ctx.subdomains[ctx.subdomains.length - 1];
            console.log('subdomain:', subdomain);
            if (subdomain === 'www') {
                subdomain = null;
                ctx.state.subdomain = null;
                ctx.redirect('/');
                return;
            }
            ctx.state.subdomain = subdomain;
        } else {
            ctx.state.subdomain = null;
            ctx.redirect('/');
            return;
        }
        const isFullAuth = await manageAuth(ctx, '/account-details');
        if (!isFullAuth) {
            return;
        }
        ctx.state.user_username = isFullAuth.firstName + ' ' + isFullAuth.lastName;

        const AccountantFound = subdomain ? await Accountants.findOne({where: {subDomainName: subdomain}}) : null;
        // // Accountant.findByPk(123);
        if (AccountantFound === null) {
            console.log('Not found!');
        } else {
            // console.log('AccountantFound: ', AccountantFound.firstName)
            ctx.state.firstName = AccountantFound.firstName;
            ctx.state.username = AccountantFound.firstName + ' ' + AccountantFound.lastName;
            ctx.state.signature = AccountantFound.signaturePicture;
            ctx.state.acc_logo = AccountantFound.logoName;
            ctx.state.mainPicture = AccountantFound.mainPicture;
        }
        const content = await fs.readFile(DATA_PATH);
        const data = JSON.parse(content);
        const categoryTable = await Category.findAll();
        const dropdown = [
            {
                "title": "לכל התחומים",
                "link": "/categories"
            }
        ]
        categoryTable.forEach(category => {
            dropdown.push({
                "title": category.hebrewName,
                "link": "/categories?query=" + category.id
            })
        })
        const userFound = await user.findAll({
            raw: true, nest: true,
            where: {
                mobile: Number(isFullAuth.mobile)
            }
        });

        console.log('userFound', userFound);
        let accountantData = {};
        let userFoundTable = userFound;
        if (userFound !== null) {
            // userFoundTable = JSON.parse(JSON.stringify(nodeData))
            for (let i = 0; i < userFoundTable.length; i++) {
                userFoundTable[i].titles = {
                    price: 0,
                    accCommission: 0,
                    statusActive: 0,
                    statusLead: 0,
                    nextBillingDate: null
                }
                const userProductSrc = await UserProduct.findAll(
                    {
                        where: {
                            userId: Number(userFoundTable[i].id),
                        }
                    }
                );
                if (userProductSrc !== null) {
                    let userProductTable = JSON.parse(JSON.stringify(userProductSrc))
                    if (userProductTable.length) {
                        userFoundTable[i].titles.nextBillingDate = userProductTable[0].nextBillingDate;
                        for (let i1 = 0; i1 < userProductTable.length; i1++) {
                            if (userProductTable[i1].nextBillingDate && new Date(userProductTable[i1].nextBillingDate) > Date.now()) {
                                userFoundTable[i].titles.price += userProductTable[i1].price;
                                console.log('----userProductTable[i1].accCommission-----', userProductTable[i1].accCommission);
                                userFoundTable[i].titles.accCommission += (userProductTable[i1].accCommission) ? Number(userProductTable[i1].accCommission) : 0;
                            }

                            userProductTable[i1].companyName = userFoundTable[i].companyName;

                            if (userProductTable[i1].status === 'active' || userProductTable[i1].status === 'division') {
                                userFoundTable[i].titles.statusActive += 1;
                            }

                            if (userProductTable[i1].status === 'lead') {
                                userFoundTable[i].titles.statusLead += 1;
                            }

                            const productSrc = await Product.findOne(
                                {
                                    where: {
                                        itemId: Number(userProductTable[i1].itemId),
                                    }
                                }
                            );
                            if (productSrc !== null) {
                                userProductTable[i1].title = productSrc.title;
                            }
                        }
                    }
                    userFoundTable[i].userProducts = userProductTable;
                }
            }
            userFoundTable.sort(function (item1, item2) {
                if (item1.id === isFullAuth.id) {
                    return -1;
                }
                return 1;
            });
            // console.log('------userFound.userType------', isFullAuth.userType);
            if (isFullAuth.userType === "accountant") {
                accountantData.titles = {
                    accCommission: 0,
                    statusActive: 0,
                    statusLead: 0,
                }
                accountantData.userProducts = [];
                userFoundTable.forEach(user => {
                    accountantData.titles.accCommission += user.titles.accCommission;
                    accountantData.titles.statusActive += user.titles.statusActive;
                    accountantData.titles.statusLead += user.titles.statusLead;
                    accountantData.userProducts.push(...user.userProducts)
                })
            }
        }
        console.log('companies: ', userFoundTable);
        ctx.state.userActive = true;
        await ctx.render('account-details', {
            page: 'account-details',
            data: data,
            accountantData,
            user: isFullAuth,
            companies: userFoundTable,
            dropdown,
            styles: [
                'reset',
                'styles',
                'tablet',
                'mobile'
            ],
            libs: [
                'common',
                'account-details'
            ]
        });
    })
    .get('/personal-details', async (ctx) => {
        // console.log('subdomains:', ctx.subdomains);
        ctx.state = ctx.state || {}
        // ctx.state.username = 'שם יוזר';
        // ctx.state.signature = 'signature.png';
        // ctx.state.acc_logo = 'acc-logo.png';
        let subdomain = null;
        if (ctx.subdomains && ctx.subdomains.length > 0) {
            subdomain = ctx.subdomains[ctx.subdomains.length - 1];
            console.log('subdomain:', subdomain);
            if (subdomain === 'www') {
                subdomain = null;
                ctx.state.subdomain = null;
                ctx.redirect('/');
                return;
            }
            ctx.state.subdomain = subdomain;
        } else {
            ctx.state.subdomain = null;
            ctx.redirect('/');
            return;
        }
        const isFullAuth = await manageAuth(ctx, '/personal-details');
        if (!isFullAuth) {
            return;
        }
        ctx.state.user_username = isFullAuth.firstName + ' ' + isFullAuth.lastName;

        console.log('id--------:', isFullAuth.id);
        const AccountantFound = subdomain ? await Accountants.findOne({where: {subDomainName: subdomain}}) : null;
        // // Accountant.findByPk(123);
        if (AccountantFound === null) {
            console.log('Not found!');
        } else {
            // console.log('AccountantFound: ', AccountantFound.firstName)
            ctx.state.firstName = AccountantFound.firstName;
            ctx.state.username = AccountantFound.firstName + ' ' + AccountantFound.lastName;
            ctx.state.signature = AccountantFound.signaturePicture;
            ctx.state.acc_logo = AccountantFound.logoName;
            ctx.state.mainPicture = AccountantFound.mainPicture;
        }
        const content = await fs.readFile(DATA_PATH);
        const data = JSON.parse(content);
        const categoryTable = await Category.findAll();
        const dropdown = [
            {
                "title": "לכל התחומים",
                "link": "/categories"
            }
        ]
        categoryTable.forEach(category => {
            dropdown.push({
                "title": category.hebrewName,
                "link": "/categories?query=" + category.id
            })
        })
        ctx.state.userActive = true;
        const userFound = await user.findAll({
            raw: true, nest: true,
            where: {
                mobile: Number(isFullAuth.mobile)
            }
        });
        await ctx.render('personal-details', {
            page: 'personal-details',
            data: data,
            companies: userFound,
            accountant: AccountantFound,
            user: isFullAuth,
            dropdown,
            styles: [
                'reset',
                'styles',
                'tablet',
                'mobile'
            ],
            libs: [
                'common',
                'personal-details'
            ],
            script: {
                Bank_Code: AccountantFound.bankNumber || '',
                Branch_Code: AccountantFound.snifNumber || '',
                Account_Number: AccountantFound.accountNumber || ''
            }
        });
    })
    .get('status', '/status', (ctx) => {
        ctx.status = 200;
        ctx.body = 'ok';
    })
    .patch('/set-status-user-product', async (ctx, next) => {
        const body = ctx.request.body;
        console.log('body', body);
        try {
            const jwtTokenByCookies = ctx.cookies.get('JwtToken');
            // console.log('jwtTokenByCookies', jwtTokenByCookies)
            if (jwtTokenByCookies) {
                const secretKey = await fs.readFile(privateKey);
                const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(decoded.mobile),
                        otpCode: decoded.otpCode,
                        id: Number(decoded.id)
                    }
                });
                if (userFound) {
                    await UserProduct.update(Object.assign(body, {
                        statusChangeDate: new Date(),
                    }), {
                        where: {
                            packId: body.packId
                        }
                    });
                    ctx.status = 200;
                    ctx.body = {
                        status: 200,
                        message_status: 'success'
                    };
                } else {
                    ctx.status = 440;
                    ctx.body = {
                        status: 440,
                        message_status: 'Session expired'
                    };
                }
            } else {
                ctx.status = 500;
                ctx.body = {
                    status: 500,
                    message_status: 'jwtTokenByCookies is missing'
                };
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
            ctx.body = {
                status: 500,
                message_status: e
            };
        }
    })
    .patch('/set-lead-user-product', async (ctx, next) => {
        const body = ctx.request.body;
        try {
            const jwtTokenByCookies = ctx.cookies.get('JwtToken');
            // console.log('jwtTokenByCookies', jwtTokenByCookies)
            if (jwtTokenByCookies) {
                const secretKey = await fs.readFile(privateKey);
                const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(decoded.mobile),
                        otpCode: decoded.otpCode,
                        id: Number(decoded.id)
                    }
                });
                if (userFound) {
                    await UserProduct.upsert({
                        userId: Number(decoded.id),
                        itemId: body['itemId'],
                        packId: body['packId'],
                        status: body['status'],
                        statusChangeDate: new Date(),
                        timeToCall: body['timeToCall'],
                        price: body['price'],
                        accCommission: body['accCommission']
                    });
                    ctx.status = 200;
                    ctx.body = {
                        status: 200,
                        message_status: 'success'
                    };
                } else {
                    ctx.status = 440;
                    ctx.body = {
                        status: 440,
                        message_status: 'Session expired'
                    };
                }
            } else {
                ctx.status = 500;
                ctx.body = {
                    status: 500,
                    message_status: 'jwtTokenByCookies is missing'
                };
            }
        } catch (e) {
            ctx.status = 500;
            ctx.body = {
                status: 500,
                message_status: e
            };
        }
    })
    .get('/token-verify', async (ctx, next) => {
        console.log(ctx.request.header)
        const secretKey = await fs.readFile(privateKey);
        const authorization = ctx.request.header['authorization'];
        if (authorization && authorization.startsWith('Bearer ')) {
            const token = authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, secretKey);
                console.log('decoded', decoded)
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(decoded.mobile),
                        otpCode: decoded.otpCode,
                        id: Number(decoded.id)
                    }
                });
                console.log('userFound', userFound);
                if (userFound === null) {
                    ctx.status = 401;
                    ctx.body = 'Mobile number not found';
                } else {
                    ctx.status = 200;
                    ctx.body = userFound.subDomainLink;
                }
            } catch (err) {
                // err
                console.log('err', err)
                ctx.status = 403;
                ctx.body = err;
            }
        } else {
            ctx.status = 401;
            ctx.body = 'Token not provided';
        }
    })
    .post('/login-otp-sender', async (ctx, next) => {
        const body = ctx.request.body;
        const mobile = body['mobile'];
        if (body && body['mobile']) {
            try {
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(mobile)
                    }
                });
                console.log('userFound-----: ', userFound)
                if (userFound !== null) {
                    const loginErrorsFound = await LoginErrors.findOne({where: {mobile: Number(mobile)}});
                    if (loginErrorsFound && loginErrorsFound.number_of_attempts && loginErrorsFound.number_of_attempts >= 2) {
                        let diff = (new Date(loginErrorsFound.updatedAt).getTime() - new Date().getTime()) / 1000;
                        diff /= 60;
                        if (Math.abs(Math.round(diff)) > 180) {
                            await LoginErrors.destroy(
                                {
                                    where: {
                                        mobile: Number(mobile)
                                    },
                                },
                            );
                        } else {
                            ctx.status = 403;
                            ctx.body = {
                                status: 403,
                                message_status: 'בוצעו 3 ניסיונות כניסה שגויים למספר זה, המספר נחסם. אנא פנה למנהל המערכת.'
                            };
                            return;
                        }
                    }

                    const randomOtpCode = userFound.otpCode ? userFound.otpCode : Math.floor(Math.random() * 90000) + 10000;
                    console.log("randomOtpCode-", randomOtpCode);
                    // await user.upsert({
                    //     mobile: Number(mobile),
                    //     otpCodeTemp: randomOtpCode.toString()
                    // });

                    await user.update(
                        {
                            otpCodeTemp: randomOtpCode.toString()
                        },
                        {
                            where: {
                                mobile: Number(mobile)
                            },
                        },
                    );
                    try {
                        const responseApi = await sendMessages({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": Number(mobile) === 573160437183 ? "+" + Number(mobile) : "+972" + Number(mobile),
                            "type": "template",
                            "template": {
                                "name": "beehive_otp",
                                "language": {
                                    "code": "he"
                                },
                                "components": [
                                    {
                                        "type": "body",
                                        "parameters": [
                                            {
                                                "type": "text",
                                                "text": randomOtpCode.toString()
                                            }
                                        ]
                                    },
                                    {
                                        "type": "button",
                                        "sub_type": "url",
                                        "index": "0",
                                        "parameters": [
                                            {
                                                "type": "text",
                                                "text": randomOtpCode.toString()
                                            }
                                        ]
                                    }
                                ]
                            }
                        })
                        console.log('responseApi: ', responseApi)
                        if (responseApi && responseApi.messages[0].message_status === 'accepted') {
                            ctx.status = 200;
                            ctx.body = {
                                status: 200,
                                message_status: 'accepted'
                            };
                        } else {
                            ctx.status = 500;
                            ctx.body = {
                                status: 500,
                                message_status: 'מספר הטלפון איננו קיים בוואטסאפ'
                            };
                        }
                    } catch (errrr) {
                        console.log(errrr)
                        ctx.status = 500;
                        ctx.body = {
                            status: 500,
                            message_status: errrr
                        };
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 404,
                        message_status: 'הטלפון שלך לא מוכר לנו, פנה בבקשה לרואה החשבון שלך'
                    };
                }
            } catch (e) {
                console.log('errorDB: ', e)
                ctx.status = 500;
                ctx.body = {
                    status: 500,
                    message_status: e
                };
            }
        } else {
            ctx.status = 500;
            ctx.body = {
                status: 500,
                message_status: 'mobile field is missing'
            };
        }
    })
    .patch('/login-otp-auth', async (ctx, next) => {
        const body = ctx.request.body;
        const secretKey = await fs.readFile(privateKey);
        const mobile = body['mobile'];
        const otpCode = body['otpCode'];
        try {
            const userFound = await user.findOne({where: {mobile: Number(mobile)}});
            const userFindAll = await user.findAll({where: {mobile: Number(mobile)}});
            const loginErrorsFound = await LoginErrors.findOne({where: {mobile: Number(mobile)}});
            console.log('loginErrorsFound: ', loginErrorsFound);
            if (loginErrorsFound) {
                console.log('number_of_attempts: ', loginErrorsFound.number_of_attempts);
            }
            if (loginErrorsFound && loginErrorsFound.number_of_attempts && loginErrorsFound.number_of_attempts >= 2) {
                let diff = (new Date(loginErrorsFound.updatedAt).getTime() - new Date().getTime()) / 1000;
                diff /= 60;
                if (Math.abs(Math.round(diff)) > 180) {
                    await LoginErrors.destroy(
                        {
                            where: {
                                mobile: Number(mobile)
                            },
                        },
                    );
                } else {
                    ctx.status = 403;
                    ctx.body = {
                        status: 403,
                        message_status: 'בוצעו 3 ניסיונות כניסה שגויים למספר זה, המספר נחסם. אנא פנה למנהל המערכת.'
                    };
                    return;
                }
            }
            if (userFound !== null) {
                if (userFound.otpCodeTemp === otpCode) {
                    if (loginErrorsFound) {
                        await LoginErrors.update(
                            {
                                number_of_attempts: null,
                            },
                            {
                                where: {
                                    mobile: Number(mobile)
                                },
                            },
                        );
                    }
                    if (userFindAll.length === 1) {
                        const token = jwt.sign({
                            mobile: Number(mobile),
                            otpCode: otpCode,
                            id: Number(userFound.id)
                        }, secretKey, {algorithm: 'RS256'});
                        console.log('token', token)
                        // await user.upsert({
                        //     mobile: Number(mobile),
                        //     otpCode: otpCode.toString(),
                        //     lastWebsiteLogin: new Date()
                        // });
                        await user.update(
                            {
                                otpCode: otpCode.toString(),
                                lastWebsiteLogin: new Date()
                            },
                            {
                                where: {
                                    mobile: Number(mobile),
                                    id: Number(userFound.id)
                                },
                            },
                        );

                        ctx.status = 200;
                        ctx.cookies.set('JwtToken', token, {
                            httpOnly: false,
                            domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                        });
                        ctx.body = {
                            status: 200,
                            token: token,
                            subDomainLink: userFound.subDomainLink
                        };
                    } else {
                        ctx.status = 200;
                        ctx.body = {
                            status: 200,
                            firstName: userFound.firstName,
                            companies: userFindAll.map((user) => {
                                return {
                                    companyName: user.companyName,
                                    companyHP: user.companyHP,
                                    id: user.id,
                                }
                            })
                        };
                    }
                } else {
                    const number_of_attempts = loginErrorsFound && loginErrorsFound.number_of_attempts ? (Number(loginErrorsFound.number_of_attempts) + 1) : 1;
                    await LoginErrors.upsert({
                        mobile: Number(mobile),
                        number_of_attempts: number_of_attempts,
                        ip: ctx.ip
                    })
                    ctx.status = 401;
                    ctx.body = {
                        status: 401,
                        message_status: 'הקוד איננו תואם לקוד שנשלח, נותרו עוד ' +
                            (3 - number_of_attempts) +
                            ' ניסיונות'
                    };
                }

            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 404,
                    message_status: 'mobile number not exist'
                };
            }
        } catch (e) {
            ctx.body = {
                status: 500,
                message_status: e
            };
        }
    })
    .patch('/login-set-company', async (ctx, next) => {
        const body = ctx.request.body;
        const secretKey = await fs.readFile(privateKey);
        const id = body['id'];
        try {
            const userFound = await user.findOne({where: {id: Number(id)}});
            if (userFound !== null) {
                const token = jwt.sign({
                    mobile: Number(userFound.mobile),
                    otpCode: userFound.otpCodeTemp,
                    id: Number(userFound.id)
                }, secretKey, {algorithm: 'RS256'});
                console.log('token', token)
                await user.update(
                    {
                        otpCode: userFound.otpCodeTemp.toString(),
                    },
                    {
                        where: {
                            mobile: Number(userFound.mobile),
                        },
                    },
                );
                await user.update(
                    {
                        otpCode: userFound.otpCodeTemp.toString(),
                        lastWebsiteLogin: new Date()
                    },
                    {
                        where: {
                            mobile: Number(userFound.mobile),
                            id: Number(userFound.id)
                        },
                    },
                );

                ctx.status = 200;
                ctx.cookies.set('JwtToken', token, {
                    httpOnly: false,
                    domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                });
                ctx.body = {
                    status: 200,
                    token: token,
                    subDomainLink: userFound.subDomainLink
                };
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 404,
                    message_status: 'mobile number not exist'
                };
            }
        } catch (e) {
            ctx.body = {
                status: 500,
                message_status: e
            };
        }
    })
    .get('/logout', async (ctx, next) => {
        ctx.state = ctx.state || {};
        ctx.state.userActive = true;
        const secretKey = await fs.readFile(privateKey);
        const jwtTokenByCookies = ctx.cookies.get('JwtToken');
        ctx.cookies.set('JwtToken', '', {
            httpOnly: false,
            domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
        });
        if (jwtTokenByCookies) {
            try {
                const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                console.log('decoded logout', decoded)
                const userFound = await user.findOne({
                    where: {
                        mobile: Number(decoded.mobile),
                        otpCode: decoded.otpCode,
                        id: Number(decoded.id),
                    }
                });
                console.log('userFound', userFound);
                if (userFound !== null) {
                    await user.update(
                        {
                            otpCode: null,
                            otpCodeTemp: null,
                        },
                        {
                            where: {
                                mobile: Number(decoded.mobile)
                            },
                        },
                    );
                    ctx.status = 200;
                }
            } catch (err) {
                // err
                console.log('err', err)
                ctx.status = 403;
            }

            if (ctx.state.subdomain) {
                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                ctx.redirect(mainPath);
                ctx.status = 301;
            } else {
                ctx.redirect('/');
                ctx.status = 301;
            }
        }
    })
    .post('/upload', upload.single('photo'), async (ctx) => {
        try {
            const file_type = ctx.request.header.type;
            if (file_type) {
                console.log('ctx.request.header', ctx.request.header.type)
                console.log('ctx.request: ')
                console.log(ctx.request.file)
                const secretKey = await fs.readFile(privateKey);
                const jwtTokenByCookies = ctx.cookies.get('JwtToken');
                if (jwtTokenByCookies) {
                    try {
                        const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                        console.log('decoded', decoded)
                        const userFound = await user.findOne({
                            where: {
                                mobile: Number(decoded.mobile),
                                otpCode: decoded.otpCode,
                                id: Number(decoded.id)
                            }
                        });
                        console.log('userFound', userFound);
                        if (userFound === null) {
                            ctx.status = 401;
                            ctx.body = {
                                status: 401,
                                body: 'User not found'
                            };
                        } else {
                            const req = ctx.request;
                            if (!req.file) {
                                ctx.status = 400;

                                ctx.body = {
                                    status: 400,
                                    body: 'No file uploaded.'
                                };
                                return;
                            }
                            const {mimetype} = ctx.request.file;
                            if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
                                let subdomain = null;
                                if (ctx.subdomains && ctx.subdomains.length > 0) {
                                    subdomain = ctx.subdomains[ctx.subdomains.length - 1];
                                    console.log('subdomain:', subdomain);
                                    if (subdomain === 'www') {
                                        subdomain = null;
                                    }
                                }
                                if (subdomain) {
                                    let userData;
                                    if (userFound.userType === "customer" && ctx.request.header.id) {
                                        userData = await user.findOne({
                                            where: {
                                                id: Number(ctx.request.header.id)
                                            }
                                        });
                                    }
                                    try {
                                        let nameCurrentFile;
                                        if (userFound.userType === "customer") {
                                            nameCurrentFile = userData[file_type] ? userData[file_type].toString().split(`https://storage.googleapis.com/${bucket.name}/`)[1] : null;
                                            console.log('nameCurrentFile', nameCurrentFile);
                                        }
                                        if (userFound.userType === "accountant") {
                                            const AccountantFound = await Accountants.findOne({where: {subDomainName: userFound.subDomainLink}})
                                            nameCurrentFile = AccountantFound[file_type] ? AccountantFound[file_type].toString().split(`https://storage.googleapis.com/${bucket.name}/`)[1] : null;
                                            console.log('nameCurrentFile', nameCurrentFile);
                                        }
                                        if (nameCurrentFile) {
                                            await bucket.file(nameCurrentFile).delete({
                                                ignoreNotFound: true,
                                            });
                                            console.log(`gs://${bucket.name}/${nameCurrentFile} deleted`);
                                        }
                                    } catch (e) {
                                        console.log('delete photo', e)
                                    }

                                    const blob = bucket.file(req.file.originalname);
                                    console.log('blob', '------')
                                    const uploadFileRes = await uploadFile(blob, req.file.buffer, bucket);
                                    console.log('uploadFileRes', uploadFileRes)
                                    if (uploadFileRes.status === 200) {
                                        const param = {}
                                        if (file_type === 'mainPicture') {
                                            param.mainPicture = uploadFileRes.body;
                                        }
                                        if (file_type === 'signaturePicture') {
                                            param.signaturePicture = uploadFileRes.body;
                                        }
                                        if (file_type === 'logoName') {
                                            param.logoName = uploadFileRes.body;
                                        }
                                        if (userFound.userType === "customer") {
                                            await user.update(param, {
                                                where: {
                                                    id: Number(userData.id)
                                                }
                                            });
                                        }
                                        if (userFound.userType === "accountant") {
                                            await Accountants.update(param, {
                                                where: {
                                                    subDomainName: userFound.subDomainLink
                                                }
                                            });
                                        }
                                    }
                                    ctx.status = uploadFileRes.status;
                                    ctx.body = uploadFileRes;
                                }
                            } else {
                                ctx.status = 500;
                                ctx.body = {
                                    status: 500,
                                    body: 'Wrong mimetype'
                                };
                            }
                        }
                    } catch (err) {
                        console.log('err', err)
                        ctx.status = 403;
                        ctx.body = {
                            status: 403,
                            body: err
                        };
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        status: 401,
                        body: 'Token not provided'
                    };
                }
            } else {
                ctx.status = 500;
                ctx.body = {
                    status: 500,
                    body: "Missing type of file"
                };
            }

        } catch (err) {
            ctx.status = 500;
            console.log(`error ${err.message}`)
            ctx.body = {
                status: 500,
                body: err.message
            };
        }
    })
    .post('/updates-user-accountants', async (ctx, next) => {
        try {
            const body = ctx.request.body;
            console.log('body', body);
            if (body) {
                const secretKey = await fs.readFile(privateKey);
                const jwtTokenByCookies = ctx.cookies.get('JwtToken');
                if (jwtTokenByCookies) {
                    try {
                        const decoded = jwt.verify(jwtTokenByCookies, secretKey);
                        console.log('decoded', decoded)
                        const userFound = await user.findOne({
                            where: {
                                mobile: Number(decoded.mobile),
                                otpCode: decoded.otpCode,
                                id: Number(decoded.id)
                            }
                        });
                        console.log('userFound', userFound);

                        if (userFound === null) {
                            ctx.status = 401;
                            ctx.body = {
                                status: 401,
                                body: 'User not found'
                            };
                        } else {
                            if (userFound.userType === "accountant") {
                                console.log('userFound----id--------:', userFound.id);

                                if (body.accountants) {
                                    console.log('-------------accountant-----', body.accountants)
                                    await Accountants.update(body.accountants, {
                                        where: {
                                            subDomainName: userFound.subDomainLink
                                        }
                                    });
                                }
                                if (body.user) {
                                    console.log('-------------user-----', body.user)
                                    await user.update(body.user, {
                                        where: {
                                            id: Number(decoded.id)
                                        }
                                    });
                                }
                            }
                            if (userFound.userType === "customer" && ctx.request.header.id) {
                                console.log('userFound----id--------:', ctx.request.header.id);
                                await user.update(body.user, {
                                    where: {
                                        id: Number(ctx.request.header.id)
                                    }
                                });
                            }

                            ctx.status = 200;
                            ctx.body = {
                                status: 200,
                                body: 'success'
                            };
                        }
                    } catch (err) {
                        console.log('err', err)
                        ctx.status = 403;
                        ctx.body = {
                            status: 403,
                            body: err
                        };
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        status: 401,
                        body: 'Token not provided'
                    };
                }
            } else {
                ctx.status = 500;
                ctx.body = {
                    status: 500,
                    body: "Missing type of file"
                };
            }

        } catch (err) {
            ctx.status = 500;
            console.log(`error ${err.message}`)
            ctx.body = {
                status: 500,
                body: err.message
            };
        }
    })


module.exports = router;
