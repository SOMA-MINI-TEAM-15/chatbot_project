import { ISomaUser } from '../interfaces/soma.interface';
import { fetchSomaUsers } from '../utils/crawler';

export async function getUser(name: string, userType: 'mentor' | 'mentee'): Promise<ISomaUser> {
  const somaUsers = await getUsers(userType);
  return somaUsers.find(u => u.name === name);
}

export async function getUsers(userType: 'mentor' | 'mentee'): Promise<ISomaUser[]> {
  return fetchSomaUsers(userType);
}
