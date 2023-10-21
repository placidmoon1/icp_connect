import {     bool,
    nat64,
    nat8,
    Opt,
    StableBTreeMap,
    Tuple, Record, Null, Variant, Vec, Canister, query, text, update, Void, Some, None, int } from 'azle';

    // This is a global variable that is stored on the heap
let message = '';

//keys
const User_key = text;
const Room_key = text;

//user

export const User = Record({
    id: text,
    isCreator: bool,
   // keys_hist: Vec(text),
    //keys_temp: Vec(text),
   //keys_perm: Vec(text),
   //room: Thread,
   // posts: Vec(Post),
   // reactions: Vec(Reaction),
    username: text
})

//room
export const Room = Record({
    id: text,
    author: text,
    posts: Vec(text),
    roomname: text
})
//key

//coin

//db
let db_user = StableBTreeMap(User_key, User, 0);
let db_room = StableBTreeMap(Room_key, Room, 0);

export default Canister({
    // Query calls complete quickly because they do not go through consensus
    getUser: query([User_key], Opt(User), (id) => {
        return db_user.get(id);
    }),

    getRoom: query([Room_key], Opt(Room), (id) => {
        return db_room.get(id);
    }),



    getAllUsers: query([], Vec(User), () => {
        return db_user.values();
    }),

    /*
    getAllRooms: query([], Vec(Room), () => {
        return db_room.values();
    }),
    */
    
    //create
    createUser: update([text, bool], User, (username, isCreator) => {
        const id = db_user.len().toString(); //assume no delete-

        const new_user: typeof User = {
            id, 
            isCreator,
            username
        };

        db_user.insert(id, new_user);

        return new_user;
    }),

    //create room
    createRoom: update([text], Room, (roomname) => {
        const id = db_room.len().toString(); //assume no delete-

        const userId = Math.floor(Math.random() * Number(db_user.len())).toString();

        const startText =  ["hello world!, first text"]

        const new_room: typeof Room = {
            id: id, 
            roomname: roomname,
            posts: startText,
            author: userId
        };

        db_room.insert(id, new_room);

        return new_room;
    }),


});

