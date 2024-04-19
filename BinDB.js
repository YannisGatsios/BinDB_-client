import { request } from "./requests.js";

const req = new request();
export class bindb {
    connect = async (username, password, database, host) => {
        return await req.login(username, password, database, host)
    }
    find = async (tableName, query) => {
         const response = await req.request(tableName, query, "find", "POST")
         return jsonResult(response)
    }
    insert = async (tableName, query) => {
        return await req.request(tableName, query, "insert", "POST")
    }
    deleteRow = async (tableName, query) => {
        return await req.request(tableName, query, "deleteRow", "DELETE")
    }
    delete = async (tableName, query) => {
        return await req.request(tableName, query, "delete", "DELETE")
    }
    updateRow = async (tableName, query) => {
        return await req.request(tableName, query, "updateRow", "PATCH")
    }
    update = async (tableName, query) => {
        return await req.request(tableName, query, "update", "PATCH")
    }
}
function jsonResult(json){
    for(let i = 0;i < Object.keys(json).length;i++){
        for(let j = 0;j < Object.keys(json[i]).length;j++){
            if(json[i][Object.keys(json[i])[j]]["type"]){
                json[i][Object.keys(json[i])[j]] = Buffer.from(json[i][Object.keys(json[i])[j]]["data"])
            }
        }
    }
    return json;
}

