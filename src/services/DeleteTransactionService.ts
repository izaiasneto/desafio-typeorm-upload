import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository)

    const checkTransactionExist = await transactionRepository.findOne(id)

    if(!checkTransactionExist){
      throw new AppError('Transaction does not exist')
    }

    await transactionRepository.remove(checkTransactionExist)
  }
}

export default DeleteTransactionService;
