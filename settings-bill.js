export default function SettingsBill() {

	let smsCost;
	let callCost;
	let warningLevel;
	let criticalLevel;

	let actionList = [];

	function setSettings(settings) {
		smsCost = Number(settings.smsCost);
		callCost = Number(settings.callCost);
		warningLevel = settings.warningLevel;
		criticalLevel = settings.criticalLevel;
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
		if (action === 'sms') {
			cost = smsCost;
		}
		else if (action === 'call') {
			cost = callCost;
		}

		if (action && !hasReachedCriticalLevel()) {
			actionList.push({
				type: action,
				cost,
				timestamp: new Date(),
				relative: ''
			});
		}
	}

	function actions() {
		return actionList;
	}

	function actionsFor(type) {
		const filteredActions = [];

		for (let index = 0; index < actionList.length; index++) {
			const action = actionList[index];
			if (action.type === type) {
				filteredActions.push(action);
			}
		}

		return filteredActions;

		// return actionList.filter((action) => action.type === type);
	}

	function getTotal(type) {
		let total = 0;
		for (let index = 0; index < actionList.length; index++) {
			const action = actionList[index];
			if (action.type === type) {
				total += action.cost;
			}
		}
		return total;

		// return actionList.reduce((total, action) => { 
		//     let val = action.type === type ? action.cost : 0;
		//     return total + val;
		// }, 0);
	}

	function grandTotal() {
		return getTotal('sms') + getTotal('call');
	}

	function totals() {
		let smsTotal = getTotal('sms')
		let callTotal = getTotal('call')
		return {
			smsTotal,
			callTotal,
			grandTotal: grandTotal()
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
		getTotal,
		grandTotal,
		totals,
		totalClass,
		hasReachedWarningLevel,
		hasReachedCriticalLevel
	}
}