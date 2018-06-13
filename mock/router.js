const Router = require('koa-router');
const multer = require('koa-multer');
const path = require('path');

const router = new Router();

const BASE_URL = '/api/mock';
const LATENCY = 3000;
const AUTH_TOKEN = 'THIS_IS_A_TEST_TOKEN_CONSTANT';

// [GET] for latency
router.get(`${BASE_URL}`, async (ctx) => {
  try {
    ctx.body = {
      status: 'success',
      data: await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: AUTH_TOKEN,
          });
        }, LATENCY);
      }),
    };
  } catch (err) {
    console.log(err);
  }
});

// [POST] for auth token and latency
router.post(`${BASE_URL}`, async (ctx) => {
  if (ctx.request.header.authorization === AUTH_TOKEN) {
    try {
      ctx.body = {
        status: 'success',
        data: await new Promise((resolve) => {
          setTimeout(() => {
            resolve(ctx.request.body);
          }, LATENCY);
        }),
      };
    } catch (err) {
      console.log(err);
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      data: {
        msg: 'permission deny',
      },
    };
  }
});


const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename(req, file, cb) {
      const fileFormat = (file.originalname).split('.');
      cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);
    },
  }),
});

router.post(`${BASE_URL}/file`, upload.single('file'), async (ctx) => {
  ctx.body = {
    status: 'success',
    data: {
      filename: await new Promise((resolve) => {
        setTimeout(() => {
          resolve(ctx.req.file.filename);
        }, LATENCY);
      }),
    }
  };
});

module.exports = router;
