import multer from 'multer';

export const upload = multer({ dest: 'uploads/' });

export const parseForm = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) reject(err);
            resolve(req);
        });
    });
};
