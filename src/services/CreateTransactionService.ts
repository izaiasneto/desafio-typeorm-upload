import AppError from '../errors/AppError';
import {getRepository, getCustomRepository} from  'typeorm'

import TransactionRepository from '../repositories/TransactionsRepository'

import Transaction from '../models/Transaction';
import Category from '../models/Category'

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class CreateTransactionService {
  public async execute({title, value, type, category}:Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository)
    const categoryRepository = getRepository(Category)

    const { total } = await transactionsRepository.getBalance()

    if(type == "outcome" && total < value){
      throw new AppError('You do not have wnough Balance.')
    }

    let checkCategoryExists = await categoryRepository.findOne({
       where: { 
         title: category 
       }
    })

    if(!checkCategoryExists){
      checkCategoryExists = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(checkCategoryExists)
    }

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category: checkCategoryExists
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
