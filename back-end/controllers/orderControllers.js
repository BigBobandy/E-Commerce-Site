const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const prisma = new PrismaClient();

// Function to generate a date-based and sequential order number
async function generateOrderNumber() {
  // Get the current date in YYYYMMDD format
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;

  // Fetch the last order number for today from the database (you'll need to implement this)
  // This could be a query that gets the highest order number with the same date prefix
  const lastOrderNumber = await getLastOrderNumberForToday(formattedDate);

  // Extract the sequential part of the last order number and increment it by 1
  // If there are no orders for today, start with 001
  let nextSequentialNumber;
  if (lastOrderNumber) {
    const lastSequentialNumber = parseInt(lastOrderNumber.split("-")[2], 10);
    nextSequentialNumber = String(lastSequentialNumber + 1).padStart(3, "0");
  } else {
    nextSequentialNumber = "001";
  }

  // Combine the date and the new sequential number to form the new order number
  const newOrderNumber = `ORD-${formattedDate}-${nextSequentialNumber}`;

  return newOrderNumber;
}

// Function to fetch the last order number for today from the database
async function getLastOrderNumberForToday(formattedDate) {
  try {
    // Query the database to find the last order for today based on the formattedDate prefix
    // Use the 'startsWith' filter to match the order numbers that start with the date prefix
    // Also sort the orders in descending order based on the orderNumber and take only the first result
    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `ORD-${formattedDate}`,
        },
      },
      orderBy: {
        orderNumber: "desc",
      },
      select: {
        orderNumber: true,
      },
    });

    // If an order is found, return its order number; otherwise, return null
    return lastOrder ? lastOrder.orderNumber : null;
  } catch (error) {
    console.error("Error fetching the last order number for today:", error);
    return null;
  }
}
// Function to send order confirmation email
async function sendOrderConfirmationEmail(user, orderDetails, orderItems) {
  // Create a test account using Ethereal
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log(orderItems);

  // Prepare the email content, including the order details
  const emailContent = `
  <h1>Hello ${user.firstName}, Your Order is Confirmed!</h1>
  <p>We're excited to let you know that your order has been confirmed and is now being processed. Here are the details:</p>
  <ul>
    ${orderItems // Access the orderItems array here
      .map(
        (item) =>
          `<li><strong>${item.name}</strong> - Quantity: ${item.quantity}</li>`
      )
      .join("")}
  </ul>
  <h2>Order Summary:</h2>
  <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
  <p><strong>Total Price:</strong> $${orderDetails.totalPrice.toFixed(2)}</p>
  <p><strong>Shipping Method:</strong> ${orderDetails.shippingMethod}</p>
  <p><strong>Shipping Cost:</strong> $${orderDetails.shippingCost.toFixed(
    2
  )}</p>
  <p>Thank you for shopping with us. We hope you enjoy your purchase!</p>
`;
  // Send the email
  const info = await transporter.sendMail({
    from: "no-reply@example.com",
    to: user.email,
    subject: "Order Confirmation",
    html: emailContent,
  });

  console.log("Order confirmation email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Handles Order submission
async function submitOrder(req, res) {
  try {
    // Get the JWT from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Declare a variable to hold the decoded token
    let decoded;

    try {
      // Try to verify and decode the JWT using the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get the user ID from the decoded token
    const userId = decoded.id;

    // Extract and validate request body
    const {
      orderItems,
      shippingInfoId,
      cardInfoId,
      totalPrice,
      shippingMethod,
      shippingCost,
    } = req.body;
    if (
      !orderItems ||
      !shippingInfoId ||
      !cardInfoId ||
      typeof totalPrice !== "number" ||
      typeof shippingCost !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Generate a unique order number
    const orderNumber = await generateOrderNumber();

    // Create a new Order in the database
    const newOrder = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        shippingInfo: { connect: { id: shippingInfoId } },
        cardInfo: { connect: { id: cardInfoId } },
        totalPrice,
        shippingMethod,
        shippingCost,
        status: "Pending",
        orderItems: {
          create: orderItems.map((item) => ({
            menuItem: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
        orderNumber,
      },
      include: { orderItems: true },
    });

    // Fetch the user details for sending the email
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Send order confirmation email
    await sendOrderConfirmationEmail(user, newOrder, orderItems);

    // Respond with the newly created Order
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a problem submitting the order" });
  }
}

module.exports = { submitOrder };
