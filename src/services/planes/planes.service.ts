import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { PlanCreateType, PlanUpdateType } from "../../schemas/planes.schema";

export class PlanesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getPlanes() {
    return await this.prisma.plan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createPlan(plan: PlanCreateType) {
    return await this.prisma.plan.create({
      data: plan,
    });
  }

  async updatePlan(id: string, plan: PlanUpdateType) {
    const planExists = await this.prisma.plan.findUnique({
      where: { id: id },
    });

    if (!planExists) {
      throw {
        message: "Plan not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return await this.prisma.plan.update({
      where: { id: id },
      data: plan,
    });
  }

  async deletePlan(id: string) {
    const planExists = await this.prisma.plan.findUnique({
      where: { id: id },
    });

    if (!planExists) {
      throw {
        message: "Plan not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return await this.prisma.plan.delete({
      where: { id: id },
    });
  }
}
