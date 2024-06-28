class BudgetCalculator {
    constructor(spendingSeconds, task, project, client) {
        this.spendingSeconds = spendingSeconds;
        this.task = task;
        this.project = project;
        this.client = client;

        let hourRate = project?.hourRate ? project.hourRate : (client?.hourRate ? client.hourRate : 0)
        this.hourRate = parseFloat(hourRate);

        let hourBudget = task?.hourBudget ? task.hourBudget : (project?.hourBudget ? project.hourBudget : 0)
        this.hourBudget = parseFloat(hourBudget);
    }

    calculareForInvoincing()
    {
        let minutes = this.spendingSeconds / 60// - this.spendingSeconds % 60
        let hours = minutes/60;
        return hours*this.hourRate;
    }

    calculareForInvoincingNicely(currency)
    {
        let forInvoicing = this.calculareForInvoincing();
        return this._numberFormat(forInvoicing,0, ".", " ")+" " + currency;
    }

    calculareSpendingHoursNicely() {
        return this._formatTimeNicely(this.spendingSeconds);
    }

    budgetHoursNicely() {
        return this._formatTimeNicely(this.hourBudget * 60 * 60);
    }

    calculateLeftHoursBudgetNicely() {
        if (this.hourBudget === 0) {
            return "00:00";
        }
        let leftSeconds = this.hourBudget * 60 * 60 - this.spendingSeconds;

        return this._formatTimeNicely(leftSeconds);
    }

    _formatTimeNicely(seconds) {
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        minutes = minutes % 60;

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return hours + ":" + minutes;
    }

    _numberFormat (number, decimals, dec_point, thousands_sep) {
        // Strip all characters but numerical ones.
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
}

export default BudgetCalculator;