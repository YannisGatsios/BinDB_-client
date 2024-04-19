export class request{
    token = "";
    database = "";
    hostLink = "";
    port = 80;
    fetchRequest = async (url, options) => {
        try {
            const response = await fetch(url, options);
    
            if (response.status === 403) {
                return ["invalid token.", "Gay???"];
            }
    
            if (response.status !== 200) {
                console.log(await response.json());
                throw new Error("something went wrong");
            }
    
            const header = response.headers.get("authorization");
            const data = await response.json();
            return [data, header];
        } catch (error) {
            console.error("Error occurred during fetch:", error);
            // Return a custom error response or rethrow the error as needed
            return ["error", error];
        }
    }
    refreshToken = async (oldToken) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": oldToken
            }
        }
        try {
            const [data, header] = await fetchRequest(this.hostLink + "token", options);
            return header;
        } catch (err) {
            console.log(err);
        }
    }
    login = async (username, password, database, host) => {
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
            const [data, header] = await this.fetchRequest(this.hostLink + "login", options);
            this.token = header;
            return data.status;
        } catch (err) {
            console.log(err);
        }
    }
    chechSession = () =>{ 
        if(this.token === "") return false;
        return true;
    }
    request = async (tableName, query, page, method)=> {
        if(!this.chechSession) return "You are not connected.";
        const options = {
            method: method,
            body: JSON.stringify({
                database: this.database,
                table: tableName,
                query: query
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": this.token
            }
        }
        try {
            const [data, ] = await this.fetchRequest(this.hostLink + page, options);
            return data;
        } catch (err) {
            console.log(err);
        }
    }
}