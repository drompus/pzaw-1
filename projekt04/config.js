// should be as an .env variable but it isn't to simplify test environment configuration
export const SECRET = "haslo123@dev";
export const PEPPER = "pepper123@dev";
export const DB_PATH = "./db.sqlite";
export const PORT = 8000;

export default {
    DB_PATH,
    SECRET,
    PORT
}