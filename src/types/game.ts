export interface Game {
  shortcut: string
  name: string
  loaded?: boolean
  imgCount?: number
  autors?: string
  version?: string
  numDl?: number
  changed?: Date
  added?: Date
  rank?: number
  category: number
  size: number
  hidden?: string;
  hiddenWeb?: string;
  translationType: {
    [key: string]: number
  }
  platform?: string
  language?: string
  notes?: string
}
