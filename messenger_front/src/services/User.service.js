import { BASE_URL, USER_PATH, ADMIN_PATH } from '../configs/Api.config';
export default class UserService {
  static async find(body) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id: body }),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/find`, init);
  }
  static async list(name = 'null', context = 'client') {
    let init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const url =
      context === 'client'
        ? `${BASE_URL}${USER_PATH}/list/${name}`
        : `${BASE_URL}${ADMIN_PATH}/list/${name}`;
    return await fetch(url, init);
  }
  static async getConversation(userID) {
    let init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    return await fetch(`${BASE_URL}${USER_PATH}/conversations/${userID}`, init);
  }
  static async requestTo({ to, by }) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ to, by }),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/request_to`, init);
  }
  static async declineRequest({ userID, contactID }) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userID, contactID }),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/decline_request`, init);
  }
  static async acceptRequest({ userID, contactID }) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userID, contactID }),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/accept_request`, init);
  }
  static async deleteContact({ userID, contactID }) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userID, contactID }),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/delete_contact`, init);
  }
  static async update(obj) {
    let init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(obj),
    };
    return await fetch(`${BASE_URL}${USER_PATH}/update`, init);
  }
  static async delete(id) {
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id }),
    };
    return await fetch(`${BASE_URL}${ADMIN_PATH}/delete`, init);
  }
}
