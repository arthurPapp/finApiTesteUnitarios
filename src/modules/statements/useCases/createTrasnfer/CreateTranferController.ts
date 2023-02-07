import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTranferController {

  async handle(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: user_id_sender } = request.params;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const statement = await createTransferUseCase.execute({
      user_id,
      amount,
      description,
      user_id_sender
    });
    return response.status(201).json(statement);
  }
}

export { CreateTranferController }
