export enum CampusTab {
  detail,
  media,
  members,
  about,
}

export interface CampusHeaderTypes {
  campus: string;
  groupIns: any;
  tab: CampusTab;
}
