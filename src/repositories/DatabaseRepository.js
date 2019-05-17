import Game from "../models/Game";

class DatabaseRepository{
    databases = [
        {
            name:"CaroKann",
            id:0,
            games:[new Game(), new Game()]
        },

        {
            name:"Queens Gambit",
            id:1,
            games:[new Game(), new Game()]
        },

    ]

    findAll(){
        return this.databases;
    }

    find(id){
        return this.databases.find(db => db.id === id);
    }
}

const repository = new DatabaseRepository();

export default repository;