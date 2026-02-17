import multer from 'multer'

// Configuring disk storage (Where to store the file)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads') // Error-first callback format
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

// Filtering file types
const fileFilter = (req, file, cb) => {
    // The 'file' object has a property called 'mimetype'
    // Examples: 'image/jpeg', 'image/png', 'application/pdf'
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")     {
        cb(null, true)
    }else {
        cb(new Error("Invalid file type"), false)
    }

}

const upload = multer({storage, fileFilter})

export default upload