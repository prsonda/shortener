export class ShortenerEntity {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId: string | null;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
