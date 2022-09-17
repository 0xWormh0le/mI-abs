import React from 'react';
import Footer from '../../components/Layout/Footer';
import {Title} from './Title';
import {Featured} from './Featured';
import {Board} from './Board';
import {Promo} from './Promo';
import {ApiTypes} from '../../types/api';
import {Helmet} from 'react-helmet';

const Leaderboard = () => {
  //dummy data
  const leaders = Array(10).fill({}).map((user, index) => ({
    name: `GeneralWhiskers${index}`,
    profilePicture: `https://picsum.photos/seed/${index}/64`,
    rank: index + 1,
    kills: Math.round(Math.random() * 1000),
    estimatedPayout: +Math.fround(Math.random() * 100).toFixed(2),
  }));
  const user: ApiTypes.Model.LeaderboardInfo = {
    rank: 16,
    kills: 193,
    profilePicture: 'https://picsum.photos/id/1025/256',
    estimatedPayout: 12349,
    name: 'SupaKilla33',
  };
  const total: ApiTypes.Res.ViewLeaderboard = {
    topInfo: [user],
    nextPayout: new Date(),
    numPlayers: 2053,
    myInfo: user,
  };
  return <>
    <Helmet>
      <title>Leaderboard | PlayerMint</title>
    </Helmet>
    <Title/>
    <Featured total={total} user={user}/>
    <Board users={leaders}/>
    <Promo/>
    <Footer/>
  </>
}

export default Leaderboard;
