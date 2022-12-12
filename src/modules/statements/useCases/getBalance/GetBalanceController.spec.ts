import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuidV4 } from 'uuid';
import { app } from "../../../../app";
import { Statement } from "../../entities/Statement";

let connection: Connection;
describe("Get Balance Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const id_user = uuidV4();
    const password = await hash("1233", 8);


    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        VALUES( '${id_user}', 'user teste','user@finapi.com.br','${password}')
        `
    );

    await connection.query(
      `
      INSERT INTO statements(id, user_id, description, amount,type)
      VALUES('${id}','${id_user}', 'deposito direto teste',123,'deposit')
        `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1233"
      });

    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
  });

});
