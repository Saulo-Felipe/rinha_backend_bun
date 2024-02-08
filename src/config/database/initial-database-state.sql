CREATE TABLE clients (
    id INTEGER NOT NULL PRIMARY KEY,
    limite INTEGER NOT NULL,
    saldo INTEGER NOT NULL
);

CREATE TABLE transactions(
    id SERIAL NOT NULL PRIMARY KEY,
    valor INTEGER NOT NULL,
    tipo VARCHAR(1) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    realizada_em DATE NOT NULL,
    client_id INTEGER NOT NULL
);

INSERT INTO clients (id, limite, saldo)
    VALUES
    (1, 100000, 0),
    (2, 80000, 0),
    (3, 1000000, 0),
    (4, 10000000, 0),
    (5, 500000, 0)