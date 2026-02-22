const Razorpay = require('razorpay');

// Test Razorpay keys from .env
const KEY_ID = 'rzp_test_SF7PiZzi51KfQu';
const KEY_SECRET = '3CTXmhMiDp4tfMeGe4gfnIjC';

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET
});

async function testRazorpay() {
  console.log('Testing Razorpay Integration...\n');
  console.log('Key ID:', KEY_ID);
  console.log('Key Secret:', KEY_SECRET);
  console.log('Key Type:', KEY_ID.startsWith('rzp_test_') ? 'TEST MODE' : 'LIVE MODE');
  console.log('\n---\n');

  try {
    // Create a test order
    const options = {
      amount: 1000, // ₹10 in paisa (1000 paisa = ₹10)
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        description: 'Test donation for Nourish Together'
      }
    };

    console.log('Creating test order with amount:', options.amount, 'paisa (₹10)');
    
    const order = await razorpay.orders.create(options);
    
    console.log('\n✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount, 'paisa');
    console.log('Currency:', order.currency);
    console.log('Status:', order.status);
    console.log('Receipt:', order.receipt);
    
    console.log('\n---\n');
    console.log('✅ Razorpay TEST KEYS are working correctly!');
    console.log('\nYou can use these test keys to:');
    console.log('- Create orders in test mode');
    console.log('- Use test card numbers (4111 1111 1111 1111)');
    console.log('- No real money will be deducted');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.error && error.error.description) {
      console.log('Description:', error.error.description);
    }
  }
}

testRazorpay();
