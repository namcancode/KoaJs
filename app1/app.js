const Koa = require('koa');
const json = require('koa-json');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');

const router = new Router();
const app = new Koa();

//replace with DB
const things = ['My Family', 'Programing', 'Music'];
render(app, {
	root: path.join(__dirname, 'views'),
	layout: 'layout',
	viewExt: 'html',
	cache: false,
	debug: false
});

//Bodyparser Middleware
app.use(bodyParser())
//add additional properties to context
app.context.user = "context"



//Router
router.get('/', index);
router.get('/add', showAdd)
router.post('/add', add)
router.get('/test', test)
router.get('/test/:name', testName)

//Controller
async function index(ctx) {
	await ctx.render('index', { title: 'Things I Love', things: things });
}
async function showAdd(ctx) {
	await ctx.render('add')
}
async function add(ctx) {
	ctx.body = ctx.request.body;
	things.push(ctx.body.thing);
	ctx.redirect('/')
}
async function test(ctx) {
	ctx.body = `Hello ${ctx.user}`
}
async function testName(ctx) {
	ctx.body = `Hello ${ctx.params.name}`
}


//router example
// router.get('/test', ctx => {
// 	ctx.body = { msg: 'Hello test 2' };
// });

//Router Middleware
app.use(router.routes()).use(router.allowedMethods());

//simple Miidleware Example
// app.use(async ctx => {
// 	ctx.body = { msg: 'Hello world' };
// });

//json prettier Middleware
// app.use(json());

app.listen(3000, () => {
	console.log('Sever running on Port: 3000');
});
