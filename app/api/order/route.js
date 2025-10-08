import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function makeTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    logger: true,
    debug: true,
  });
}

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const ext = mime.split("/")[1] || "bin";
  return { mime, base64, ext };
}

function toHtml(order) {
  const rows = order.items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px;text-align:center;border-bottom:1px solid #eee">${i.qty || 1}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #eee">₹${Number(i.price || 0).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Inter,system-ui,Arial,sans-serif;max-width:680px;margin:auto;color:#111">
    <h2 style="margin:0 0 12px">Order #${order.id}</h2>

    <h3 style="margin:16px 0 8px;font-size:14px;color:#555;letter-spacing:.04em;text-transform:uppercase">Customer</h3>
    <p style="margin:0 0 6px"><strong>${order.customer.name}</strong> &lt;${order.customer.email}&gt;</p>
    ${order.customer.phone ? `<p style="margin:0 0 6px">Phone: <strong>${order.customer.phone}</strong></p>` : ""}
    ${order.customer.address ? `<p style="margin:0 0 6px">Address: ${order.customer.address}</p>` : ""}

    <h3 style="margin:16px 0 8px;font-size:14px;color:#555;letter-spacing:.04em;text-transform:uppercase">Payment</h3>
    <p style="margin:0 0 6px">Payment Method: <strong>${order.paymentMethod.toUpperCase()}</strong></p>

    ${order.specialInstructions ? `<p style="margin:0 0 6px">Notes: ${order.specialInstructions}</p>` : ""}

    <h3 style="margin:16px 0 8px;font-size:14px;color:#555;letter-spacing:.04em;text-transform:uppercase">Items</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #eee">
      <thead>
        <tr style="background:#f7f7f7">
          <th align="left" style="padding:8px;border-bottom:1px solid #eee">Item</th>
          <th align="center" style="padding:8px;border-bottom:1px solid #eee">Qty</th>
          <th align="right" style="padding:8px;border-bottom:1px solid #eee">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="margin-top:12px">
      <p style="margin:4px 0">Subtotal: <strong>₹${order.subtotal.toLocaleString()}</strong></p>
      <p style="margin:4px 0">Shipping: <strong>${order.shipping ? `₹${order.shipping.toLocaleString()}` : "Free"}</strong></p>
      <p style="margin:4px 0;font-size:16px">Total: <strong>₹${order.total.toLocaleString()}</strong></p>
    </div>

    ${order.hasPrescription ? `<p style="margin-top:12px;color:#0a7">Prescription attached.</p>` : ""}
  </div>`;
}

function toText(order) {
  const items = order.items
    .map((i) => `- ${i.name} x${i.qty || 1} @ ₹${i.price}`)
    .join("\n");

  return [
    `Order #${order.id}`,
    `Customer: ${order.customer.name} (${order.customer.email})`,
    order.customer.phone ? `Phone: ${order.customer.phone}` : "",
    order.customer.address ? `Address: ${order.customer.address}` : "",
    "",
    `Payment Method: ${order.paymentMethod.toUpperCase()}`,
    order.specialInstructions ? `Notes: ${order.specialInstructions}` : "",
    "",
    "Items:",
    items,
    "",
    `Subtotal: ₹${order.subtotal}`,
    `Shipping: ${order.shipping ? `₹${order.shipping}` : "Free"}`,
    `Total: ₹${order.total}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data?.customer?.email || !Array.isArray(data?.items) || data.items.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid order payload" }, { status: 400 });
    }

    const order = {
      id: Math.random().toString(36).slice(2, 10).toUpperCase(),
      customer: {
        name: data.customer.name || "Customer",
        email: data.customer.email,
        phone: data.customer.phone || "",
        address: data.customer.address || "",
      },
      items: data.items.map((i) => ({ name: i.name, qty: i.qty || 1, price: Number(i.price || 0) })),
      subtotal: Number(data.subtotal || 0),
      shipping: Number(data.shipping || 0),
      total: Number(data.total || 0),
      paymentMethod: data.paymentMethod || "cod",
      specialInstructions: data.specialInstructions || "",
      hasPrescription: Boolean(data.prescription),
    };

    const transporter = makeTransport();
    await transporter.verify();

    const attachments = [];
    const parsed = parseDataUrl(data.prescription);
    if (parsed) {
      attachments.push({
        filename: `prescription_${order.id}.${parsed.ext}`,
        content: Buffer.from(parsed.base64, "base64"),
        contentType: parsed.mime,
      });
    }

    const html = toHtml(order);
    const text = toText(order);

    // Email to client
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_CLIENT,
      replyTo: order.customer.email,
      subject: `New Order #${order.id} — ₹${order.total.toLocaleString()}`,
      text,
      html,
      attachments,
    });

    // Email to customer
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: order.customer.email,
      subject: `Order confirmed #${order.id}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order email error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
