import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        "name": "Teste Create User",
        "email": "createuser@teste.com",
        "password": "1234"
      });
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with email exisits", async () => {

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        "name": "Teste Create User ERRO",
        "email": "createuser@teste.com",
        "password": "1234"
      });
    expect(response.status).toBe(400);
  });

});
