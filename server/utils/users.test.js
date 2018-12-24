const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'testRoom'
      },
      {
        id: '2',
        name: 'James',
        room: 'testRoom 2'
      },
      {
        id: '3',
        name: 'Sara',
        room: 'testRoom'
      }
    ];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Lukas',
      room: 'room 1'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove user', () => {
    const userId = '1';
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const userId = '13';
    const user = users.removeUser(userId);
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const userId = '2';
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    const userId = '23';
    const user = users.getUser(userId);
    expect(user).toBeFalsy();
  });

  it('should return names', () => {
    const userList = users.getUserList('testRoom');
    expect(userList).toEqual(['Mike', 'Sara']);
  });

  it('should return names', () => {
    const userList = users.getUserList('testRoom 2');
    expect(userList).toEqual(['James']);
  });
});
