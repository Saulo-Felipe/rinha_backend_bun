import { Elysia } from "elysia";

const app = new Elysia();


app.get("/clientes/:id/extrato", (request) => {

});


app.post("/clientes/:id/transacoes", (request) => {

});


app.listen(3000, () => console.log("Server is running!"));