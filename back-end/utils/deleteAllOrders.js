const { PrismaClient } = require("@prisma/client");
const readline = require("readline");
const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function deleteAllOrders() {
  try {
    // Delete all OrderItems associated with Orders
    const deleteOrderItems = await prisma.orderItem.deleteMany({
      where: {
        // Add your conditions here, if any
      },
    });

    // Delete all Orders
    const deleteOrders = await prisma.order.deleteMany({
      where: {
        // Add your conditions here, if any
      },
    });

    console.log(
      `Deleted ${deleteOrderItems.count} OrderItems and ${deleteOrders.count} Orders`
    );
  } catch (error) {
    console.error("Error deleting Orders and OrderItems:", error);
  }
}

// You must successfully answer this math question in order to proceed with deletion
// This will help to avoid accidental deletions right?
function giveMathQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = num1 + num2;

  rl.question(
    `What is ${num1} + ${num2}? Answer correctly to proceed with deletion.`,
    (userAnswer) => {
      if (parseInt(userAnswer) === correctAnswer) {
        console.log(
          "Correct answer. Proceeding to delete all orders and order items."
        );
        deleteAllOrders().finally(async () => {
          await prisma.$disconnect();
          rl.close();
        });
      } else {
        console.log("Incorrect answer. Aborting the deletion process.");
        rl.close();
      }
    }
  );
}

// Start by asking the math question
giveMathQuestion();
