const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const chalk = require('chalk');
const router = require('./router');

const PORT = process.env.PORT || 3000;

const uploadPath = path.join(__dirname, 'uploads');
const isExist = fs.existsSync(uploadPath);
if (isExist) {
  fs.unlinkSync(uploadPath);
}
fs.mkdirSync(uploadPath);

const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(require('koa-static')(uploadPath));

const server = app.listen(PORT, () => {
  console.log(chalk.green(`Server listening on port: ${PORT}`));
});

module.exports = server;
