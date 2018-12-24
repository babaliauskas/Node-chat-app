[
  {
    id: 'asdgasgad',
    name: 'Lukas',
    room: 'DevMountain'
  }
];

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const users = this.getUser(id);
    if (users) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return users;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    const namesArray = this.users
      .filter(user => user.room === room)
      .map(user => user.name);
    return namesArray;
  }
}

module.exports = { Users };
