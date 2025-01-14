const {promises: fs} = require("fs");
const jwt = require("jsonwebtoken");
const user = require("../models/user.models");
const path = require("path");
const process = require("process");
const privateKey = path.join(process.cwd(), 'jwt/private_key.pem');
require('dotenv').config();

async function manageAuth(ctx, path) {
    return new Promise(async (resolve, reject) => {
        try {
            const jwtTokenByCookies = ctx.cookies.get('JwtToken');
            console.log('jwtTokenByCookies1111', jwtTokenByCookies)
            if (jwtTokenByCookies) {
                try {
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
                    if (userFound === null) {
                        ctx.cookies.set('JwtToken', '', {
                            httpOnly: false,
                            domain: (ctx.request.hostname.match(/[^\.]*\.[^.]*$/)[0])
                        });

                        if (ctx.state.subdomain) {
                            const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                            ctx.redirect(mainPath);
                            ctx.status = 301;
                            resolve(false)

                        } else {
                            ctx.redirect('/');
                            ctx.status = 301;
                            resolve(false)

                        }
                    } else {
                        if (userFound.subDomainLink === ctx.state.subdomain) {
                            ctx.status = 301;
                            resolve(userFound)
                        } else {
                            if (ctx.state.subdomain) {
                                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', userFound.subDomainLink + '.');
                                ctx.redirect(mainPath + path);
                                ctx.status = 301;
                                resolve(false)

                            } else {
                                const mainPath = ctx.request.protocol + '://' + userFound.subDomainLink + '.' + ctx.request.origin.split('://')[1];
                                ctx.redirect(mainPath + path);
                                ctx.status = 301;
                                resolve(false)

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
                        resolve(false)

                    } else {
                        ctx.redirect('/');
                        ctx.status = 301;
                        resolve(false)
                    }
                }
            } else {
                if (ctx.state.subdomain) {
                    const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                    ctx.redirect(mainPath);
                    ctx.status = 301;
                    resolve(false)

                } else {
                    ctx.redirect('/');
                    ctx.status = 301;
                    resolve(false)

                }
            }
        } catch (err) {
            console.log(err)
            if (ctx.state.subdomain) {
                const mainPath = ctx.request.origin.replace(ctx.state.subdomain + '.', '');
                ctx.redirect(mainPath);
                ctx.status = 301;
            } else {
                ctx.redirect('/');
                ctx.status = 301;
            }
            resolve(false)

        }
    })
}

module.exports = {manageAuth};
