console.log("start");
for (let i = 0; i < 100; i++) {
    console.log("enviando: ", i);
    fetch("http://localhost:8081/create/"+i);
    fetch("http://localhost:8081/select/"+i);
}
console.log("end")