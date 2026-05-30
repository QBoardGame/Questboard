export enum GameId {
  VALORANT = 21640,
}

export type GameOption = {
  id: GameId;
  label: string;
};

export const GAME_OPTIONS: GameOption[] = [
  { id: GameId.VALORANT, label: "Valorant" },
];

export enum ValorantEventType {
  KILL = "KILL",
  HEADSHOT = "HEADSHOT",
  ASSIST = "ASSIST",
  DAMAGE = "DAMAGE",
  DEATH = "DEATH",
  FIRST_BLOOD = "FIRST_BLOOD",
  CLUTCH_WIN = "CLUTCH_WIN",
  ACE = "ACE",
  MATCH_WIN = "MATCH_WIN",
  MATCH_PLAYED = "MATCH_PLAYED",
  MATCH_LOSS = "MATCH_LOSS",
  DRAW = "DRAW",
  SPIKE_PLANT = "SPIKE_PLANT",
  SPIKE_DEFUSE = "SPIKE_DEFUSE",
  SPIKE_DENIAL = "SPIKE_DENIAL",
  OBJECTIVE_CAPTURE = "OBJECTIVE_CAPTURE",
  PLAYTIME = "PLAYTIME",
  ROUND_PLAYED = "ROUND_PLAYED",
  MVP = "MVP",
  TOP_FRAGGER = "TOP_FRAGGER",
  WIN_STREAK = "WIN_STREAK",
  ABILITY_USAGE = "ABILITY_USAGE",
  UTILITY_KILL = "UTILITY_KILL",
  ECONOMIC_DAMAGE = "ECONOMIC_DAMAGE",
}

export type EventOption = {
  value: string;
  label: string;
};

export const GAME_EVENT_TYPE_OPTIONS: Record<GameId, EventOption[]> = {
  [GameId.VALORANT]: [
    { value: ValorantEventType.KILL, label: "Kill" },
    { value: ValorantEventType.HEADSHOT, label: "Headshot" },
    { value: ValorantEventType.ASSIST, label: "Assist" },
    { value: ValorantEventType.DAMAGE, label: "Damage" },
    { value: ValorantEventType.DEATH, label: "Death" },
    { value: ValorantEventType.FIRST_BLOOD, label: "First Blood" },
    { value: ValorantEventType.CLUTCH_WIN, label: "Clutch Win" },
    { value: ValorantEventType.ACE, label: "Ace" },
    { value: ValorantEventType.MATCH_WIN, label: "Match Win" },
    { value: ValorantEventType.MATCH_PLAYED, label: "Match Played" },
    { value: ValorantEventType.MATCH_LOSS, label: "Match Loss" },
    { value: ValorantEventType.DRAW, label: "Draw" },
    { value: ValorantEventType.SPIKE_PLANT, label: "Spike Plant" },
    { value: ValorantEventType.SPIKE_DEFUSE, label: "Spike Defuse" },
    { value: ValorantEventType.SPIKE_DENIAL, label: "Spike Denial" },
    { value: ValorantEventType.OBJECTIVE_CAPTURE, label: "Objective Capture" },
    { value: ValorantEventType.PLAYTIME, label: "Playtime" },
    { value: ValorantEventType.ROUND_PLAYED, label: "Round Played" },
    { value: ValorantEventType.MVP, label: "MVP" },
    { value: ValorantEventType.TOP_FRAGGER, label: "Top Fragger" },
    { value: ValorantEventType.WIN_STREAK, label: "Win Streak" },
    { value: ValorantEventType.ABILITY_USAGE, label: "Ability Usage" },
    { value: ValorantEventType.UTILITY_KILL, label: "Utility Kill" },
    { value: ValorantEventType.ECONOMIC_DAMAGE, label: "Economic Damage" },
  ],
};

export const DEFAULT_GAME_ID = GameId.VALORANT;
export const DEFAULT_EVENT_TYPE = ValorantEventType.KILL;

export type GunOption = { value: string; label: string };

export const VALORANT_GUNS: GunOption[] = [
  { value: "Classic", label: "Classic" },
  { value: "Shorty", label: "Shorty" },
  { value: "Frenzy", label: "Frenzy" },
  { value: "Ghost", label: "Ghost" },
  { value: "Sheriff", label: "Sheriff" },
  { value: "Stinger", label: "Stinger" },
  { value: "Spectre", label: "Spectre" },
  { value: "Bulldog", label: "Bulldog" },
  { value: "Guardian", label: "Guardian" },
  { value: "Phantom", label: "Phantom" },
  { value: "Vandal", label: "Vandal" },
  { value: "Marshal", label: "Marshal" },
  { value: "Operator", label: "Operator" },
  { value: "Ares", label: "Ares" },
  { value: "Odin", label: "Odin" },
];
