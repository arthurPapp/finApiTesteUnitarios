import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { v4 as uuidV4 } from 'uuid';
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection;
describe("Show Profile User", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("1234", 8);


    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        VALUES( '${id}', 'user teste','user@finapi.com.br','${password}')
        `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show profile", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1234"
      });
    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      });
    expect(response.status).toBe(200);
  });

});
