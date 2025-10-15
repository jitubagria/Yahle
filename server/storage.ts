import { type User, type InsertUser } from "../shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nextId: number;

  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => (user as any).username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextId++;
    // cast to any because shared InsertUser may not include id
    const user: User = { ...(insertUser as any), id } as unknown as User;
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
