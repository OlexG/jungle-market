import { db } from "./database.ts";

export class Orders {
  static findByuserId(userId: string) {
    return db.orders.findMany({
      where: { userId: userId },
    });
  }

  static findById(id: string) {
    return db.orders.findFirst({
      where: { id },
    });
  }

  static async createOrder(
    userId: string,
    companyId: string,
    numberOfShares: number,
    type: "buy" | "sell",
  ) {
    const id = crypto.randomUUID();
    const company = await db.companies.findFirst({
      where: { id: companyId },
    });

    if (!company) throw new Error("Company not found");
    const user = await db.users.findFirst({
      where: { id: userId },
    });
    
    if (!user) throw new Error("User not found");
    if (type === "buy" && user.balance < numberOfShares * company.currentPrice) {
      throw new Error("Insufficient funds");
    }

    /* We know order is valid */
    await DBDriver.Users.processPortofolioChange(
      user,
      companyId,
      numberOfShares,
      type,
    );

  
  
    const newBalance =
      type === "buy"
        ? user.balance - numberOfShares * company.currentPrice
        : user.balance + numberOfShares * company.currentPrice;
    
    user.balance = newBalance;
    await DBDriver.Users.updateUser(userId, user);
  
    const order = await db.orders.create({
      data: {
        id,
        userId,
        companyId,
        numberOfShares,
        type,
        price: company.currentPrice,
        createdAt: new Date(),
        classId: crypto.randomUUID(), // TODO: fix this
      },
    });

    return order;
  }

  static async deleteAllRecords() {
    await db.orders.deleteMany({});
  }
}

import { DBDriver } from "./driver.ts";