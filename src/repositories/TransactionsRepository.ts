import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;

  type: 'income' | 'outcome';

  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.balance;
  }

  private isPermitted({ type, value }: CreateTransactionDTO): boolean {
    if (type === 'outcome') {
      const balance = this.getBalance();

      return value < balance.total;
    }

    return true;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    if (!this.isPermitted({ title, type, value })) {
      throw Error('Outcome is bigger than total balance');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    if (type === 'income') this.balance.income += value;
    else this.balance.outcome += value;

    this.balance.total = this.balance.income - this.balance.outcome;

    return transaction;
  }
}

export default TransactionsRepository;
