export interface DbConnectionOptionsInterface {
    useFindAndModify: boolean,
    useNewUrlParser: boolean,
    useCreateIndex: boolean,
    auto_reconnect: boolean,
    reconnectTries: number,
    reconnectInterval: number,
    keepAlive: boolean,
    connectTimeoutMS: number,
    useUnifiedTopology: boolean,
}
export interface DbSettings {
    db: string,
    user: string,
    password: string,
    server: string,
}
export interface MessageEmailInterface {
    api_key: string,
    sender: string,
    to: string[],
    subject: string,
    html_body: string,
}
export interface EmailStatusesInterface {
    [name: string]: string,
}

