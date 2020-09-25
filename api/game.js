import pokemons from './pokemons.json';

export const startGame = (players, config) => {
    console.log('Game starting...');

    for (const player of players) {
        const index = Math.floor(Math.random() * pokemons.length); // 0 1 2 3 4
        player.pokemon = { ... pokemons[index]};
    }

    config.turn = Math.floor(Math.random() * 2); // 0 1

    for(const [index, player] of players.entries()) {
        const {socket, ... you} = player;
        const {socket: _, ... opponent} = players.find(player => player.socket.id != socket.id);

        /*
        you: { name, pokemon }
        opponennt: { name, pokemon }
        */
        socket.emit('started', {
            // => you: you, variable identique à la clé => écrire une fois
            you, 
            opponent,
            turn: index === config.turn ? 'you' : 'opponent',
        });
       
    }
};

export const terminateGame = (socket, players) => {
    console.log('Game terminating...');

    const index = players.findIndex(player => player.socket.id === socket.id);

    // on a trouvé l'index qui s'est déconnecté
    if (index != -1) {
        players.splice(index, 1);
    }

    // reset les pokémons des autres joueurs (même s'il yen a que un)
    for (const player of players) {
        player.pokemon = null;
        player.socket.emit('terminated');
    }
};

export const handleMove = (moveId, players, config) => {

    let activePlayer = players[config.turn]; // You : 0
    let opponent = players[config.turn === 0 ? 1:0]; // Opponent : 1
    let move = activePlayer.pokemon.moves[moveId]; // 0, 1, 2, 3

    console.log(`${activePlayer.name} with "${activePlayer.pokemon.name}" has played "${move.name}"`);
    console.log(`${opponent.pokemon.name} (${opponent.pokemon.hp}hp) has taken ${move.power} damages`);

    opponent.pokemon.hp -= move.power;
    
    console.log(opponent.pokemon.hp);

    if ((opponent.pokemon.hp) <= 0) {
        opponent.pokemon.hp = 0;
        endGame(players);
        console.log(opponent.pokemon.hp);
    } else {
        setTimeout(() => {updateGame(moveId, players, config);}, 0);
    }
};

const updateGame = (moveId, players, config) => {

    for(const [index, player] of players.entries()) {
        let {socket, ... you} = player;
        let {socket: _, ... opponent} = players.find(player => player.socket.id != socket.id);
        
        if ((you[config.turn] == 0) && (opponent[config.turn] == 1))
        {
            you[config.turn] = 1;
            opponent[config.turn] = 0;
            console.log(opponent[config.turn]);
        } else if ((you[config.turn] == 1) && (opponent[config.turn] == 0)) {
            you[config.turn] = 0;
            opponent[config.turn] = 1;
            console.log(opponent[config.turn]);
        }

        socket.emit('moved', {
            you, 
            opponent,
            moveId,
            turn: index === config.turn ? 'you' : 'opponent',
        });
    }
      
    /*for(const [index, player] of players.entries()) {
        const {socket: _, ... you} = player[config.turn  === 0 ? 1:0];
        const {socket: __, ... opponent} = player[config.turn === 1 ? 0:1];
        //let you = players[config.turn  === 0 ? 1:0]; // You : 0
        //let opponent = players[config.turn === 1 ? 0:1]; // Opponent : 1
        //let i = players;
        //console.log(players[config.turn].socket);
        //console.log(activePlayer);
        //console.log(opponent);

        socket.emit('moved ', {
            you, 
            opponent,
            moveId,
            turn: index === config.turn ? 'you' : 'opponent',
        });
    }*/
};

const endGame = players => {
    console.log('Game ending...');

    let winnerIndex = null;

    for(const [index, player] of players.entries()) {
        const {socket, ... you} = player;
        const {socket: _, ... opponent} = players.find(player => player.socket.id != socket.id);
        
        if ((you.pokemon.hp) === 0) {
            winnerIndex = 'opponent'; // Opponent = 1
        } else if ((opponent.pokemon.hp) === 0) {
            winnerIndex = 'you'; // You = 0
        }
       
        socket.emit('ended', {
            you, 
            opponent,
            win: index === winnerIndex,
        });
    }
};
