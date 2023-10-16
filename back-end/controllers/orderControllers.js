const { PrismaClient } = require("@prisma/client");
const { decrypt } = require("../utils/encryptionHelper");
const jwt = require("jsonwebtoken");
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("../utils/aws-config");
const prisma = new PrismaClient();

// Function to send order confirmation email
async function sendOrderConfirmationEmail(user, orderDetails, orderItems) {
  // HTML content for the email
  const emailContent = `
    <h1>Hello ${user.firstName}, Your Order is Confirmed!</h1>
    <p>We're excited to let you know that your order has been confirmed and is now being processed. Here are the details:</p>
    <ul>
      ${orderItems
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
    <p><strong>Est. Delivery Date:</strong> ${orderDetails.estDeliveryDate}</p>
    <p>Thank you for shopping with us. We hope you enjoy your purchase!</p>
  `;

  // Parameters for the SES sendEmail method
  const params = {
    Destination: {
      ToAddresses: [user.email], // Recipient email address
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailContent, // HTML content
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Order Confirmation", // Email subject
      },
    },
    Source: "Dirty Burger <dirtyburgerdev@gmail.com>", // Sender email address
  };

  try {
    // Attempt to send the email
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("Email sent:", result);
  } catch (error) {
    // Log any errors
    console.error("Error sending email:", error);
  }
}
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
      deliveryDate,
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
        estDeliveryDate: deliveryDate,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        shippingInfo: true,
        cardInfo: true,
      },
    });

    // Decrypt the sensitive card information
    const decryptedCardInfo = {
      ...newOrder.cardInfo,
      cardType: decrypt(newOrder.cardInfo.cardType),
      cardNumber: decrypt(newOrder.cardInfo.cardNumber),
      expiryDate: decrypt(newOrder.cardInfo.expiryDate),
      cvv: decrypt(newOrder.cardInfo.cvv),
      cardHolder: decrypt(newOrder.cardInfo.cardHolder),
    };

    // Replace the encrypted cardInfo with the decrypted one
    const decryptedNewOrder = {
      ...newOrder,
      cardInfo: decryptedCardInfo,
    };

    // Fetch the user details for sending the email
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Send order confirmation email
    await sendOrderConfirmationEmail(user, newOrder, orderItems);

    // Respond with the newly created and decrypted Order
    res.status(201).json(decryptedNewOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a problem submitting the order" });
  }
}

// Handles Getting orders from database
async function getOrderInfo(req, res) {
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

    // Fetch order info for this user along with associated data
    const orderInfo = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        orderItems: {
          include: {
            menuItem: true, // Include details of each menu item in orderItems
          },
        },
        shippingInfo: true, // Include shippingInfo
        cardInfo: true, // Include cardInfo
      },
    });

    // Decrypt the sensitive card information
    const decryptedOrderInfo = orderInfo.map((order) => {
      // Check if cardInfo exists for the current order
      if (order.cardInfo) {
        // If cardInfo exists, then decrypt each field
        return {
          ...order,
          cardInfo: {
            ...order.cardInfo,
            cardType: order.cardInfo.cardType
              ? decrypt(order.cardInfo.cardType)
              : null,
            cardNumber: order.cardInfo.cardNumber
              ? decrypt(order.cardInfo.cardNumber)
              : null,
            expiryDate: order.cardInfo.expiryDate
              ? decrypt(order.cardInfo.expiryDate)
              : null,
            cvv: order.cardInfo.cvv ? decrypt(order.cardInfo.cvv) : null,
            cardHolder: order.cardInfo.cardHolder
              ? decrypt(order.cardInfo.cardHolder)
              : null,
          },
        };
      }
      // If cardInfo is null, return the order as is
      return order;
    });

    // Return decrypted order information
    res.json(decryptedOrderInfo);
  } catch (error) {
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res
      .status(500)
      .send("Error occurred while fetching user's order information.");
  }
}

module.exports = { submitOrder, getOrderInfo };
