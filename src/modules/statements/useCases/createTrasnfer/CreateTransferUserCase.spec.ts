import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateTransferUseCase } from "./CreateTransferUseCase";
enum OperationType {
  TRANSFER_RECEIVE = 'transfer_receive',
  TRANSFER_SEND = 'transfer_send',
}

let createTransferUseCase: CreateTransferUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;



describe("Create Transfer", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createTransferUseCase = new CreateTransferUseCase(usersRepository, statementsRepository);

  });

  it("should be able to create a new transfer", async () => {
    const user = await usersRepository.create({
      name: "ttest",
      email: "teste@teste.com",
      password: "1234"
    });

    const user_send = await usersRepository.create({
      name: "t22",
      email: "teste22@teste.com",
      password: "1234"
    });

    await statementsRepository.create({
      user_id: String(user.id),
      type: 'deposit' as OperationType,
      amount: 100,
      description: "teste"
    });
    const statement = await createTransferUseCase.execute({
      user_id: String(user.id),
      amount: 1,
      description: "teste trasnferencia",
      user_id_sender: String(user_send.id)
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to not create a new tranfer", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "ttest",
        email: "teste@teste.com",
        password: "1234"
      });
      const user_send = await usersRepository.create({
        name: "t22",
        email: "teste22@teste.com",
        password: "1234"
      });
      await createTransferUseCase.execute({
        user_id: String(user.id),
        amount: 1,
        description: "teste trasnferencia",
        user_id_sender: String(user_send.id)
      });

    }).rejects.toBeInstanceOf(AppError);
  });
});
