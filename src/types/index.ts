
export type User = {
  id: string;
  username: string;
  pinHash: string;
};

export type AuthUser = {
  id: string;
  username: string;
} | null;

export type Note = {
  id: string;
  userId: string;
  title: string;
  body: string;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
};
