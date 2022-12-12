import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuidV4 } from 'uuid';
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);


    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        VALUES( '${id}', 'admin','admin@rentx.com.br','${password}')
        `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "admin@rentx.com.br",
        "password": "admin"
      });
    const { token } = responseToken.body;
    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@aa.com.br",
        "password": "admin"
      })
    expect(response.status).toBe(401);

  });

  it("should be able to authenticate with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "admin@rentx.com.br",
        "password": "ewq"
      })
    expect(response.status).toBe(401);

  });

});
