
import React from 'react';
import { Card, CardHeader, CardTitle } from './common/Card';
import { Trophy, ShieldCheck, Zap, Recycle, Leaf, Star, Award } from 'lucide-react';

const leaderboardData = [
  { id: 1, name: 'Greta T.', points: 12500, avatar: 'https://picsum.photos/seed/user1/40/40' },
  { id: 2, name: 'David A.', points: 11800, avatar: 'https://picsum.photos/seed/user2/40/40' },
  { id: 3, name: 'Alex Green', points: 9600, avatar: 'https://picsum.photos/seed/user/40/40' },
  { id: 4, name: 'Jane G.', points: 8900, avatar: 'https://picsum.photos/seed/user4/40/40' },
  { id: 5, name: 'Leo D.', points: 8500, avatar: 'https://picsum.photos/seed/user5/40/40' },
];

const badges = [
  { id: 1, name: 'Eco Starter', icon: <Leaf size={24} />, color: 'text-green-500' },
  { id: 2, name: 'Energy Saver', icon: <Zap size={24} />, color: 'text-yellow-500' },
  { id: 3, name: 'Recycle Pro', icon: <Recycle size={24} />, color: 'text-blue-500' },
  { id: 4, name: 'Carbon Conscious', icon: <ShieldCheck size={24} />, color: 'text-indigo-500' },
];

// FIX: Define props interface for LeaderboardItem
interface LeaderboardItemProps {
  rank: number;
  user: { name: string; points: number; avatar: string };
}

// FIX: Type LeaderboardItem as a React.FC to correctly handle props including the 'key' prop.
const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, user }) => {
    const isCurrentUser = user.name === 'Alex Green';
    return (
        <li className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-primary-green/10' : ''}`}>
            <span className="text-lg font-bold w-8 text-gray-500 dark:text-gray-400">{rank}</span>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mx-3"/>
            <span className={`flex-1 font-semibold ${isCurrentUser ? 'text-primary-green' : 'text-gray-800 dark:text-white'}`}>{user.name}</span>
            <div className="flex items-center">
                <span className="font-bold text-gray-800 dark:text-white">{user.points.toLocaleString()}</span>
                <Star size={16} className="ml-1 text-yellow-400 fill-current"/>
            </div>
        </li>
    );
};

export const Gamification: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Challenges & Leaderboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={<Trophy size={24}/>}>Community Leaderboard</CardTitle>
            </CardHeader>
            <ul>
                {leaderboardData.map((user, index) => (
                    <LeaderboardItem key={user.id} rank={index + 1} user={user} />
                ))}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Points</CardTitle>
                </CardHeader>
                <div className="text-center">
                    <p className="text-5xl font-bold text-primary-green">9,600</p>
                    <p className="text-gray-500 dark:text-gray-400">Eco-Points</p>
                </div>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle icon={<Award size={24}/>}>Your Badges</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 gap-4">
                    {badges.map(badge => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <div className={badge.color}>{badge.icon}</div>
                            <p className="text-xs font-semibold mt-1">{badge.name}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
