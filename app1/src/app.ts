import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as path from 'path';
import * as render from 'koa-ejs';
import * as bodyParser from 'koa-bodyparser';
import * as mongoose from 'mongoose';
import { IApplicantHistoryDocument, SCREENING_STATUS, INTERVIEW_STATUS, OFFER_STATUS } from '@/interface/ApplicantHistory';
import { IApplicantEngageDocument } from '@/interface/ApplicantEngage';

const router = new Router();
const app = new Koa();
var ObjectId = mongoose.Types.ObjectId;
//replace with DB
mongoose.connect(
	'mongodb://namhbnam:namhbnam1@ds131932.mlab.com:31932/heroku_xncl9mdz',
	{ useNewUrlParser: true }
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('db connected');
});

//create mongoose.Schema
const TestSchema = new mongoose.Schema({ data: { type: String, required: true } });

//create model
const Test = mongoose.model('Test', TestSchema);
mongoose.set('debug', true);

const applicantEngageSchema = new mongoose.Schema(
	{
		historyId: {
			required: [true, 'Chưa có ứng viên'],
			type: mongoose.Schema.Types.ObjectId
		},
		userId: {
			required: [true, 'Chưa có người tư vấn'],
			type: mongoose.Schema.Types.ObjectId
		},
		method: {
			required: [true, 'Chưa có hình thức tư vấn'],
			type: String
		},
		content: {
			required: [true, 'Chưa có nội dung tư vấn'],
			type: String
		},
		note: String,
		ihrNote: String
	},
	{
		timestamps: true
	}
);
const ApplicantHistorySchema = new mongoose.Schema(
	{
		_id: {
			required: true,
			type: mongoose.Schema.Types.ObjectId
		},
		applicantId: {
			required: true,
			type: mongoose.Schema.Types.ObjectId
		},
		company: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		interviewDate: {
			type: Date
		},
		screeningStatus: {
			trim: true,
			lowercase: true,
			type: String,
			required: false,
			default: '',
			validate: value => inStatus(SCREENING_STATUS, value)
		},
		interviewStatus: {
			trim: true,
			lowercase: true,
			required: false,
			type: String,
			default: '',
			validate: value => inStatus(INTERVIEW_STATUS, value)
		},
		offerStatus: {
			default: '',
			type: String,
			trim: true,
			lowercase: true,
			required: false,
			validate: value => inStatus(OFFER_STATUS, value)
		},
		screeningNote: String,
		interviewNote: String,
		offerNote: String,
		note: String
	},
	{
		timestamps: true
	}
);
var ApplicantEngage = mongoose.model<IApplicantEngageDocument>('ApplicantEngage', applicantEngageSchema, 'applicant_engages');
var ApplicantHistory = mongoose.model<IApplicantHistoryDocument>('ApplicantHistory', ApplicantHistorySchema, 'applicant_history');

// applicantEngage.create([
// 	{ historyId: '5b8511643c9b7a22216092b6', userId: '5b8511643c9b7a22216092b6', method: 'nam3', content: 'adads', note: 'sad', ihrNote: 'asda' }
// ]);
applicantEngageSchema.virtual('history', {
	ref: 'ApplicantHistory',
	localField: 'historyId',
	foreignField: '_id',
	justOne: true
});
ApplicantHistorySchema.virtual('listEngage', {
	ref: 'ApplicantEngage',
	localField: '_id',
	foreignField: 'historyId'
});

const things = ['My Family', 'Programing', 'Music'];
render(app, {
	root: path.join(__dirname, 'views'),
	layout: 'layout',
	viewExt: 'html',
	cache: false,
	debug: false
});

//Bodyparser Middleware
app.use(bodyParser());
//add additional properties to context

//Router
router.get('/', index);
router.get('/add', showAdd);
router.post('/add', add);
// routesr.get('/test', test);
// router.get('/test/:name', testName);

router.get('/test', async ctx => {
	try {
		const listEngage = await ApplicantHistory.find({ _id: new ObjectId('5b8511643c9b7a22216092b6') })
			.populate('listEngage')
			.lean();
		const listHistory = await ApplicantEngage.find({ _id: new ObjectId('5bbc1d6a99554a2587a31628') })
			.populate('history')
			.lean();
		ctx.body = { listEngage, listHistory };
		// console.log(test[0].listEngage);
	} catch (error) {
		console.log(error);
	}
});

//Controller
async function index(ctx) {
	await ctx.render('index', { title: 'Things I Love', things: things });
}
async function showAdd(ctx) {
	await ctx.render('add');
}
async function add(ctx) {
	ctx.body = ctx.request.body;
	things.push(ctx.body.thing);

	ctx.redirect('/');
}
async function test(ctx) {
	ctx.body = `Hello ${ctx.user}`;
}
async function testName(ctx) {
	ctx.body = `Hello ${ctx.params.name}`;
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
function inStatus(mapStatus: object, value: string) {
	return Object.values(mapStatus).indexOf(value.trim().toLowerCase()) > -1;
}
