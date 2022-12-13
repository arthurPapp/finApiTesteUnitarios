import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuidV4 } from 'uuid';
import { app } from "../../../../app";

let connection: Connection;
let id: string;
describe("Create Statment", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id_user = uuidV4();
    const password = await hash("1233", 8);


    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        VALUES( '${id_user}', 'user teste','user@finapi.com.br','${password}')
        `
    );

    // await connection.query(
    //   `
    //   INSERT INTO statements(id, user_id, description, amount,type)
    //   VALUES('${id}','${id_user}', 'deposito direto teste',123,'deposit')
    //     `
    // );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposity", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1233"
      });

    const { token } = responseToken.body;
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`
      }).send({
        "amount": 123,
        "description": "deposito teste"
      });
    id = response.body.id;
    expect(response.status).toBe(201);
  });

  it("should be able to create a new withdraw", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1233"
      });

    const { token } = responseToken.body;
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`
      }).send({
        "amount": 123,
        "description": "saque teste"
      });

    expect(response.status).toBe(201);
  });

  it("should be able to not create a new withdraw with amount not value", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1233"
      });

    const { token } = responseToken.body;
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`
      }).send({
        "amount": 1000,
        "description": "saque teste"
      });

    expect(response.status).toBe(400);
  });

  it("should be able to not create a new withdraw with amount not value", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "user@finapi.com.br",
        "password": "1233"
      });

    const { token } = responseToken.body;
    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
