const STORED_RECORDS_STORAGE_KEY = 'records';
const STORED_MONEY_STATS_KEY = 'moneyStats';
const DEFAULT_RECORDS = [];
const DEFAULT_ACTIONS = [];
const DEFAULT_MONEY_STATS = {
    wasted: 0,
    available: 0,
    earned: 0
};

function Action (name, description, price) {
    return {
        name: name,
        description: description,
        price: price
    };
}

export class Record {
    constructor(date = new Date(), actions = DEFAULT_ACTIONS, moneyStats = DEFAULT_MONEY_STATS) {
        this.date = new Date(date);
        this.moneyStats = moneyStats;
        this.actions = actions;
    }

    pushAction(name, description, price) {
        this.moneyStats.available += price;
        if (price < 0) {
            this.moneyStats.wasted -= price;
        } else {
            this.moneyStats.earned += price;
        }

        this.actions = [...this.actions, new Action(name, description, price)];
    }

    getDate() {
        return new Date(this.date);
    }

    getDateString() {
        return [
            this.date.getDate(),
            this.date.getMonth() + 1,
            this.date.getFullYear()
        ].join('.');
    }

    getMoneyStats() {
        return this.moneyStats;
    }

    getActions() {
        return [...this.actions];
    }
}

export class HistoryService {
    constructor() {
        this.moneyStats = this.getStoredMoneyStats();
        this.records = this.getStoredRecords();
    }

    getStoredRecords() {
        let storedRecords = JSON.parse(localStorage.getItem(STORED_RECORDS_STORAGE_KEY));
        if (!storedRecords) {
            this.updateStoredRecords(DEFAULT_RECORDS);
            storedRecords = DEFAULT_RECORDS;
        }
        return storedRecords.map(({ date, actions, moneyStats }) => new Record(date, actions, moneyStats));
    }

    getStoredMoneyStats() {
        let storedMoneyStats = JSON.parse(localStorage.getItem(STORED_MONEY_STATS_KEY));
        if (!storedMoneyStats) {
            this.updateStoredMoneyStats(DEFAULT_MONEY_STATS);
            storedMoneyStats = DEFAULT_MONEY_STATS;
        }
        return storedMoneyStats;
    }

    updateStoredRecords(records) {
        localStorage.setItem(STORED_RECORDS_STORAGE_KEY, JSON.stringify(records));
    }

    updateStoredMoneyStats(moneyStats) {
        localStorage.setItem(STORED_MONEY_STATS_KEY, JSON.stringify(moneyStats));
    }

    getRecords() {
        return [...this.records];
    }

    getMoneyStats() {
        return this.moneyStats;
    }

    getLastRecord() {
        return this.records[this.records.length - 1];
    }

    isLastRecordOutdated() {
        if (this.records.length === 0) {
            return true;
        }
        const lastRecordDate = this.getLastRecord().getDate();
        const currentDate = new Date();

        const lastRecordDateDayMonth = lastRecordDate.getDate() + lastRecordDate.getMonth();
        const currentDateDayMonth = currentDate.getDate() + currentDate.getMonth();

        return lastRecordDateDayMonth !== currentDateDayMonth;
    }

    pushRecord(record) {
        this.records = [...this.records, record];
        this.updateStoredRecords(this.records);
    }

    updateMoneyStats(stats) {
        this.moneyStats = stats;
        this.updateStoredMoneyStats(stats);
    }
}

export const historyService = new HistoryService();