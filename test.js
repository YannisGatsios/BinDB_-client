import { bindb } from "./BinDB.js";

var db = new bindb();
console.log(await db.connect("root", "root123", "testDB", "localhost"));

var query = {
    select: 0,
    where: {
        id: [1,2,3],
        age: [505]
    }
}
var result  = await db.find("products", query);
console.log(result)

var query = {
    data: {
        name: 'john',
        age: 505,
        image: Buffer.from("hellohell]")
    }
}
result = await db.insert("products", query)
console.log(result)

query = {
    index: 0
}
result = await db.deleteRow("products", query)
console.log(result)

query = {
    where: {
        id: [1,2,3],
        age: [505]
    }
}
result = await db.delete("products", query)
console.log(result)

query = {
    index: 0,
    update: {
        name: "John_Gats"
    }
}
result = await db.updateRow("products", query)
console.log(result)

query = {
    where: {
        id: [1,2,3],
        name: "john"
    },
    update: {
        name: "John_Gats"
    }
}
result = await db.update("products", query)
console.log(result)