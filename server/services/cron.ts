import cron from 'node-cron';
import mongoose from 'mongoose';
import Inventory from '../models/Inventory';
import { sendEmail } from './mailer';

let hasSentNotificationRecently = false;

export const startCronJobs = () => {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    try {
      const lowStockItems = await Inventory.find({
        $expr: { $lt: ['$stock', '$lowStockThreshold'] }
      });

      if (lowStockItems.length > 0) {
        if (!hasSentNotificationRecently) {
          console.log('Low stock detected, sending email to admin...');
          
          let itemsListHtml = '<ul>';
          lowStockItems.forEach(item => {
            itemsListHtml += `<li>${item.name} (${item.type}): ${item.stock} left (Threshold: ${item.lowStockThreshold})</li>`;
          });
          itemsListHtml += '</ul>';

          await sendEmail(
            process.env.ADMIN_EMAIL || 'admin@example.com',
            'LOW STOCK ALERT - Pizza Delivery App',
            `<h3>Inventory Low Stock Alert</h3>
             <p>The following items are running low on stock:</p>
             ${itemsListHtml}
             <p>Please restock immediately.</p>`
          );
          
          hasSentNotificationRecently = true;
          
          // Reset the flag after 6 hours to avoid spamming
          setTimeout(() => {
            hasSentNotificationRecently = false;
          }, 6 * 60 * 60 * 1000);
        }
      } else {
        // If stock is replenished, reset the flag
        hasSentNotificationRecently = false;
      }
    } catch (error) {
      console.error('Error running inventory cron job:', error);
    }
  });
  console.log('Cron jobs started.');
};
