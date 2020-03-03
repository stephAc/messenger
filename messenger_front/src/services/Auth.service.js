import { BASE_URL, AUTH_PATH } from '../configs/Api.config';

export default class Auth {
  static async login(body) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return await fetch(`${BASE_URL}${AUTH_PATH}/login`, init);
  }

  static async create(body) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return await fetch(`${BASE_URL}${AUTH_PATH}/create`, init);
  }
}
