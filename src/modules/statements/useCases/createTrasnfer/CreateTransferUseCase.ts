import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferErro } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  TRANSFER_RECEIVE = 'transfer_receive',
  TRANSFER_SEND = 'transfer_send',
}

@injectable()
class CreateTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }


  async execute({ user_id, amount, description, user_id_sender }: ICreateTransferDTO) {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateTransferErro.UserNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({ user_id });
    if (balance < amount) {
      throw new CreateTransferErro.InsufficientFunds()
    }

    const user_send = await this.usersRepository.findById(user_id_sender);
    if (!user_send) {
      throw new CreateTransferErro.UserNotFound();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type: 'transfer_send' as OperationType,
      amount,
      description
    });


    const statementOperationReceived = await this.statementsRepository.create({
      user_id: user_id_sender,
      type: 'transfer_receive' as OperationType,
      amount,
      description: 'trasnferencia recebida'
    });
    this.statementsRepository.update(String(statementOperationReceived.id), user_id);
    return statementOperation;
  }
}
export { CreateTransferUseCase }
