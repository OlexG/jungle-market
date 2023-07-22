import { db } from "./database.ts";

export class Orders {
  static async getByUserId(userId: string) {
    return db.orders.findMany({
      where: { userID: userId },
    });
  }

  static async getById(id: string) {
    return db.orders.findFirst({
      where: { id },
    });
  }

  static async createOrder(
    userID: string,
    companyID: string,
    numberOfShares: number,
    type: "buy" | "sell",
    DBDriver: any,
  ) {
    const id = crypto.randomUUID();
    const company = await db.companies.findFirst({
      where: { id: companyID },
    });

    if (!company) throw new Error("Company not found");

    const order = await db.orders.create({
      data: {
        id,
        userID,
        companyID,
        numberOfShares,
        type,
        price: company.currentPrice,
        createdAt: new Date(),
        classId: crypto.randomUUID(), // TODO: fix this
      },
    });

    await DBDriver.Users.processPortofolioChange(
      userID,
      companyID,
      numberOfShares,
      type,
      DBDriver,
    );

    return order;
  }

  static async deleteAllRecords() {
    await db.orders.deleteMany({});
  }
}