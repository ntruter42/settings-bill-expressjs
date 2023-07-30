export default function SettingsBill() {

	let smsCost;
	let callCost;
	let warningLevel;
	let criticalLevel;

	let actionList = [];

	function setSettings(settings) {
		if (!Object.values(settings).some(value => value <= 0)) {
			smsCost = Number(settings.smsCost);
			callCost = Number(settings.callCost);
			warningLevel = settings.warningLevel;
			criticalLevel = settings.criticalLevel;
		}
	}

	function getSettings() {
		return {
			smsCost,
			callCost,
			warningLevel,
			criticalLevel
		}
	}

	function recordAction(action) {
		let cost = 0;
		if (action && !hasReachedCriticalLevel() && Object.values(getSettings()).every(value => value > 0)) {

			if (action === 'sms') {
				cost = smsCost;
			}
			else if (action === 'call') {
				cost = callCost;
			}
		}

		actionList.push({
			type: action,
			cost,
			time: new Date()
		});
	}

	function actions() {
		return actionList.filter((action) => action.cost > 0);
	}

	function actionsFor(type) {
		return actionList.filter((action) => action.cost > 0 && action.type === type);
	}

	function lastAction() {
		if (actionList.length > 0) {
			return actionList[actionList.length - 1].type;
		} else {
			return '';
		}
	}

	function getTotal(type) {
		return actionList.reduce((total, action) => {
			let val = action.type === type ? action.cost : 0;
			return total + val;
		}, 0);
	}

	function grandTotal() {
		return getTotal('sms') + getTotal('call');
	}

	function totals() {
		let smsTotal = getTotal('sms').toFixed(2);
		let callTotal = getTotal('call').toFixed(2);
		return {
			smsTotal,
			callTotal,
			grandTotal: grandTotal().toFixed(2)
		}
	}

	function totalClass() {
		return getClassName();
	}

	function getClassName() {
		if (hasReachedWarningLevel()) {
			return 'warning';
		} else if (hasReachedCriticalLevel()) {
			return 'danger';
		}
	}

	function hasReachedWarningLevel() {
		const total = grandTotal();
		const reachedWarningLevel = total >= warningLevel
			&& total < criticalLevel;

		return reachedWarningLevel;
	}

	function hasReachedCriticalLevel() {
		const total = grandTotal();
		return total >= criticalLevel;
	}

	return {
		setSettings,
		getSettings,
		recordAction,
		actions,
		actionsFor,
		lastAction,
		getTotal,
		grandTotal,
		totals,
		totalClass,
		hasReachedWarningLevel,
		hasReachedCriticalLevel
	}
}