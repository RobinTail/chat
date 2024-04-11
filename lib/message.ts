export interface Message {
  author: {
    id: string;
    name: string;
    provider: string;
    avatar: string;
  };
  at: Date;
  text: string;
}
