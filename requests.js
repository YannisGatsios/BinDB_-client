const request = async (url, options) => {
    const response = await fetch(url, options);
    console.log(response.status);
    if(response.status === 403) return ["invalid token.","Gay???"];
    if(response.status !== 200){
        throw new Error("something went wrong");
    }
    const header = response.headers.get("authorization");
    const data = await response.json();
    return [data,header];
}

const refreshToken = async (oldToken) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": oldToken
        }
    }
    try {
        const [data, header] = await request(this.hostLink + "token", options);
        return header;
    } catch (err) {
        console.log(err);
    }
}

class bindb {
    token = "";
    database = "";
    hostLink = "";
    port = 80;
    chechSession = () =>{ 
        if(this.token === "") return false;
        return true;
    }
    connect = async (username, password, database, host) => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        this.hostLink = host;
        this.database = database
        if(host === "localhost") this.hostLink = "http://127.0.0.1:"+this.port+"/api/";
        try {
            const [data, header] = await request(this.hostLink + "login", options);
            this.token = header;
            return data.status;
        } catch (err) {
            console.log(err);
        }
    }
    find = async (tableName, resultColumns = 0, columnsToSearch = 0, valueOfColumn = 0) => {
        if(!this.chechSession) return "You are not connected.";
        const options = {
            method: "POST",
            body: JSON.stringify({
                database: this.database,
                table: tableName,
                resultColumns: resultColumns,
                columnsToSearch: columnsToSearch,
                valueOfColumn: valueOfColumn
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": this.token
            }
        }
        try {
            const [data, ] = await request(this.hostLink + "find", options);
            if(data === "invalid token."){
                this.token = await refreshToken(this.token);
            }
            return data;
        } catch (err) {
            console.log(err);
        }
    }
}

var db = new bindb();
console.log(await db.connect("root", "root123", "testDB", "localhost"));
//console.log(db.token)
const result  = await db.find("products",["name","age"],["age"],[505]);
console.log(result)
