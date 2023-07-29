import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js';
import moment from "moment";

const app = express();
const settingsBill = SettingsBill();

app.engine('handlebars', engine({
	viewPath: './views',
	layoutsDir: './views/layouts',
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.render('index', {
		'settings': settingsBill.getSettings(),
		'totals': settingsBill.totals(),
		'totalClass': settingsBill.totalClass()
	});
});

app.post('/settings', function (req, res) {
	settingsBill.setSettings({
		callCost: req.body.callCost,
		smsCost: req.body.smsCost,
		warningLevel: req.body.warningLevel,
		criticalLevel: req.body.criticalLevel
	});

	res.redirect('/');
});

app.post('/action', function (req, res) {
	settingsBill.recordAction(req.body.actionType);
	res.redirect('/');
});

app.get('/actions', function (req, res) {
	res.render('actions', {
		'actions': settingsBill.actions().map(action => {
			action.relative = moment(action.timestamp).startOf('second').fromNow();
			return action;
		}),
		'total': settingsBill.grandTotal()
	});
});

app.get('/actions/:type', function (req, res) {
	const actionType = req.params.type;
	res.render('actions', {
		'actions': settingsBill.actionsFor(actionType),
		'total': settingsBill.getTotal(actionType)
	});
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, function () {
	console.log(`App started on PORT: ${PORT}`);
});