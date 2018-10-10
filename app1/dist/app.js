"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const ApplicantHistory_1 = require("@/interface/ApplicantHistory");
const router = new Router();
const app = new Koa();
var ObjectId = mongoose.Schema.Types.ObjectId;
//replace with DB
mongoose.connect('mongodb://namhbnam:namhbnam1@ds131932.mlab.com:31932/heroku_xncl9mdz', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
});
//create mongoose.Schema
const TestSchema = new mongoose.Schema({ data: { type: String, required: true } });
//create model
const Test = mongoose.model('Test', TestSchema);
mongoose.set('debug', true);
const applicantEngageSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
const ApplicantHistorySchema = new mongoose.Schema({
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
        validate: value => inStatus(ApplicantHistory_1.SCREENING_STATUS, value)
    },
    interviewStatus: {
        trim: true,
        lowercase: true,
        required: false,
        type: String,
        default: '',
        validate: value => inStatus(ApplicantHistory_1.INTERVIEW_STATUS, value)
    },
    offerStatus: {
        default: '',
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        validate: value => inStatus(ApplicantHistory_1.OFFER_STATUS, value)
    },
    screeningNote: String,
    interviewNote: String,
    offerNote: String,
    note: String
}, {
    timestamps: true
});
var ApplicantEngage = mongoose.model('ApplicantEngage', applicantEngageSchema, 'applicant_engages');
var ApplicantHistory = mongoose.model('ApplicantHistory', ApplicantHistorySchema, 'applicant_history');
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
router.get('/test', (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        const test = yield ApplicantHistory.find({ _id: new ObjectId('5b8511643c9b7a22216092b6') })
            .populate('listEngage')
            .lean();
        ctx.body = { value: test };
    }
    catch (error) {
        console.log(error);
    }
}));
//Controller
function index(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.render('index', { title: 'Things I Love', things: things });
    });
}
function showAdd(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.render('add');
    });
}
function add(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.body = ctx.request.body;
        things.push(ctx.body.thing);
        ctx.redirect('/');
    });
}
function test(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.body = `Hello ${ctx.user}`;
    });
}
function testName(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.body = `Hello ${ctx.params.name}`;
    });
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
function inStatus(mapStatus, value) {
    return Object.values(mapStatus).indexOf(value.trim().toLowerCase()) > -1;
}
//# sourceMappingURL=app.js.map