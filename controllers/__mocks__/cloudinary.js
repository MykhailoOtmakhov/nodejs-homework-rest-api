module.exports.v2 = {
    config: () => { },
    uploader: {
        upload: (path, options, cb) => {
            cb(null, {
                public_id: 123123,
                secure_url: 'secure_url_cloudinary'
            })
        }
    }
}

