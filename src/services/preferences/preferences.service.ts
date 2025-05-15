import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  PreferenceCreateType,
  PreferenceUpdateType,
} from "../../schemas/preferences.schema";

export class PreferencesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getPreferences(userId: string) {
    return await this.prisma.preferences.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createPreference(preference: PreferenceCreateType, userId: string) {
    return await this.prisma.preferences.create({
      data: {
        ...preference,
        userId: userId,
      },
    });
  }

  async getPreferenceById(id: string) {
    const preference = await this.prisma.preferences.findUnique({
      where: { id: id },
    });

    if (!preference) {
      throw {
        message: "Preference not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return preference;
  }

  async updatePreference(id: string, preference: PreferenceUpdateType) {
    await this.getPreferenceById(id);

    return await this.prisma.preferences.update({
      where: { id: id },
      data: preference,
    });
  }

  async deletePreference(id: string) {
    await this.getPreferenceById(id);

    return await this.prisma.preferences.delete({
      where: { id: id },
    });
  }
}
