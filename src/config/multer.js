import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadvideo = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  videoFilter,
});

const uploadimage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  imageFilter,
});

export { uploadimage, uploadvideo };
