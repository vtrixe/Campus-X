import { db } from "./db";

interface SearchResult {
  id: string;
  name?: string;
  content?: string;
  type: "User" | "Server" | "Channel" | "Message";
}

export const SearchService = {
  async searchAll(term: string): Promise<SearchResult[]> {
    // Implement search logic using Prisma
    const results = await db.$queryRaw`
      SELECT * FROM (
        SELECT id, name, 'User' AS type FROM User WHERE name LIKE ${`%${term}%`}
        UNION
        SELECT id, name, 'Server' AS type FROM Server WHERE name LIKE ${`%${term}%`}
        UNION
        SELECT id, name, 'Channel' AS type FROM Channel WHERE name LIKE ${`%${term}%`}
        UNION
        SELECT id, content, 'Message' AS type FROM Message WHERE content LIKE ${`%${term}%`}
      ) AS search_results
      ORDER BY type;
    `;

    return results as SearchResult[];
  },
};