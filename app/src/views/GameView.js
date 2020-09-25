import React from 'react';

export default ({ data, status, socket }) => {
    let message = '';

    if (status === 'waiting') {
        message = "En attente d'un autre joueur ...";
    } else if (status === 'playing') {
        // if data.turn === 'you'
        message = 'Le combat commence !';
    }

    const triggerAction1 = () => {
        if (data.turn === 'you') {
            socket.emit('move', 0);
        }
    }
    const triggerAction2 = () => {
        if (data.turn === 'you') {
            socket.emit('move', 1);
        }
    }
    const triggerAction3 = () => {
        if (data.turn === 'you') {
            socket.emit('move', 2);
        }
    }
    return (
        <>
            <div className="c-game">
                <div className="c-game-row">
                    <div className="c-pokemon-info">
                        Pokemon 1
                        <div className="c-pokemon__hp" style={{ '--pokemon-hp-percent': data?.opponent?.pokemon?.hp}} />
                    </div>
                    <div className="c-pokemon">
                        <div className="c-pokemon__image">
                            {data?.opponent?.pokemon && (
                                <img alt="Opponent Pokemon" src={data.opponent.pokemon.image} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="c-game-row">
                    <div className="c-pokemon">
                        <div className="c-pokemon__image">
                            {data?.you?.pokemon && (
                                <img alt="you Pokemon" src={data.you.pokemon.image} />
                            )}
                        </div>
                    </div>
                    <div className="c-pokemon-info">
                        Pokemon 2
                        <div className="c-pokemon__hp" style={{ '--pokemon-hp-percent': data?.you?.pokemon?.hp }} />
                    </div>
                </div>
            </div>
            <div className="c-game-info">
                <div className="c-message">
                    {message}
                    <div className="c-form u-mt-base">
                        <button onClick={() => console.log('TODO')}>Retourner au menu</button>
                    </div>
                </div>
                <div className="c-actions">
                    <button className="c-actions__action" onClick={triggerAction1}>
                        Action 1
                    </button>
                    <button className="c-actions__action" onClick={triggerAction2}>
                        Action 2
                    </button>
                    <button className="c-actions__action" onClick={triggerAction3}>
                        Action 3
                    </button>
                    <button className="c-actions__action" onClick={() => console.log('TODO')} disabled>
                        Action 4
                    </button>
                </div>
            </div>
        </>
    );
};
