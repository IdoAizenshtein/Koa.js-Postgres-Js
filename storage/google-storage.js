const {format} = require("util");
require('dotenv').config();

async function uploadFile(blob, buffer, bucket) {
    return new Promise(async (resolve, reject) => {
        try {
            const blobStream = blob.createWriteStream({
                resumable: false
            });
            blobStream.on('error', err => {
                console.log('blob error', '------')
                console.log('error', err);
                resolve({
                    status: 500,
                    body: err,
                })
            });
            blobStream.on('finish', () => {
                console.log('blob finish', '------')

                // The public URL can be used to directly access the file via HTTP.
                const publicUrl = format(
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                );
                console.log('blob finish', publicUrl)
                resolve({
                    status: 200,
                    body: publicUrl,
                })
            });
            blobStream.end(buffer);
        } catch (err) {
            resolve({
                status: 500,
                body: err,
            })
        }
    })
}

module.exports = {uploadFile};
