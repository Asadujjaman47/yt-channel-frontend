export interface Category {
  name: string;
}

export interface Channel {
  name: string;
  url: string;
  tags: string;
  category: string;
  "Created time": string;
  "Last edited time": string;
  description: string;
}

export interface Tag {
  name: string;
}
