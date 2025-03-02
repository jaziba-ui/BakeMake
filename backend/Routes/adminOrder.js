const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/adminVerify');
const Order = require('../models/Orders');

// Update the aggregation pipeline to include the `status` field
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$orderData', preserveNullAndEmptyArrays: true } },
      { 
        $match: { orderData: { $exists: true, $ne: [] } }
      },
      
      {
        $group: {
          _id: '$_id',
          userName: { $first: '$user.name' },
          userEmail: { $first: '$user.email' },
          userLocation: { $first: '$user.location' },
          products: {
            $push: {
              productName: '$orderData.name',
              quantity: '$orderData.qty',
              price: '$orderData.price',
            },
          },
          status: { $first: '$status' }, // Fetch the status from the document
        },
      },
      {
        $project: {
          orderId: '$_id',
          userName: 1,
          userEmail: 1,
          userLocation: 1,
          products: 1,
          status: 1, // Include status in the response
        },
      },
    ]);
    // console.log('Order Data:', orders);

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.patch('/update-order-status', verifyAdmin, async (req, res) => {
  const { orderId, status } = req.body;

  const validStatuses = ['waiting', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    const orders = await Order.find()
    .populate('User', 'name email location') // Populate name, email, and location fields
    .exec();
  res.json({ success: true, orders,message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});



module.exports = router;
