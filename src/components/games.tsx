import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Game {
  id: string;
  shortcut: string;
  name: string;
  version: string;
  versions: string;
  added: string;
  hidden: string;
  size: string;
  locked: string;
  created: string;
  numDl: string;
  autors: string;
  changed: string;
  category: string;
  category2: string;
  category3: string;
  category4: string;
  hasMods: string;
  hiddenWeb: string;
  translationType: string;
  over18: string;
  nextTranslation: string;
  handTranslation: string;
  editTranslation: string;
  completeEdited: string;
  rank: string;
  imgCount: string;
}

const fetchGames = async (): Promise<Game[]> => {
  const response = await fetch('/data/games.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Games: React.FC = () => {
  const { data, error, isLoading } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: fetchGames
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Games List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Downloads</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.version}</td>
              <td>{game.numDl}</td>
              <td>{game.autors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Games;
