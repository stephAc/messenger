import { BASE_URL, CONVERSATION_PATH } from '../configs/Api.config';
export default class UserService {
  static async create(body) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    };
    return await fetch(`${BASE_URL}${CONVERSATION_PATH}/create`, init);
  }
  static async find(body) {
    let init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    return await fetch(`${BASE_URL}${CONVERSATION_PATH}/find/${body.id}`, init);
  }
  static async findByUser(body) {
    let init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    return await fetch(
      `${BASE_URL}${CONVERSATION_PATH}/find_by_user/${body.id}`,
      init,
    );
  }
}
