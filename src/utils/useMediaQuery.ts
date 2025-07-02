// This file is kept for backward compatibility but now exports from react-use
import { useMedia } from 'react-use';

export function useMediaQuery(query: string): boolean {
  // react-use's useMedia returns true/false
  return useMedia(query);
}
